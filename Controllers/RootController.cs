using System;
using System.Net;
using System.Net.Mail;
using System.Web.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace DoAnCSN.Controllers
{
    public class RootController : Controller
    {
        usevnEntities1 db = new usevnEntities1();

        public static bool isSendEmail(string toEmail, string subject, string body)
        {
            try
            {
                SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("ducpham2004nha@gmail.com", "oclezgkegttyuits"),
                    EnableSsl = true
                };

                MailMessage mail = new MailMessage
                {
                    From = new MailAddress("ducpham2004nha@gmail.com", "UseVN"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true 
                };

                mail.To.Add(toEmail);
                smtpClient.Send(mail);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email: " + ex.Message);
                return false;
            }
        }

        public static string isHashPassword(string password)
        {
            using (SHA1 sha1 = SHA1.Create())
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

                byte[] hashBytes = sha1.ComputeHash(passwordBytes);

                StringBuilder hashStringBuilder = new StringBuilder();
                foreach (var byteValue in hashBytes)
                {
                    hashStringBuilder.Append(byteValue.ToString("x2"));
                }

                return hashStringBuilder.ToString();
            }
        }

        public static bool isVerifyPassword(string enteredPassword, string storedHash)
        {
            string enteredPasswordHash = isHashPassword(enteredPassword);
            return storedHash == enteredPasswordHash;
        }

        public JsonResult isSendResponse(int code, string message)
        {
            return Json(new { code, message }, JsonRequestBehavior.AllowGet);
        }
    }
}
