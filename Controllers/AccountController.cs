using DoAnCSN.Models;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoAnCSN.Controllers
{
    public class AccountController : RootController
    {
        usevnEntities1 db = new usevnEntities1();

        public ActionResult Register()
        {
            return View();
        }

        public static string GenerateNumericOTP(int length = 6)
        {
            var random = new Random();
            string otp = string.Empty;

            for (int i = 0; i < length; i++)
            {
                otp += random.Next(0, 10).ToString();
            }

            return otp;
        }

        private JsonResult SendVerificationEmail(uv_users user)
        {
            try
            {
                string path = Server.MapPath("~/Content/ContentMail/Register.html");
                string contentMessage = System.IO.File.ReadAllText(path);

                contentMessage = contentMessage.Replace("{{fullName}}", user.fullName);
                contentMessage = contentMessage.Replace("{{active_token}}", user.activeToken);

                string subject = $"Chào mừng {user.fullName}, đến với UseGo ✨";
                bool isSent = isSendEmail(user.email, subject, contentMessage);

                if (isSent)
                    return isSendResponse(1, "Email đã được gửi tới hòm thư của bạn.");
                else
                    return isSendResponse(0, "Thất bại không thể thực hiện gửi đi.");
            }
            catch (Exception ex)
            {
                return isSendResponse(0, $"Error: {ex.Message}");
            }
        }

        public JsonResult RegisterMail(uv_users user)
        {
            if (!ModelState.IsValid)
            {
                return isSendResponse(0, "Dữ liệu không hợp lệ.");
            }

            var existingUserAuth = db.uv_users.FirstOrDefault(u => u.email == user.email && u.status == 1);
            
            if (existingUserAuth != null)
            {
                return isSendResponse(0, "Email đã tồn tại trên hệ thống.");
            }

            var existingUser = db.uv_users.FirstOrDefault(u => u.email == user.email && u.status == 0);

            if (existingUser != null)
            {
                existingUser.fullName = user.fullName;
                existingUser.password = isHashPassword(user.password);
                existingUser.activeToken = GenerateNumericOTP();
                existingUser.createAt = DateTime.Now; 

                db.SaveChanges();
            }
            else
            {
                user.fullName = user.fullName;
                user.password = isHashPassword(user.password);
                user.firstLogin = 1;
                user.status = 0;
                user.type = 2;
                user.avatar = "avarta_default.png";
                user.activeToken = GenerateNumericOTP();
                user.createAt = DateTime.Now;

                db.uv_users.Add(user); 
                db.SaveChanges();
            }

            return SendVerificationEmail(user);
        }

        public JsonResult RegisterOTP(uv_users user)
        {
            var existingUser = db.uv_users.FirstOrDefault(u => u.activeToken == user.activeToken);

            if (ModelState.IsValid)
            {
                if (existingUser != null)
                {
                    if (existingUser != null)
                    {
                        existingUser.activeToken = null;
                        existingUser.status = 1;

                        db.SaveChanges();
                    }
                    return isSendResponse(1, "Đăng nhập và trải nghiệm thôi 🎉.");
                }    
                else
                    return isSendResponse(0, "Mã xác thực không chính xác.");
            }

            return isSendResponse(0, "Dữ liệu không hợp lệ.");
        }

        public ActionResult Login()
        {
            return View();
        }

        public JsonResult LoginAccept(uv_users user)
        {
            if (!ModelState.IsValid)
            {
                return isSendResponse(0, "Dữ liệu không hợp lệ.");
            }

            var existingUser = db.uv_users.FirstOrDefault(u => u.email == user.email);

            if (existingUser == null)
            {
                return isSendResponse(0, "Email không tồn tại trên hệ thống.");
            }

            if (!isVerifyPassword(user.password, existingUser.password))
            {
                return isSendResponse(0, "Mật khẩu không đúng.");
            }

            string tokenLogin = Guid.NewGuid().ToString("N");

            var token = new uv_login_tokens
            {
                userId = existingUser.id,
                tokenLogin = tokenLogin,
                createAt = DateTime.Now
            };

            db.uv_login_tokens.Add(token);
            db.SaveChanges();

            Session["User"] = user;
            return isSendResponse(1, "Đăng nhập thành công.");
        }

    }
}