export const daNangLocations = [
  {
    label: 'Hải Châu',
    value: 'hai-chau',
    wards: ['Hải Châu I', 'Hải Châu II', 'Thạch Thang', 'Thanh Bình', 'Thuận Phước', 'Nam Dương']
  },
  {
    label: 'Sơn Trà',
    value: 'son-tra',
    wards: ['An Hải Bắc', 'An Hải Đông', 'Mân Thái', 'Nại Hiên Đông', 'Phước Mỹ', 'Thọ Quang']
  },
  {
    label: 'Ngũ Hành Sơn',
    value: 'ngu-hanh-son',
    wards: ['Mỹ An', 'Khuê Mỹ', 'Hòa Hải', 'Hòa Quý']
  },
  {
    label: 'Thanh Khê',
    value: 'thanh-khe',
    wards: ['An Khê', 'Chính Gián', 'Tam Thuận', 'Tân Chính', 'Thanh Khê Đông']
  },
  {
    label: 'Liên Chiểu',
    value: 'lien-chieu',
    wards: ['Hòa Khánh Bắc', 'Hòa Khánh Nam', 'Hòa Minh', 'Hòa Hiệp Bắc', 'Hòa Hiệp Nam']
  },
  {
    label: 'Cẩm Lệ',
    value: 'cam-le',
    wards: ['Hòa An', 'Hòa Phát', 'Hòa Thọ Đông', 'Hòa Thọ Tây', 'Khuê Trung']
  }
];

export const locationOptions = daNangLocations.map((district) => ({
  label: district.label,
  value: district.value,
  children: district.wards.map((ward) => ({
    label: ward,
    value: ward
  }))
}));
