//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DoAnCSN.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class DanhSachDVKH
    {
        public int ID { get; set; }
        public int MaDV { get; set; }
        public int MaKH { get; set; }
        public int SoNgayThucHien { get; set; }
        public string TongTien { get; set; }
        public int SoNgayConLai { get; set; }
        public int Status { get; set; }
        public int DaThanhToan { get; set; }
        public Nullable<int> THANHTOANBANG { get; set; }
    
        public virtual CUSTOMER CUSTOMER { get; set; }
        public virtual DICHVU DICHVU { get; set; }
    }
}
