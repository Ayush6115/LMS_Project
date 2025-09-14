using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using lms_be.Services;
using lms_be.DTOs;

[ApiController]
[Route("api/payments")]
[Authorize(Roles = "Student")]
public class PaymentsController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly string _stripeSecret;

    public PaymentsController(ICourseService courseService, IConfiguration config)
    {
        _courseService = courseService;
        _stripeSecret = config["Stripe:SecretKey"];
        StripeConfiguration.ApiKey = _stripeSecret;
    }

    // 1️⃣ Create Stripe Checkout Session
    [HttpPost("create-session/{courseId}")]
    public IActionResult CreateCheckoutSession(int courseId)
    {
        var studentId = int.Parse(User.FindFirst("id")?.Value);
        var domain = "http://localhost:3000"; // Your frontend URL

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = 1000, // Amount in cents ($10)
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"Course #{courseId} Payment"
                        }
                    },
                    Quantity = 1
                }
            },
            Mode = "payment",
            SuccessUrl = $"{domain}/student/courses/payment-success?courseId={courseId}&sessionId={{CHECKOUT_SESSION_ID}}",
            CancelUrl = $"{domain}/student/courses",
            Metadata = new Dictionary<string, string>
            {
                { "courseId", courseId.ToString() },
                { "studentId", studentId.ToString() }
            }
        };

        var service = new SessionService();
        Session session = service.Create(options);

        return Ok(new { paymentUrl = session.Url });
    }

    // 2️⃣ Confirm Payment after redirect from Stripe Checkout
    [HttpPost("confirm/{courseId}")]
    public IActionResult ConfirmPayment(int courseId, [FromBody] ConfirmPaymentRequestDto request)
    {
        try
        {
            string sessionId = request.SessionId;
            Console.WriteLine($"[ConfirmPayment] Received courseId={courseId}, sessionId={sessionId}");

            var service = new SessionService();
            var session = service.Get(sessionId);

            Console.WriteLine($"[ConfirmPayment] Stripe session status: {session.PaymentStatus}, id: {session.Id}");

            if (session.PaymentStatus == "paid")
            {
                var studentId = int.Parse(User.FindFirst("id")?.Value);
                Console.WriteLine($"[ConfirmPayment] Enrolling studentId={studentId} in courseId={courseId}");

                _courseService.EnrollStudent(studentId, courseId);

                return Ok(new { message = "Payment confirmed! You are now enrolled." });
            }

            Console.WriteLine("[ConfirmPayment] Payment not completed.");
            return BadRequest(new { message = "Payment not completed." });
        }
        catch (Exception ex)
        {
            Console.WriteLine("[ConfirmPayment] Exception: " + ex.ToString());
            return StatusCode(500, new { message = "Error confirming payment.", error = ex.Message });
        }
    }



    // 3️⃣ Stripe Webhook (Optional, recommended)
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var stripeEvent = EventUtility.ParseEvent(json);

        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Session;
            if (session != null && session.Metadata.TryGetValue("courseId", out string courseIdStr)
                && session.Metadata.TryGetValue("studentId", out string studentIdStr))
            {
                int courseId = int.Parse(courseIdStr);
                int studentId = int.Parse(studentIdStr);

                _courseService.EnrollStudent(studentId, courseId);
            }
        }

        return Ok();
    }
}
