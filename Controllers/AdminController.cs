using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using DoAnCSN.Models;
using Microsoft.Ajax.Utilities;

namespace DoAnCSN.Controllers
{
    public class AdminController : Controller
    {
        UsegVnEntities db = new UsegVnEntities();
        private static  int MaKHGlobal = 0;
        private static int MaDVGlobal = 0;

        private string convertNgay(string Ngay)
        {
            string[] arr = Ngay.Split('-');
            string s = arr[2] + "/" + arr[1] + "/" + arr[0];
            return s;
        }
        private string convertGio(string Gio)
        {
            string gioConvert = "";
            string[] arr = Gio.Split(':');
            int hour = int.Parse(arr[0]);
            int minutes = int.Parse(arr[1]);
            if (minutes != 0)
            {
                if (hour < 13)
                {
                    gioConvert = hour + " giờ " + minutes + " sáng";
                }
                else
                {
                    gioConvert = hour + " giờ " + minutes + " chiều";
                }
            }
            else
            {
                if (hour < 13)
                {
                    gioConvert = hour + " giờ sáng";
                }
                else
                {
                    gioConvert = hour + " giờ chiều";
                }
            }
            return gioConvert;
        }
        public ActionResult Admin()
        {
            return View();
        }
        // GET: Admin
        [HttpGet]
        public ActionResult DangKiTuVan()
        {
            return View();
        }

        
        [HttpPost]
        public ActionResult DangKiTuVan(FormCollection f)
        {
            string TenKH = f["TenKH"];
            string NgaySinh = convertNgay(f["NgaySinh"]);
            string SDT = f["SDT"];
            string GioTuVan = convertGio(f["GioTuVan"]);
            string NgayTuVan = convertNgay(f["NgayTuVan"]);


            CUSTOMER c = new CUSTOMER();
            c.HO_TEN = TenKH;
            c.NGAY_SINH = NgaySinh;
            c.PHONE_NUMBER = SDT;
            c.GIO = GioTuVan;
            c.NGAY_TU_VAN = NgayTuVan;
            //c.STATUS = 1;
            //c.CHECKED = 0;
            c.MaTT = 1;
            db.CUSTOMERs.Add(c);
            db.SaveChanges();

            return View();
        }

        [HttpGet]
        public ActionResult SuaTTKhachHang(int MaKH)
        {
            var kh = db.CUSTOMERs.Where(w => w.ID.Equals(MaKH)).FirstOrDefault();
            return View(kh);
        }

        [HttpPost]
        public ActionResult SuaTTKhachHang(FormCollection f)
        {
            string TenKH = f["TenKH"];
            string NgaySinh = f["NgaySinh"];
            string SDT = f["SDT"];
            string GioTuVan = convertGio(f["GioTuVan"]);
            string NgayTuVan = convertNgay(f["NgayTuVan"]);


            CUSTOMER c = new CUSTOMER();
            c.HO_TEN = TenKH;
            c.NGAY_SINH = NgaySinh;
            c.PHONE_NUMBER = SDT;
            c.GIO = GioTuVan;
            c.NGAY_TU_VAN = NgayTuVan;
            
            db.CUSTOMERs.Add(c);
            db.SaveChanges();

            return View();
        }

        [HttpGet]
        public ActionResult QuanLiDangKiTuVan(int? MaTT)
        {
            int iMaTT = (MaTT ?? 1);
            ViewBag.CurrentMaTT = iMaTT;
            
            //if(iMaTT == 4)
            //{
            //    ViewBag.khs = (from c in db.CUSTOMERs
            //                   join tt in db.TRANGTHAIs on c.MaTT equals tt.ID
            //                   where c.MaTT.Equals(iMaTT)
            //                   orderby c.ID descending
            //                   // GroupJoin để lấy các dịch vụ của khách hàng
            //                   join dsdvkh in db.DanhSachDVKHs on c.ID equals dsdvkh.MaKH into dsdvGroup
            //                   select new CustomerModel
            //                   {
            //                       ID = c.ID,
            //                       HO_TEN = c.HO_TEN,
            //                       NGAY_SINH = c.NGAY_SINH,
            //                       PHONE_NUMBER = c.PHONE_NUMBER,
            //                       NGAY_TU_VAN = c.NGAY_TU_VAN,
            //                       GIO = c.GIO,
            //                        // Kiểm tra phương thức thanh toán
            //                       TEN_TRANG_THAI = dsdvGroup.Any(d => d.THANHTOANBANG == 1) ? "Thanh toán Online" : "Thanh toán Tiền mặt"
                                   
            //                   }).ToList();
            //}
            //else
            //{
                
            //}

            ViewBag.khs = (from c in db.CUSTOMERs
                           join tt in db.TRANGTHAIs on c.MaTT equals tt.ID
                           //join dsdvkh in db.DanhSachDVKHs on c.ID equals dsdvkh.MaKH
                           where c.MaTT.Equals(iMaTT)
                           orderby c.ID descending
                           //group dsdvkh by new { dsdvkh.THANHTOANBANG } into g
                           select new CustomerModel
                           {
                               ID = c.ID,
                               HO_TEN = c.HO_TEN,
                               NGAY_SINH = c.NGAY_SINH,
                               PHONE_NUMBER = c.PHONE_NUMBER,
                               NGAY_TU_VAN = c.NGAY_TU_VAN,
                               GIO = c.GIO,
                               TEN_TRANG_THAI = tt.Ten_Trang_Thai
                           }).ToList();
            return View();
        }

