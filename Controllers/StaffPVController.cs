using DoAnCSN.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoAnCSN.Controllers
{
    public class StaffPVController : Controller
    {
        UsegVnEntities db = new UsegVnEntities();
        // GET: StaffPV
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ThoiGianBieuPV(int MaNV)
        {
            var list = (from lst in db.ChiTietDVKHs
                        join dv in db.DICHVUs on lst.MaDV equals dv.ID
                        join c in db.CUSTOMERs on lst.MaKH equals c.ID
                        where lst.MaNV.Equals(MaNV)
                        select new ViewBagModel
                        {
                            MaNV = lst.MaNV,
                            MaDV = lst.MaDV,
                            MaKH = lst.MaKH,
                            HO_TEN = c.HO_TEN,
                            PHONE_NUMBER = c.PHONE_NUMBER,
                            Buoi = lst.Buoi,
                            TEN_DICH_VU = dv.TEN_DICH_VU,
                            TEN_QUY_TRINH = lst.TenQuyTrinh,
                            THOI_GIAN_TU = lst.ThoiGianTu,
                            THOI_GIAN_DEN = lst.ThoiGianTu,
                            NGAY_THUC_HIEN = lst.NgayThucHien,
                            Checked = lst.Checked
                        }).ToList();
            ViewBag.lstDVKH = list;
            return View();
        }

        public ActionResult XacNhanHoanThanh(int MaKH, int MaNV, int MaDV, int Buoi)
        {
            ChiTietDVKH dvkh = db.ChiTietDVKHs
                         .Where(w => w.MaDV.Equals(MaDV)
                                  && w.MaKH.Equals(MaKH)
                                  && w.MaNV.Equals(MaNV)
                                  && w.Buoi.Equals(Buoi))
                         .SingleOrDefault();
            dvkh.Checked = 1;
            db.SaveChanges();

            return RedirectToAction("ThoiGianBieuPV", "StaffPV", new {MaNV = MaNV});  
        }
    }
}