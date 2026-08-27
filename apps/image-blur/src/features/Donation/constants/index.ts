interface DonationMethod {
  id: string;
  label: string;
  qrSrc: string;
  brandColor: string;
  labelColor: string;
  /** HTTPS 링크가 있는 수단만 탭으로 앱을 열 수 있다. 토스는 커스텀 스킴뿐이라 없다 */
  linkUrl?: string;
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
  {
    id: 'toss',
    label: '토스',
    qrSrc: '/toss.png',
    brandColor: '#3182F6',
    labelColor: '#FFFFFF',
  },
];
