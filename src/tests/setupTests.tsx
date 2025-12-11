import '@testing-library/jest-dom';
import { vi } from 'vitest';

// --- GLOBAL MOCKS ---

// Mock local firebase instance
vi.mock('../firebase', () => ({
  db: {},
  auth: {},
  storage: {},
  analytics: {},
}));

// Mock Firebase SDKs
vi.mock('firebase/app', () => ({ initializeApp: vi.fn() }));
vi.mock('firebase/auth', () => ({ getAuth: vi.fn() }));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  Timestamp: {
    now: () => ({ seconds: 123, nanoseconds: 0, toDate: () => new Date() }),
    fromDate: (date: Date) => ({
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: 0,
      toDate: () => date,
    }),
  },
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));
vi.mock('firebase/storage', () => ({ getStorage: vi.fn() }));
vi.mock('firebase/analytics', () => ({ getAnalytics: vi.fn() }));

// Mock Swiper
vi.mock('swiper/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Swiper: ({ children }: any) => <div data-testid="swiper">{children}</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SwiperSlide: ({ children }: any) => <div data-testid="swiper-slide">{children}</div>,
}));

vi.mock('swiper/modules', () => ({ Navigation: {}, Pagination: {}, Autoplay: {} }));
vi.mock('swiper/css', () => ({}));
vi.mock('swiper/css/navigation', () => ({}));
vi.mock('swiper/css/pagination', () => ({}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock DataContext - Global default mock
// Tests can override this if needed using vi.mocked() or by mocking again locally
vi.mock('../contexts/DataContext', () => ({
  useData: () => ({
    countries: [
      {
        id: 'ca',
        name: { en: 'Canada' },
        code: 'CA',
        summary: { en: 'Desc' },
        content: { en: 'Full Content' },
        population: 100,
        gdp: 100,
        region: 'NA',
        imageUrl: 'url',
      },
      {
        id: 'ch',
        name: { en: 'Switzerland' },
        code: 'CH',
        summary: { en: 'Desc' },
        content: { en: 'Full Content' },
        population: 100,
        gdp: 100,
        region: 'EU',
        imageUrl: 'url',
      },
    ],
    teamMembers: [
      {
        id: '1',
        name: 'Dr. Jane Doe',
        role: { en: 'Researcher' },
        photoUrl: 'url',
        bio: { en: 'Bio' },
        email: 'jane@test.com',
      },
    ],
    publications: [
      {
        id: 'pub1',
        title: { en: 'Test Pub' },
        description: { en: 'Desc' },
        category: 'article',
        imageUrl: 'url',
        link: 'http://test.com',
        date: {
          seconds: 123,
          toDate: () => new Date('2024-01-01'),
        },
        pdfUrl: '',
        docUrl: '',
      },
    ],
    loading: false,
    loadingTeam: false,
    loadingCountries: false,
    loadingPublications: false,
    refreshTeam: vi.fn(),
    refreshPublications: vi.fn(),
    refreshCountries: vi.fn(),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataProvider: ({ children }: any) => <div>{children} </div>,
}));

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null, // Default logged out
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AuthProvider: ({ children }: any) => <div>{children} </div>,
}));

// Mock ScrollToTop
vi.mock('../components/atoms/ScrollToTop', () => ({
  default: () => null,
}));

vi.mock('../services/publicationService', () => ({
  publicationService: {
    getPublications: vi.fn(),
    getPublication: vi.fn().mockResolvedValue({
      id: 'pub1',
      title: { en: 'Test Pub' },
      description: { en: 'Desc' },
      category: 'article',
      imageUrl: 'url',
      date: { toDate: () => new Date() },
      link: 'http://test.com',
      documentUrl: 'doc.pdf',
    }),
    addPublication: vi.fn(),
    updatePublication: vi.fn(),
    deletePublication: vi.fn(),
  },
}));

vi.mock('../services/countryService', () => ({
  countryService: {
    getCountries: vi.fn(),
    getCountry: vi.fn().mockResolvedValue({
      id: 'ca',
      name: { en: 'Canada' },
      code: 'CA',
      summary: { en: 'Desc' },
      content: { en: 'Full Content' },
    }),
    addCountry: vi.fn(),
    updateCountry: vi.fn(),
    deleteCountry: vi.fn(),
  },
}));
