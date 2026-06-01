/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SurahDetail } from '../types';

export const fallbackSurahs: Record<number, SurahDetail> = {
  1: {
    nomor: 1,
    nama: "الفاتحة",
    namaLatin: "Al-Fatihah",
    jumlahAyat: 7,
    tempatTurun: "Mekah",
    arti: "Pembukaan",
    deskripsi: "Surat Al Fatihah (Pembukaan) yang diturunkan di Mekah...",
    audioFull: {
      "01": "https://equran.nos.wjv-1.neo.id/audio-full/Abdullah-Al-Juhany/001.mp3",
      "05": "https://equran.nos.wjv-1.neo.id/audio-full/Mishary-Rashid-Al-Afasy/001.mp3"
    },
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        teksLatin: "Bismillāhir-raḥmānir-raḥīm(i).",
        teksIndonesia: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001001.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001001.mp3"
        }
      },
      {
        nomorAyat: 2,
        teksArab: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        teksLatin: "Al-ḥamdu lillāhi rabbil-‘ālamīn(a).",
        teksIndonesia: "Segala puji bagi Allah, Tuhan seluruh alam,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001002.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001002.mp3"
        }
      },
      {
        nomorAyat: 3,
        teksArab: "الرَّحْمَٰنِ الرَّحِيمِ",
        teksLatin: "Ar-raḥmānir-raḥīm(i).",
        teksIndonesia: "Yang Maha Pengasih, Maha Penyayang,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001003.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001003.mp3"
        }
      },
      {
        nomorAyat: 4,
        teksArab: "مَالِكِ يَوْمِ الدِّينِ",
        teksLatin: "Māliki yaumid-dīn(i).",
        teksIndonesia: "Pemilik hari pembalasan.",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001004.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001004.mp3"
        }
      },
      {
        nomorAyat: 5,
        teksArab: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        teksLatin: "Iyyāka na‘budu wa iyyāka nasta‘īn(u).",
        teksIndonesia: "Hanya kepada-Mulah kami menyembah dan hanya kepada-Mulah kami memohon pertolongan.",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001005.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001005.mp3"
        }
      },
      {
        nomorAyat: 6,
        teksArab: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        teksLatin: "Ihdinaṣ-ṣirāṭal-mustaqīm(a).",
        teksIndonesia: "Tunjukkanlah kami jalan yang lurus,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001006.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001006.mp3"
        }
      },
      {
        nomorAyat: 7,
        teksArab: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        teksLatin: "Ṣirāṭal-laḏīna an‘amta ‘alaihim gairil-magḍūbi ‘alaihim walāḍ-ḍāllīn(a).",
        teksIndonesia: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001007.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/001/001007.mp3"
        }
      }
    ],
    suratSelanjutnya: { nomor: 2, nama: "البقرة", namaLatin: "Al-Baqarah", jumlahAyat: 286 },
    suratSebelumnya: false
  },
  112: {
    nomor: 112,
    nama: "الإخلاص",
    namaLatin: "Al-Ikhlas",
    jumlahAyat: 4,
    tempatTurun: "Mekah",
    arti: "Ikhlas",
    deskripsi: "Menerangkan pokok tauhid kemurnian esensi Allah...",
    audioFull: {
      "01": "https://equran.nos.wjv-1.neo.id/audio-full/Abdullah-Al-Juhany/112.mp3",
      "05": "https://equran.nos.wjv-1.neo.id/audio-full/Mishary-Rashid-Al-Afasy/112.mp3"
    },
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        teksLatin: "Qul huwallāhu aḥad(un).",
        teksIndonesia: "Katakanlah (Muhammad), \"Dialah Allah Yang Maha Esa.",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/112/112001.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/112/112001.mp3"
        }
      },
      {
        nomorAyat: 2,
        teksArab: "اللَّهُ الصَّمَدُ",
        teksLatin: "Allāhuṣ-ṣamad(u).",
        teksIndonesia: "Allah tempat meminta segala sesuatu.",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/112/112002.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/112/112002.mp3"
        }
      },
      {
        nomorAyat: 3,
        teksArab: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        teksLatin: "Lam yalid wa lam yūlad.",
        teksIndonesia: "(Allah) tidak beranak dan tidak pula diperanakkan,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/112/112003.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/112/112003.mp3"
        }
      },
      {
        nomorAyat: 4,
        teksArab: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        teksLatin: "Wa lam yakul lahū kufuwan aḥad(un).",
        teksIndonesia: "dan tidak ada sesuatu yang setara dengan Dia.\"",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/112/112004.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/112/112004.mp3"
        }
      }
    ],
    suratSelanjutnya: { nomor: 113, nama: "الفلق", namaLatin: "Al-Falaq", jumlahAyat: 5 },
    suratSebelumnya: { nomor: 111, nama: "المسد", namaLatin: "Al-Lahab", jumlahAyat: 5 }
  },
  113: {
    nomor: 113,
    nama: "الفلق",
    namaLatin: "Al-Falaq",
    jumlahAyat: 5,
    tempatTurun: "Mekah",
    arti: "Waktu Subuh",
    deskripsi: "Doa perlindungan diri kepada Penguasa fajar subuh...",
    audioFull: {
      "01": "https://equran.nos.wjv-1.neo.id/audio-full/Abdullah-Al-Juhany/113.mp3",
      "05": "https://equran.nos.wjv-1.neo.id/audio-full/Mishary-Rashid-Al-Afasy/113.mp3"
    },
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        teksLatin: "Qul a‘ūḏu birabbil-falaq(i).",
        teksIndonesia: "Katakanlah, \"Aku berlindung kepada Tuhan yang menguasai subuh (fajar),",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113001.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113001.mp3"
        }
      },
      {
        nomorAyat: 2,
        teksArab: "مِنْ شَرِّ مَا خَلَقَ",
        teksLatin: "Min syarri mā khalaq(a).",
        teksIndonesia: "dari kejahatan (makhluk yang) Dia ciptakan,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113002.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113002.mp3"
        }
      },
      {
        nomorAyat: 3,
        teksArab: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        teksLatin: "Wa min syarri gāsiqin iḏā waqab(a).",
        teksIndonesia: "dan dari kejahatan malam apabila telah gelap gulita,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113003.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113003.mp3"
        }
      },
      {
        nomorAyat: 4,
        teksArab: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        teksLatin: "Wa min syarrin-naffāṡāti fil-‘uqad(i).",
        teksIndonesia: "dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113004.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113004.mp3"
        }
      },
      {
        nomorAyat: 5,
        teksArab: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        teksLatin: "Wa min syarri ḥāsidin iḏā ḥasad(a).",
        teksIndonesia: "dan dari kejahatan orang yang dengki apabila dia dengki.\"",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113005.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/113/113005.mp3"
        }
      }
    ],
    suratSelanjutnya: { nomor: 114, nama: "الناس", namaLatin: "An-Nas", jumlahAyat: 6 },
    suratSebelumnya: { nomor: 112, nama: "الإخلاص", namaLatin: "Al-Ikhlas", jumlahAyat: 4 }
  },
  114: {
    nomor: 114,
    nama: "الناس",
    namaLatin: "An-Nas",
    jumlahAyat: 6,
    tempatTurun: "Mekah",
    arti: "Manusia",
    deskripsi: "Doa perlindungan agung kepada Raja Penguasa Pemelihara manusia...",
    audioFull: {
      "01": "https://equran.nos.wjv-1.neo.id/audio-full/Abdullah-Al-Juhany/114.mp3",
      "05": "https://equran.nos.wjv-1.neo.id/audio-full/Mishary-Rashid-Al-Afasy/114.mp3"
    },
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        teksLatin: "Qul a‘ūḏu birabbin-nās(i).",
        teksIndonesia: "Katakanlah, \"Aku berlindung kepada Tuhannya manusia,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114001.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114001.mp3"
        }
      },
      {
        nomorAyat: 2,
        teksArab: "مَلِكِ النَّاسِ",
        teksLatin: "Malikin-nās(i).",
        teksIndonesia: "Raja manusia,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114002.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114002.mp3"
        }
      },
      {
        nomorAyat: 3,
        teksArab: "إِلَٰهِ النَّاسِ",
        teksLatin: "Ilāhin-nās(i).",
        teksIndonesia: "Sembahan manusia,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114003.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114003.mp3"
        }
      },
      {
        nomorAyat: 4,
        teksArab: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        teksLatin: "Min syarril-waswāsil-khannās(i).",
        teksIndonesia: "dari kejahatan (bisikan) setan yang bersembunyi,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114004.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114004.mp3"
        }
      },
      {
        nomorAyat: 5,
        teksArab: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        teksLatin: "Al-laḏī yuwaswisu fī ṣudūrin-nās(i).",
        teksIndonesia: "yang membisikkan (kejahatan) ke dalam dada manusia,",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114005.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114005.mp3"
        }
      },
      {
        nomorAyat: 6,
        teksArab: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        teksLatin: "Minal-jinnati wan-nās(i).",
        teksIndonesia: "dari (golongan) jin dan manusia.\"",
        audio: {
          "01": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114006.mp3",
          "05": "https://equran.nos.wjv-1.neo.id/audio-ayat/114/114006.mp3"
        }
      }
    ],
    suratSelanjutnya: false,
    suratSebelumnya: { nomor: 113, nama: "الفلق", namaLatin: "Al-Falaq", jumlahAyat: 5 }
  }
};
