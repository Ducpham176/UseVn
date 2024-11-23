using DoAnCSN.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoAnCSN.Controllers
{
    public class HomeController : Controller
    {
        UsegVnEntities db = new UsegVnEntities();

        public ActionResult Index()
        {
            ViewBag.Title = "Trang Chủ";
            ViewBag.Css = new string[] { "Home" };
            ViewBag.Js = new string[] { "Home" };
            ViewBag.Libary_Swiper = true;

            return View();
        }

        public ActionResult Product(int? page)
        {

            int pageSize = 6;
            int pageNumber = page ?? 1;

            var products = db.SANPHAMs.OrderBy(p => p.ID).Where(p => p.STATUS == 1 && p.SO_LUONG != 0)
                                      .Skip((pageNumber - 1) * pageSize)
                                      .Take(pageSize)
                                      .ToList();


            int totalProducts = db.SANPHAMs.Count();
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalProducts / pageSize);
            ViewBag.CurrentPage = pageNumber;

            return View(products);
        }




        public ActionResult Header()
        {
            return PartialView("Header"); 
        }

        public ActionResult Footer()
        {
            return PartialView("Footer");
        }

        public ActionResult ChiTietSanPham(int id)
        {
            // Tìm sách theo mã sách (id)
            var SanPham = db.SANPHAMs.FirstOrDefault(s => s.ID == id);

            return View(SanPham);
        }


    }
}