        [HttpGet]
        public JsonResult DVKH(int MaKH)
        {
            var dvkh = (from dsdvkh in db.DanhSachDVKHs
                        join dv in db.DICHVUs on dsdvkh.MaDV equals dv.ID
                        where dsdvkh.MaKH.Equals(MaKH)
                        select new
                        {
                            dsdvkh.MaKH,
                            dsdvkh.MaDV,
                            dv.TEN_DICH_VU,
                            dv.SO_NGAY_THUC_HIEN,
                            giaTien = dv.SO_NGAY_THUC_HIEN * dv.GIA_DICH_VU,
                            TINH_TRANG_THANH_TOAN = dsdvkh.DaThanhToan == 1 ? "Đã thanh toán" :
                            dsdvkh.THANHTOANBANG == 1 ? "Thanh toán online" : "Thanh toán tiền mặt"

                        }).ToList();
            return Json(dvkh, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult AssignEmployee(int MaKH)
        {
            var employees = (from u in db.USERS
                             join ur in db.USER_ROLE on u.ID equals ur.USER_ID
                             where ur.ROLE_ID == 2
                             select new
                             {
                                 u.ID,
                                 u.NAME,
                                 Assigned = db.AssignmentCustomers.Any(a => a.MaKH == MaKH && a.MaNV == u.ID)
                             }).ToList();

            return Json(employees, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AssignEmployee(int customerId, List<int> employeeIds)
        {
            var khs = db.AssignmentCustomers
                        .Where(w => w.MaKH.Equals(customerId)).SingleOrDefault();
            if (khs != null)
            {
                foreach (var item in employeeIds)
                {
                    AssignmentCustomer assign = db.AssignmentCustomers.Where(w => w.MaKH.Equals(customerId)).SingleOrDefault();
                    assign.MaKH = customerId;
                    assign.MaNV = item;
                    db.SaveChanges();
                }
            }

            else
            {
                foreach (var item in employeeIds)
                {
                    AssignmentCustomer assign = new AssignmentCustomer();
                    assign.MaKH = customerId;
                    assign.MaNV = item;
                    db.AssignmentCustomers.Add(assign);
                    db.SaveChanges();

                    CUSTOMER c = db.CUSTOMERs.Where(w => w.ID.Equals(customerId)).SingleOrDefault();
                    c.MaTT = 2;
                    db.SaveChanges();
                }
            }
            return Json(new {success = true}, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult DangKiDV(int MaKH)
        {
            
            CUSTOMER c = db.CUSTOMERs.Where(w => w.ID == MaKH).SingleOrDefault();
            ViewBag.listDVKH = (from dsdvkh in db.DanhSachDVKHs
                              join dv in db.DICHVUs on dsdvkh.MaDV equals dv.ID
                              where dsdvkh.MaKH.Equals(MaKH)
                              select new ViewBagModel
                              {
                                  TEN_DICH_VU = dv.TEN_DICH_VU,
                                  SO_NGAY_THUC_HIEN = dsdvkh.SoNgayThucHien,
                                  TONG_TIEN = dsdvkh.TongTien
                              }).ToList();
            ViewBag.listDV = db.DICHVUs.ToList();
            
            return View(c);
        }

        
        [HttpPost]
        public ActionResult DangKiDV(FormCollection f)
        {
            int MaKH = int.Parse(f["MaKH"]);
            int MaDV = int.Parse(f["MaDV"]);
            int SoNgayThucHien = int.Parse(f["SoNgay"]);
            string TongTien = f["GiaTien"];
            int ThanhToanBang = int.Parse(f["ThanhToanBang"]);
            ViewBag.CurrectTT = ThanhToanBang;

            DanhSachDVKH dsdvkh = new DanhSachDVKH();
            dsdvkh.MaKH = MaKH;
            dsdvkh.MaDV = MaDV;
            dsdvkh.SoNgayThucHien = SoNgayThucHien;
            dsdvkh.SoNgayConLai = SoNgayThucHien;
            dsdvkh.TongTien = TongTien;
            dsdvkh.Status = 0;
            dsdvkh.THANHTOANBANG = ThanhToanBang;

            db.DanhSachDVKHs.Add(dsdvkh);
            db.SaveChanges();

            CUSTOMER c = db.CUSTOMERs.Where(w => w.ID.Equals(MaKH)).SingleOrDefault();
            c.MaTT = 4;
            db.SaveChanges();

            return RedirectToAction("DangKiDV", "Admin", new {MaKH = MaKH});
        }
        public ActionResult ThucHienDV()
        {
            ViewBag.listDVKH = from c in db.CUSTOMERs
                               join dsdvkh in db.DanhSachDVKHs on c.ID equals dsdvkh.MaKH
                               group dsdvkh by new { dsdvkh.MaKH, c.HO_TEN, c.NGAY_SINH, c.PHONE_NUMBER } into g
                               where g.All(x => x.DaThanhToan == 1)
                               select new ViewBagModel
                               {
                                   MaKH = g.Key.MaKH,
                                   HO_TEN = g.Key.HO_TEN,
                                   NGAY_SINH = g.Key.NGAY_SINH,
                                   PHONE_NUMBER = g.Key.PHONE_NUMBER,
                                   SoLuongDV = g.Count(),
                                   ConLai = g.Count(x => x.Status == 0)
                               };
            return View();
        }

        public ActionResult ChiTietDichVuKH(int MaKH)
        {
            var kh = db.CUSTOMERs.Where(w => w.ID.Equals(MaKH)).SingleOrDefault();
            ViewBag.listDVKH = from dsdvkh in db.DanhSachDVKHs
                               join dv in db.DICHVUs on dsdvkh.MaDV equals dv.ID
                               where dsdvkh.MaKH.Equals(MaKH)
                               select new ViewBagModel
                               {
                                   MaKH = dsdvkh.MaKH,
                                   MaDV = dsdvkh.MaDV,
                                   TEN_DICH_VU = dv.TEN_DICH_VU,
                                   SO_NGAY_THUC_HIEN = dsdvkh.SoNgayThucHien,
                                   SO_NGAY_CON_LAI = dsdvkh.SoNgayConLai
                               };
            return View(kh);
        }

        [HttpGet]
        public ActionResult ChiTietDichVu(int MaKH, int MaDV)
        {
            MaKHGlobal = MaKH;
            MaDVGlobal = MaDV;
            ViewBag.TEN_DICH_VU = db.DICHVUs.Where(w => w.ID.Equals(MaDV)).Select(s => s.TEN_DICH_VU).FirstOrDefault();
            ViewBag.ListNV = (from u in db.USERS
                              join ur in db.USER_ROLE on u.ID equals ur.USER_ID
                              where ur.ROLE_ID == 3
                              select u)
                              .ToList();
            ViewBag.So_Buoi_Thuc_Hien = (from dv in db.DICHVUs
                                         join dsdvkh in db.DanhSachDVKHs on dv.ID equals dsdvkh.MaDV
                                         where dsdvkh.MaDV.Equals(MaDV) && dsdvkh.MaKH.Equals(MaKH)
                                         select dv.SO_NGAY_THUC_HIEN).SingleOrDefault();
            //var listDV = db.ChiTietDVKHs.Where(w => w.MaDV.Equals(MaDV) && w.MaKH.Equals(MaKH)).ToList();                            
            ViewBag.listDV = (from chitiet in db.ChiTietDVKHs
                              join u in db.USERS on chitiet.MaNV equals u.ID
                              where chitiet.MaKH.Equals(MaKH) && chitiet.MaDV.Equals(MaDV)
                              select new ViewBagModel
                              {
                                  HO_TEN = u.NAME,
                                  TEN_QUY_TRINH = chitiet.TenQuyTrinh,
                                  Buoi = chitiet.Buoi,
                                  THOI_GIAN_TU = chitiet.ThoiGianTu,
                                  THOI_GIAN_DEN = chitiet.ThoiGianDen,
                                  NGAY_THUC_HIEN = chitiet.NgayThucHien
                              }).ToList();
            return View();
        }

        [HttpPost]
        public ActionResult ChiTietDichVu(FormCollection f)
        {
            ChiTietDVKH chitiet = new ChiTietDVKH();
            chitiet.MaKH = MaKHGlobal;
            chitiet.MaDV = MaDVGlobal;
            chitiet.MaNV = int.Parse(f["MaNV"]);
            chitiet.TenQuyTrinh = f["TEN_QUY_TRINH"];
            chitiet.Buoi = int.Parse(f["BUOI"]);
            chitiet.ThoiGianTu = convertGio(f["THOI_GIAN_TU"]);
            chitiet.ThoiGianDen = convertGio(f["THOI_GIAN_DEN"]);
            chitiet.NgayThucHien = convertNgay(f["NGAY_THUC_HIEN"]);
            db.ChiTietDVKHs.Add(chitiet);   
            db.SaveChanges();
            return RedirectToAction("ChiTietDichVu", "Admin", new { MaKH = MaKHGlobal, MaDV = MaDVGlobal});
        }
        public ActionResult XacNhanThanhToan(int MaKH)
        {
            CUSTOMER c = db.CUSTOMERs.Where(w => w.ID.Equals(MaKH)).SingleOrDefault();
            c.MaTT = 5;
            db.SaveChanges();

            List<DanhSachDVKH> list = db.DanhSachDVKHs
                                        .Where(w => w.MaKH.Equals(MaKH))
                                        .ToList();
            foreach(var item in list)
            {
                item.DaThanhToan = 1;
            }
            db.SaveChanges();

            return RedirectToAction("QuanLiDangKiTuVan", "Admin");
        }

        public ActionResult ThanhToanDV(int MaKH, int MaDV)
        {
            DanhSachDVKH dsdvkh = db.DanhSachDVKHs
                                    .Where(w => w.MaKH == MaKH
                                             && w.MaDV == MaDV)
                                    .SingleOrDefault();
            dsdvkh.DaThanhToan = 1;
            db.SaveChanges();


            List<DanhSachDVKH> list = db.DanhSachDVKHs.Where(w => w.MaKH == MaKH).ToList();
            foreach(var item in list)
            {
                if(item.DaThanhToan == 0)
                {
                    return RedirectToAction("QuanLiDangKiTuVan", "Admin", new {MaTT = 4});
                }
            }

            CUSTOMER c = db.CUSTOMERs.Where(w => w.ID.Equals(MaKH)).SingleOrDefault();
            c.MaTT = 5;
            db.SaveChanges();

            return RedirectToAction("QuanLiDangKiTuVan", "Admin", new { MaTT = 4 });
        }
        public ActionResult LichSuChamSoc()
        {
            return View();
        }

        public ActionResult QuanLiSanPham(int? page)
        {
            int pageSize = 6;
            int pageNumber = page ?? 1;
            var products = db.SANPHAMs.OrderBy(p => p.ID).Where(p => p.STATUS == 1)
                                      .Skip((pageNumber - 1) * pageSize)
                                      .Take(pageSize)
                                      .ToList();
            int totalProducts = db.SANPHAMs.Count();
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalProducts / pageSize);
            ViewBag.CurrentPage = pageNumber;
            if (pageNumber == 0)
            {
                return RedirectToAction("QuanLiSanPham", new { page = 1 });
            }

            return View(products);
        }

        public ActionResult SuaSanPham(int? page)
        {
            int pageSize = 6;
            int pageNumber = page ?? 1;
            var products = db.SANPHAMs.OrderBy(p => p.ID)
                                  .Skip((pageNumber - 1) * pageSize)
                                  .Take(pageSize)
                                  .ToList();

            int totalProducts = db.SANPHAMs.Count();
            ViewBag.TotalPages = (int)Math.Ceiling((double)totalProducts / pageSize);
            ViewBag.CurrentPage = pageNumber;

            return View(products);
        }

        public ActionResult DoanhThuBanHang()
        {
            return View();
        }
        [HttpPost]
        public ActionResult SuaSanPham(List<HttpPostedFileBase> HinhAnhFiles, List<SANPHAM> Products)
        {
            if (ModelState.IsValid && Products != null)
            {
                for (int i = 0; i < Products.Count; i++)
                {
                    var product = Products[i];
                    var existingProduct = db.SANPHAMs.FirstOrDefault(p => p.ID == product.ID);
                    if (existingProduct != null)
                    {
                        // Cập nhật thông tin sản phẩm
                        existingProduct.TENSP = product.TENSP;
                        existingProduct.TENSP = product.TENSP;
                        existingProduct.MOTA_SP = product.MOTA_SP;
                        existingProduct.NAM_SAN_XUAT = product.NAM_SAN_XUAT;
                        existingProduct.GIA = product.GIA;
                        existingProduct.STATUS = product.STATUS;

                        if (HinhAnhFiles != null && HinhAnhFiles[i] != null)
                        {
                            var file = HinhAnhFiles[i];


                            string fileName = Path.GetFileNameWithoutExtension(file.FileName);
                            string extension = Path.GetExtension(file.FileName);
                            string newFileName = fileName + "_" + Guid.NewGuid() + extension;

                            string path = Path.Combine(Server.MapPath("~/Image/SanPham/"), newFileName);

                            file.SaveAs(path);

                            existingProduct.HINH_ANH = newFileName;

                        }
                        else
                        {
                            TempData["Message"] = $"thay đổi thành công.";
                        }
                    }
                }

                db.SaveChanges();
                return RedirectToAction("SuaSanPham");
            }

            return View(Products);
        }


        public ActionResult Search(string productName = "", string productType = "", decimal? priceFrom = null, decimal? priceTo = null)
        {
            var results = from s in db.SANPHAMs
                          select s;

            if (!string.IsNullOrEmpty(productName))
            {
                results = results.Where(s => s.TENSP.Contains(productName));
            }

            if (!string.IsNullOrEmpty(productType))
            {
                results = results.Where(s => s.LOAISP == productType);
            }

            if (priceFrom.HasValue)
            {
                results = results.Where(s => s.GIA >= priceFrom.Value);
            }

            if (priceTo.HasValue)
            {
                results = results.Where(s => s.GIA <= priceTo.Value);
            }

            var productList = results.ToList();

            ViewBag.ProductName = productName;
            ViewBag.ProductType = productType;
            ViewBag.PriceFrom = priceFrom;
            ViewBag.PriceTo = priceTo;

            return View(productList);
        }




        public ActionResult Sidebar_Menu()
        {
            return PartialView("Sidebar_Menu");
        }

        public ActionResult Navbar_Custom()
        {
            return PartialView("Navbar_Custom");
        }

        public ActionResult Footer()
        {
            return PartialView("Footer");
        }

        public ActionResult ThemSanPham()
        {
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ThemSanPham(SANPHAM sanpham, HttpPostedFileBase HinhAnhFiles)
        {
            TempData["Message"] = $"Đã có lỗi xảy ra.";
            if (ModelState.IsValid)
            {
                if (HinhAnhFiles != null)
                {

                    var file = HinhAnhFiles;
                    TempData["Message"] = $"Đã tải lên hình ảnh thành công.";

                    // Tạo tên file mới để tránh trùng lặp
                    string fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    string extension = Path.GetExtension(file.FileName);
                    string newFileName = fileName + "_" + Guid.NewGuid() + extension;

                    // Đường dẫn lưu file
                    string path = Path.Combine(Server.MapPath("~/Image/SanPham/"), newFileName);

                    // Lưu file lên server
                    file.SaveAs(path);

                    // Lưu tên file mới vào thuộc tính của đối tượng SANPHAM
                    sanpham.HINH_ANH = newFileName;
                }
                else
                {
                    TempData["Message"] = $"Lỗi: Không có hình ảnh được tải lên.";
                }
                sanpham.STATUS = 1;
                db.SANPHAMs.Add(sanpham);
                db.SaveChanges();
                return RedirectToAction("ThemSanPham");
            }

            return View(sanpham);
        }


        [HttpPost]
        public ActionResult Xoa(int id)
        {
            var product = db.SANPHAMs.Find(id);
            if (product == null)
            {
                return HttpNotFound();
            }

            product.STATUS = 0;
            db.SaveChanges();

            return RedirectToAction("QuanLiSanPham", "Admin");
        }

    }
}
