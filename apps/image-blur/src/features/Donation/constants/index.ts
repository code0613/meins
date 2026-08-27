interface DonationMethod {
  id: string;
  label: string;
  qrSrc: string;
  brandColor: string;
  labelColor: string;
  linkUrl: string;
}

export const DONATION_METHODS: DonationMethod[] = [
  {
    id: 'kakaopay',
    label: '카카오페이',
    qrSrc: '/kakao.png',
    brandColor: '#FEE500',
    labelColor: '#191600',
    linkUrl: 'https://qr.kakaopay.com/281006011000092640873420',
  },
];
