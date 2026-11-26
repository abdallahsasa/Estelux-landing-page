import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MessageCircle,
  Globe,
  Plane,
  Building2,
  CalendarCheck,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  LayoutDashboard,
  Lock,
  Search,
  Download,
  Trash2,
  Plus,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Inbox,
  Check,
  Edit3,
  LogOut,
  Users,
  Clock,
  CheckSquare,
  FileText,
  KeyRound,
  ShieldCheck,
  Award,
  Star,
  Stethoscope,
  HeartHandshake,
  BadgeCheck,
  Menu,
  Car,
  BedDouble,
  Languages,
  Quote
} from 'lucide-react';

/**
 * ESTELUX Istanbul — High-Converting Bilingual Dental Aesthetics & Medical Tourism Landing Page
 * + Live Bilingual Coordinator Dashboard (Consultation Leads Inbox & Media/Gallery Manager)
 */

type Language = 'en' | 'ar';
type ViewMode = 'landing' | 'login' | 'admin';
type AdminTab = 'leads' | 'media';
type LeadStatus = 'new' | 'contacted' | 'booked' | 'archived';
type SpecialtyCategory = 'dental' | 'hair' | 'plastic' | 'spine';

interface DentalCase {
  id: string;
  src: string;
  category: SpecialtyCategory;
  titleEn: string;
  titleAr: string;
  tagEn: string;
  tagAr: string;
  captionEn: string;
  captionAr: string;
  specsEn?: string;
  specsAr?: string;
  visible: boolean;
}

interface ConsultationLead {
  id: string;
  fullName: string;
  countryCode: string;
  phone: string;
  country: string;
  email: string;
  serviceValue: string;
  timeline?: string;
  arrivalDate?: string;
  message: string;
  status: LeadStatus;
  adminNotes: string;
  createdAt: string;
  langSubmitted: Language;
}

const WHATSAPP_DISPLAY = '+90 555 056 55 52';
const WHATSAPP_RAW = '905550565552';
const INSTAGRAM_URL = 'https://www.instagram.com/estelux_tr';
const FACEBOOK_URL = 'https://www.facebook.com/esteluxtr';
const ENV_ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN || '').trim();

const STORAGE_KEYS = {
  leads: 'estelux_consultation_leads_v1',
  cases: 'estelux_clinical_cases_v5',
  logo: 'estelux_brand_logo_v4',
  heroPhoto: 'estelux_hero_photo_v4',
  adminPin: 'estelux_admin_pin_v1',
  adminSession: 'estelux_admin_auth_session_v1',
};

const DEFAULT_ASSETS = {
  logo: '/estelux-logo.png',
  case1: '/case-dental-hollywood.webp',
  case2: '/case-dental-cosmetic-1.webp',
  case3: '/case-dental-cosmetic-2.webp',
  case4: '/case-hair-1.webp',
  case5: '/case-hair-2.webp',
  case6: '/case-hair-3.webp',
  case7: '/case-plastic-body.webp',
  case8: '/case-plastic-facelift.webp',
  case9: '/case-spine-scoliosis.webp',
  heroDental: '/client-logo.webp',
};

const CATEGORY_META: Record<SpecialtyCategory, { tagEn: string; tagAr: string }> = {
  dental: {
    tagEn: 'Dental Surgery & Cosmetic Dentistry',
    tagAr: 'جراحة الأسنان وتجميلها',
  },
  hair: {
    tagEn: 'Hair Transplantation',
    tagAr: 'زراعة الشعر',
  },
  plastic: {
    tagEn: 'Plastic & Aesthetic Surgery',
    tagAr: 'جراحات التجميل',
  },
  spine: {
    tagEn: 'Spine Surgery & Spinal Disorders Treatment',
    tagAr: 'جراحة العمود الفقري وعلاج أمراضه',
  },
};

const BROKEN_LEGACY_FILES = new Set([
  'Logo Colored.jpg',
  '/estelux-logo.svg',
  'photo_6028350293931659414_y.jpg',
  'photo_6028350293931659415_y.jpg',
  'photo_6028350293931659416_y.jpg',
  'photo_6028350293931659417_y.jpg',
]);

const INITIAL_CASES: DentalCase[] = [
  {
    id: 'case-dental-1',
    src: DEFAULT_ASSETS.case1,
    category: 'dental',
    titleEn: 'Hollywood Smile',
    titleAr: 'هوليوود سمايل',
    tagEn: CATEGORY_META.dental.tagEn,
    tagAr: CATEGORY_META.dental.tagAr,
    captionEn: 'Before and after photos: Hollywood Smile',
    captionAr: 'صور قبل وبعد: هوليوود سمايل',
    visible: true,
  },
  {
    id: 'case-dental-2',
    src: DEFAULT_ASSETS.case2,
    category: 'dental',
    titleEn: 'Cosmetic dentistry case 1',
    titleAr: 'الحالة الأولى لتجميل الأسنان',
    tagEn: CATEGORY_META.dental.tagEn,
    tagAr: CATEGORY_META.dental.tagAr,
    captionEn: 'Before and after photos: Cosmetic dentistry case 1',
    captionAr: 'صور قبل وبعد: الحالة الأولى لتجميل الأسنان',
    visible: true,
  },
  {
    id: 'case-dental-3',
    src: DEFAULT_ASSETS.case3,
    category: 'dental',
    titleEn: 'Cosmetic dentistry case 2',
    titleAr: 'الحالة الثانية لتجميل الأسنان',
    tagEn: CATEGORY_META.dental.tagEn,
    tagAr: CATEGORY_META.dental.tagAr,
    captionEn: 'Before and after photos: Cosmetic dentistry case 2',
    captionAr: 'صور قبل وبعد: الحالة الثانية لتجميل الأسنان',
    visible: true,
  },
  {
    id: 'case-hair-1',
    src: DEFAULT_ASSETS.case4,
    category: 'hair',
    titleEn: 'Hair transplant case 1',
    titleAr: 'الحالة الأولى لزراعة الشعر',
    tagEn: CATEGORY_META.hair.tagEn,
    tagAr: CATEGORY_META.hair.tagAr,
    captionEn: 'Before and after photos: Hair transplant case 1',
    captionAr: 'صور قبل وبعد: الحالة الأولى لزراعة الشعر',
    visible: true,
  },
  {
    id: 'case-hair-2',
    src: DEFAULT_ASSETS.case5,
    category: 'hair',
    titleEn: 'Hair transplant case 2',
    titleAr: 'الحالة الثانية لزراعة الشعر',
    tagEn: CATEGORY_META.hair.tagEn,
    tagAr: CATEGORY_META.hair.tagAr,
    captionEn: 'Before and after photos: Hair transplant case 2',
    captionAr: 'صور قبل وبعد: الحالة الثانية لزراعة الشعر',
    visible: true,
  },
  {
    id: 'case-hair-3',
    src: DEFAULT_ASSETS.case6,
    category: 'hair',
    titleEn: 'Hair transplant case 3',
    titleAr: 'الحالة الثالثة لزراعة الشعر',
    tagEn: CATEGORY_META.hair.tagEn,
    tagAr: CATEGORY_META.hair.tagAr,
    captionEn: 'Before and after photos: Hair transplant case 3',
    captionAr: 'صور قبل وبعد: الحالة الثالثة لزراعة الشعر',
    visible: true,
  },
  {
    id: 'case-plastic-1',
    src: DEFAULT_ASSETS.case7,
    category: 'plastic',
    titleEn: 'Tummy tuck and VASER liposuction',
    titleAr: 'شد البطن وشفط الدهون بالفيزر',
    tagEn: CATEGORY_META.plastic.tagEn,
    tagAr: CATEGORY_META.plastic.tagAr,
    captionEn: 'Before and after photos: Tummy tuck and VASER liposuction',
    captionAr: 'صور قبل وبعد: شد البطن وشفط الدهون بالفيزر',
    visible: true,
  },
  {
    id: 'case-plastic-2',
    src: DEFAULT_ASSETS.case8,
    category: 'plastic',
    titleEn: 'Facelift',
    titleAr: 'شد الوجه',
    tagEn: CATEGORY_META.plastic.tagEn,
    tagAr: CATEGORY_META.plastic.tagAr,
    captionEn: 'Before and after photos: Facelift',
    captionAr: 'صور قبل وبعد: شد الوجه',
    visible: true,
  },
  {
    id: 'case-spine-1',
    src: DEFAULT_ASSETS.case9,
    category: 'spine',
    titleEn: 'Scoliosis treatment',
    titleAr: 'علاج الجنف',
    tagEn: CATEGORY_META.spine.tagEn,
    tagAr: CATEGORY_META.spine.tagAr,
    captionEn: 'Before and after photos: Scoliosis treatment',
    captionAr: 'صور قبل وبعد: علاج الجنف',
    visible: true,
  },
];

const INITIAL_LEADS: ConsultationLead[] = [
  {
    id: 'lead-101',
    fullName: 'سارة المنصور / Sara Al-Mansoor',
    countryCode: '+966',
    phone: '551234890',
    country: 'Saudi Arabia',
    email: 'sara.m@example.com',
    serviceValue: 'dental',
    timeline: '1–3 months',
    message: 'أرغب في معرفة تكلفة هوليوود سمايل (20 سن) ومدة الإقامة المطلوبة في إسطنبول.',
    status: 'new',
    adminNotes: 'Prefer evening WhatsApp call after 6 PM Istanbul time.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    langSubmitted: 'ar',
  },
  {
    id: 'lead-102',
    fullName: 'Lukas Schneider',
    countryCode: '+49',
    phone: '1704481920',
    country: 'Germany',
    email: 'l.schneider@example.de',
    serviceValue: 'hair',
    timeline: 'ASAP',
    message: 'Interested in DHI / Sapphire FUE hair transplantation with VIP airport transfer.',
    status: 'contacted',
    adminNotes: 'Sent photo instructions & treatment itinerary via WhatsApp.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    langSubmitted: 'en',
  },
  {
    id: 'lead-103',
    fullName: "Aoife O'Connor",
    countryCode: '+353',
    phone: '879871122',
    country: 'Ireland',
    email: 'aoife.oconnor@example.ie',
    serviceValue: 'plastic',
    timeline: '1–3 months',
    message: 'Looking for consultation regarding rhinoplasty and hotel booking near the clinic.',
    status: 'booked',
    adminNotes: 'Confirmed Dublin–Istanbul flight on the 22nd — VIP Transfer arranged.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    langSubmitted: 'en',
  },
];

const COUNTRY_CODES = [
  { id: 'de', code: '+49', flag: '🇩🇪', label: 'Germany' },
  { id: 'ie', code: '+353', flag: '🇮🇪', label: 'Ireland' },
  { id: 'gb', code: '+44', flag: '🇬🇧', label: 'United Kingdom' },
  { id: 'sa', code: '+966', flag: '🇸🇦', label: 'Saudi Arabia' },
  { id: 'ae', code: '+971', flag: '🇦🇪', label: 'UAE' },
  { id: 'kw', code: '+965', flag: '🇰🇼', label: 'Kuwait' },
  { id: 'qa', code: '+974', flag: '🇶🇦', label: 'Qatar' },
  { id: 'tr', code: '+90', flag: '🇹🇷', label: 'Türkiye' },
  { id: 'at', code: '+43', flag: '🇦🇹', label: 'Austria' },
  { id: 'ch', code: '+41', flag: '🇨🇭', label: 'Switzerland' },
  { id: 'fr', code: '+33', flag: '🇫🇷', label: 'France' },
  { id: 'nl', code: '+31', flag: '🇳🇱', label: 'Netherlands' },
  { id: 'se', code: '+46', flag: '🇸🇪', label: 'Sweden' },
  { id: 'bh', code: '+973', flag: '🇧🇭', label: 'Bahrain' },
  { id: 'om', code: '+968', flag: '🇴🇲', label: 'Oman' },
  { id: 'jo', code: '+962', flag: '🇯🇴', label: 'Jordan' },
  { id: 'eg', code: '+20', flag: '🇪🇬', label: 'Egypt' },
  { id: 'iq', code: '+964', flag: '🇮🇶', label: 'Iraq' },
  { id: 'us', code: '+1', flag: '🇺🇸', label: 'USA / Canada' },
];

const TRANSLATIONS = {
  en: {
    pageTitle: 'Estelux | Premium Medical Treatments in Istanbul',
    brandSubtitle: 'Live Healthy · Look Beautiful',
    nav: {
      homeAria: 'Estelux',
      logoAlt: 'ESTELUX — Live Healthy · Look Beautiful',
      services: 'Our Services',
      support: 'Patient Support',
      reviews: 'Patient Reviews',
      freeQuote: 'Get Your Free Consultation',
      langSwitch: 'العربية',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      facebook: 'Facebook',
      whatsappAria: 'Contact Estelux on WhatsApp',
      dashboardBtn: 'Dashboard',
      backToSite: 'View Landing Page',
      returnToAdmin: 'Coordinator Mode Active — Return to Control Center',
    },
    hero: {
      eyebrow: 'ESTELUX · Istanbul',
      title: 'Premium Medical Treatments in Istanbul',
      sloganLeft: 'Live Healthy',
      sloganRight: 'Look Beautiful',
      lead: 'At Estelux, your health and satisfaction come first. Our experienced doctors listen to your goals, follow medical standards, and aim for natural-looking results that bring out the best in you.',
      primaryCta: 'Get Your Free Consultation',
      whatsappCta: 'WhatsApp',
      whatsappPrefill:
        'Hello Estelux, I would like to request a free consultation regarding medical treatments in Istanbul.',
      casePrefix: 'Case #',
      quickLinks: [
        { id: 'dental' as SpecialtyCategory, label: 'Dental Aesthetics' },
        { id: 'hair' as SpecialtyCategory, label: 'Hair Transplant' },
        { id: 'plastic' as SpecialtyCategory, label: 'Plastic Surgery' },
        { id: 'spine' as SpecialtyCategory, label: 'Spine Surgery' },
      ],
    },
    specialtiesSection: {
      heading: 'Our Medical Services',
      enlargePrefix: 'Enlarge',
      consultCta: 'Request a Free Consultation',
      dental: {
        id: 'dental' as SpecialtyCategory,
        title: 'Dental Surgery & Cosmetic Dentistry',
        desc: 'E-max veneers, zirconia crowns, dental implants, and full-mouth rehabilitation. Treatment planning considers facial harmony, bite alignment, and everyday function.',
      },
      hair: {
        id: 'hair' as SpecialtyCategory,
        title: 'Hair Transplantation',
        desc: 'Experienced physicians perform hair transplants using modern techniques such as DHI and Sapphire FUE. Hairline design, graft angles, and density follow your features and natural growth pattern.',
      },
      plastic: {
        id: 'plastic' as SpecialtyCategory,
        title: 'Plastic & Aesthetic Surgery',
        faceTitle: 'Face',
        faceDesc:
          'Facelifts, neck lifts, eyelid surgery, rhinoplasty, and more. Each procedure is planned with a fresher, more youthful appearance in mind, while preserving your natural features.',
        bodyTitle: 'Body',
        bodyDesc:
          'Body contouring and aesthetic surgery for women and men, including tummy tucks, VASER liposuction, gynecomastia surgery, breast augmentation, breast lifts, and more.',
      },
      spine: {
        id: 'spine' as SpecialtyCategory,
        title: 'Spine Surgery & Spinal Disorders Treatment',
        desc: 'Specialist assessment to identify the cause of symptoms and discuss treatment options based on your diagnosis.',
        experience: 'Over 30 years of experience in spine surgery',
        offerings: [
          'Disc herniation and neck or back pain',
          'Scoliosis and spinal deformities',
          'Kyphosis and spinal balance disorders',
          'Surgical and non-surgical treatments',
          'Advanced robotic spine surgery',
        ],
      },
    },
    support: {
      heading: 'Patient Support',
      items: [
        {
          title: 'VIP Private Transfers',
          desc: 'Door-to-door service between the airport, your hotel, and the clinic or hospital.',
        },
        {
          title: 'Accommodation Booking',
          desc: 'Hotel reservations arranged on request.',
        },
        {
          title: 'Language Assistance',
          desc: 'Communication support for international patients in languages such as English, Arabic, French, and Spanish.',
        },
        {
          title: 'Dedicated Patient Coordinator',
          desc: 'A dedicated coordinator supports you through diagnosis and treatment planning, your arrival in Istanbul, and your procedure. Follow-up continues after you return home.',
        },
      ],
    },
    social: {
      heading: 'Connect with Estelux',
      instagram: 'Instagram',
      facebook: 'Facebook',
      whatsapp: 'WhatsApp',
    },
    reviews: {
      heading: 'Patient Reviews',
      items: [
        {
          quote: '“The digital smile design looks completely natural.”',
          cite: 'Markus H. · Munich',
        },
        {
          quote: '“The coordination was flawless.”',
          cite: 'Ciara D. · Dublin',
        },
        {
          quote: '“The Arabic-speaking coordinator accompanied me at every step.”',
          cite: 'Faisal A. · Riyadh',
        },
      ],
    },
    form: {
      heading: 'Request a Free Consultation',
      intro:
        'Tell us what treatment you’re considering and when you’d like to travel. Our team will contact you on WhatsApp about your free consultation.',
      timelineLabel: 'When do you plan to come to Istanbul?',
      timelines: [
        { value: 'soon', label: 'ASAP' },
        { value: '1-3-months', label: '1–3 months' },
        { value: 'later', label: '3+ months' },
        { value: 'quote', label: 'Price check' },
      ],
      countryCodeAria: 'Country dialing code',
      fullName: 'Full name',
      fullNamePlaceholder: 'Full name',
      whatsapp: 'WhatsApp number (with country code)',
      whatsappPlaceholder: '555 000 0000',
      country: 'Country of residence',
      countryPlaceholder: 'Country of residence',
      serviceLabel: 'Treatment of interest',
      servicePlaceholder: 'Select a service',
      services: [
        { value: 'dental', label: 'Dental Surgery & Cosmetic Dentistry' },
        { value: 'hair', label: 'Hair Transplantation' },
        { value: 'plastic', label: 'Plastic & Aesthetic Surgery' },
        { value: 'spine', label: 'Spine Surgery & Spinal Disorders Treatment' },
        { value: 'unsure', label: 'I’m not sure yet' },
      ],
      arrivalDate: 'Expected arrival date (optional)',
      email: 'Email address (optional)',
      emailPlaceholder: 'you@example.com',
      message: 'Treatment goals or questions (optional)',
      messagePlaceholder: 'Share your goals, questions, or any details you’d like our doctors to know...',
      consent: 'I agree to be contacted by Estelux about my request.',
      submit: 'Send Consultation Request',
      submitting: 'Sending your request...',
      errors: {
        name: 'Please enter your full name.',
        phone: 'Please enter a valid WhatsApp phone number.',
        country: 'Please enter your country of residence.',
        service: 'Please select a treatment of interest.',
        email: 'Please enter a valid email address.',
        consent: 'Please agree to be contacted to continue.',
      },
      confirmTitle: 'Consultation Request Received!',
      confirmBody:
        'Thank you. Our team will contact you on WhatsApp about your free consultation. You can also send your request directly on WhatsApp below.',
      confirmWaBtn: 'Continue on WhatsApp',
      resetBtn: 'Submit another request',
      waSummaryIntro: 'Hello Estelux, I would like to request a free consultation.',
      waFieldName: 'Name',
      waFieldPhone: 'WhatsApp',
      waFieldCountry: 'Country',
      waFieldEmail: 'Email',
      waFieldService: 'Treatment of interest',
      waFieldTimeline: 'Travel window',
      waFieldArrival: 'Expected arrival date',
      waFieldNotes: 'Treatment goals / questions',
    },
    lightbox: {
      close: 'Close',
      prev: 'Previous case',
      next: 'Next case',
      cta: 'Request a Free Consultation',
    },
    footer: {
      location: 'Istanbul, Türkiye',
      whatsappLabel: 'WhatsApp',
      privacy: 'Privacy Policy',
      rights: `© ${new Date().getFullYear()} ESTELUX. All rights reserved.`,
      privacyTitle: 'Privacy & Medical Confidentiality Policy',
      privacyText:
        'Estelux strictly protects your personal and medical inquiry information in accordance with international health data protection standards. Details submitted are reviewed exclusively by our medical coordination team and doctors to prepare your consultation and are never shared with third parties.',
      close: 'Close',
    },
    admin: {
      loginTitle: 'ESTELUX Coordinator Portal',
      loginSub: 'Enter your security PIN to manage consultation requests and clinical gallery photos.',
      pinPlaceholder: 'Enter Security PIN',
      pinError: 'Incorrect PIN. Please try again.',
      loginBtn: 'Unlock Dashboard',
      cancelBtn: 'Return to Landing Page',
      portalTitle: 'ESTELUX Control Center',
      portalSub: 'Live Synchronization with Public Landing Page',
      logout: 'Lock & Exit',
      changePinBtn: 'Change PIN',
      pinModal: {
        title: 'Change Dashboard PIN',
        sub: 'Update the security PIN required to access the ESTELUX coordinator dashboard.',
        currentLabel: 'Current PIN',
        newLabel: 'New PIN (min. 4 characters)',
        confirmLabel: 'Confirm New PIN',
        saveBtn: 'Update PIN',
        errCurrent: 'Current PIN is incorrect.',
        errLength: 'New PIN must be at least 4 characters.',
        errMismatch: 'New PIN and confirmation do not match.',
        successToast: 'Dashboard PIN updated successfully!',
      },
      tabLeads: 'Consultation Messages',
      tabMedia: 'Gallery & Photos Manager',
      stats: {
        total: 'Total Requests',
        new: 'New Inquiries',
        booked: 'Confirmed Bookings',
        activePhotos: 'Active Gallery Cases',
      },
      leads: {
        searchPlaceholder: 'Search by patient name, phone, country, or note...',
        filterAll: 'All',
        statusNew: 'New',
        statusContacted: 'Contacted',
        statusBooked: 'Booked',
        statusArchived: 'Archived',
        exportCsv: 'Export CSV',
        empty: 'No consultation messages match your filter.',
        patient: 'Patient',
        service: 'Requested Service',
        message: 'Patient Message',
        noMessage: 'No additional notes provided.',
        notesLabel: 'Coordinator Internal Notes',
        notesPlaceholder: 'Add flight details, X-ray status, or follow-up notes...',
        whatsappReply: 'Reply on WhatsApp',
        deleteConfirm: 'Click again to confirm delete',
        deleteBtn: 'Delete',
        waReplyGreeting: (name: string, service: string) =>
          `Hello ${name}, thank you for contacting Estelux regarding ${service}. Our medical coordinator is ready to assist you with your free consultation.`,
      },
      media: {
        brandSectionTitle: 'Brand Logo & Hero Image',
        brandSectionSub: 'Upload from your device (auto-optimized) or paste an image URL. Updates appear immediately on the landing page.',
        logoLabel: 'ESTELUX Brand Logo',
        heroPhotoLabel: 'Hero Brand Artwork',
        uploadBtn: 'Upload File',
        urlPlaceholder: 'Or paste image URL (https://...)',
        applyUrl: 'Apply',
        resetDefaults: 'Reset All Media to Original',
        addCaseTitle: 'Add New Before & After Clinical Case',
        addCaseSub: 'Upload a clinical transformation photo and provide English & Arabic titles.',
        caseTitleEn: 'Title (English)',
        caseTitleEnPh: 'e.g., Hollywood Smile',
        caseTitleAr: 'Title (Arabic)',
        caseTitleArPh: 'مثال: هوليوود سمايل',
        caseCategory: 'Medical Specialty',
        catDental: 'Dental Surgery & Cosmetic Dentistry',
        catHair: 'Hair Transplantation',
        catPlastic: 'Plastic & Aesthetic Surgery',
        catSpine: 'Spine Surgery & Spinal Disorders Treatment',
        caseCaptionEn: 'Short Description (English)',
        caseCaptionAr: 'Short Description (Arabic)',
        choosePhoto: 'Choose Photo from Device',
        orImageUrl: 'Or paste Image URL',
        addCaseBtn: 'Publish to Gallery',
        manageCasesTitle: 'Manage Clinical Gallery Cases',
        manageCasesSub: 'Edit titles & descriptions, toggle visibility on the landing page, reorder, or delete cases.',
        visibleBadge: 'Visible on Site',
        hiddenBadge: 'Hidden',
        editBtn: 'Edit Details',
        saveBtn: 'Save Changes',
        cancelEdit: 'Cancel',
        moveUp: 'Move Up',
        moveDown: 'Move Down',
        toggleVisibility: 'Toggle Visibility',
        savedToast: 'Changes saved & synced live!',
      },
    },
  },
  ar: {
    pageTitle: 'إيستالوكس | رعاية طبية متميّزة في إسطنبول',
    brandSubtitle: 'عِش بصحّة · تألّق بجمالك',
    nav: {
      homeAria: 'إيستالوكس',
      logoAlt: 'إيستالوكس — عِش بصحّة · تألّق بجمالك',
      services: 'خدماتنا',
      support: 'خدمات دعم المرضى',
      reviews: 'آراء المرضى',
      freeQuote: 'احصل على استشارتك المجانية',
      langSwitch: 'English',
      whatsapp: 'واتساب',
      instagram: 'إنستغرام',
      facebook: 'فيسبوك',
      whatsappAria: 'تواصل مع إيستالوكس عبر واتساب',
      dashboardBtn: 'لوحة التحكم',
      backToSite: 'عرض صفحة الهبوط',
      returnToAdmin: 'وضع الإدارة نشط — العودة إلى لوحة التحكم',
    },
    hero: {
      eyebrow: 'إيستالوكس · إسطنبول',
      title: 'رعاية طبية متميّزة في إسطنبول',
      sloganLeft: 'عِش بصحّة',
      sloganRight: 'تألّق بجمالك',
      lead: 'في إيستالوكس، صحتك ورضاك أولويتنا. يستمع أطباؤنا ذوو الخبرة إلى أهدافك، ويلتزمون بالمعايير الطبية، ويسعون إلى نتائج طبيعية تبرز أجمل ما فيك.',
      primaryCta: 'احصل على استشارتك المجانية',
      whatsappCta: 'واتساب',
      whatsappPrefill:
        'مرحباً إيستالوكس، أرغب في طلب استشارة مجانية بخصوص العلاجات الطبية في إسطنبول.',
      casePrefix: 'حالة رقم ',
      quickLinks: [
        { id: 'dental' as SpecialtyCategory, label: 'تجميل الأسنان' },
        { id: 'hair' as SpecialtyCategory, label: 'زراعة الشعر' },
        { id: 'plastic' as SpecialtyCategory, label: 'جراحات التجميل' },
        { id: 'spine' as SpecialtyCategory, label: 'جراحة العمود الفقري' },
      ],
    },
    specialtiesSection: {
      heading: 'خدماتنا الطبية',
      enlargePrefix: 'تكبير الصورة:',
      consultCta: 'اطلب استشارة مجانية',
      dental: {
        id: 'dental' as SpecialtyCategory,
        title: 'جراحة الأسنان وتجميلها',
        desc: 'قشور إيماكس، وتلبيسات الزيركون، وزراعة الأسنان، وإعادة تأهيل الفم بالكامل. تراعي الخطة العلاجية تناسق الابتسامة مع ملامح الوجه، والإطباق، وكفاءة المضغ.',
      },
      hair: {
        id: 'hair' as SpecialtyCategory,
        title: 'زراعة الشعر',
        desc: 'يجري أطباء ذوو خبرة زراعة الشعر بتقنيات حديثة مثل DHI وSapphire FUE. ويُصمَّم خطّ الشعر وتُحدَّد زوايا الغرس وتوزيع الكثافة بما ينسجم مع ملامح الوجه ونمط نمو الشعر الطبيعي.',
      },
      plastic: {
        id: 'plastic' as SpecialtyCategory,
        title: 'جراحات التجميل',
        faceTitle: 'عمليات الوجه',
        faceDesc:
          'تشمل خيارات تجميل الوجه شدّ الوجه والرقبة، وجراحة الجفون، وتجميل الأنف، وغيرها من الإجراءات. ويهدف جرّاحونا إلى إبراز مظهر أكثر نضارة وشباباً مع الحفاظ على ملامحك الطبيعية.',
        bodyTitle: 'عمليات الجسم',
        bodyDesc:
          'نحت القوام وجراحات تجميل الجسم للنساء والرجال، بما يشمل شدّ البطن وشفط الدهون بالفيزر وتصحيح التثدّي وتكبير الثدي ورفعه، وغيرها من الإجراءات.',
      },
      spine: {
        id: 'spine' as SpecialtyCategory,
        title: 'جراحة العمود الفقري وعلاج أمراضه',
        desc: 'تقييم متخصص لتحديد أسباب الأعراض ومناقشة خيارات العلاج المناسبة للتشخيص.',
        experience: 'أكثر من ٣٠ عاماً من الخبرة في جراحة العمود الفقري',
        offerings: [
          'الانزلاق الغضروفي (الديسك) وآلام الرقبة والظهر',
          'الجنف وتشوّهات العمود الفقري',
          'الحداب واضطرابات توازن العمود الفقري',
          'العلاجات الجراحية وغير الجراحية',
          'الجراحة الروبوتية المتقدمة للعمود الفقري',
        ],
      },
    },
    support: {
      heading: 'خدمات دعم المرضى',
      items: [
        {
          title: 'تنقّلات خاصة VIP',
          desc: 'خدمة تنقّل من الباب إلى الباب بين المطار والفندق والعيادة أو المستشفى.',
        },
        {
          title: 'حجز الإقامة',
          desc: 'خدمة حجز الفنادق متاحة عند الطلب.',
        },
        {
          title: 'المساعدة اللغوية',
          desc: 'دعم لغوي للمرضى الدوليين بلغات مثل الإنجليزية والعربية والفرنسية والإسبانية.',
        },
        {
          title: 'منسّق شخصي للمريض',
          desc: 'يرافقك منسّق شخصي خلال التشخيص ووضع الخطة العلاجية، وعند وصولك إلى إسطنبول وإجراء العلاج. وتستمر المتابعة بعد عودتك إلى بلدك.',
        },
      ],
    },
    social: {
      heading: 'تواصل مع إيستالوكس',
      instagram: 'إنستغرام',
      facebook: 'فيسبوك',
      whatsapp: 'واتساب',
    },
    reviews: {
      heading: 'آراء المرضى',
      items: [
        {
          quote: '«تصميم الابتسامة الرقمي يبدو طبيعياً تماماً.»',
          cite: 'ماركوس هـ. · ميونخ',
        },
        {
          quote: '«كان التنسيق ممتازاً.»',
          cite: 'كيارا د. · دبلن',
        },
        {
          quote: '«رافقني المنسّق الناطق بالعربية في كل خطوة.»',
          cite: 'فيصل أ. · الرياض',
        },
      ],
    },
    form: {
      heading: 'اطلب استشارة مجانية',
      intro:
        'أخبرنا بالعلاج الذي تفكّر فيه والموعد المتوقع للسفر. سيتواصل معك فريقنا عبر واتساب بشأن استشارتك المجانية.',
      timelineLabel: 'متى تخطّط للقدوم إلى إسطنبول؟',
      timelines: [
        { value: 'soon', label: 'بأقرب وقت' },
        { value: '1-3-months', label: '١–٣ أشهر' },
        { value: 'later', label: 'أكثر من ٣ أشهر' },
        { value: 'quote', label: 'استفسار عن السعر' },
      ],
      countryCodeAria: 'رمز الدولة الدولي',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'الاسم الكامل',
      whatsapp: 'رقم واتساب مع رمز الدولة',
      whatsappPlaceholder: '555 000 0000',
      country: 'بلد الإقامة',
      countryPlaceholder: 'بلد الإقامة',
      serviceLabel: 'العلاج الذي يهمّك',
      servicePlaceholder: 'اختَر خدمة',
      services: [
        { value: 'dental', label: 'جراحة الأسنان وتجميلها' },
        { value: 'hair', label: 'زراعة الشعر' },
        { value: 'plastic', label: 'جراحات التجميل' },
        { value: 'spine', label: 'جراحة العمود الفقري وعلاج أمراضه' },
        { value: 'unsure', label: 'لم أحدّد بعد' },
      ],
      arrivalDate: 'تاريخ الوصول المتوقع (اختياري)',
      email: 'البريد الإلكتروني (اختياري)',
      emailPlaceholder: 'you@example.com',
      message: 'أهداف العلاج أو أسئلتك (اختياري)',
      messagePlaceholder: 'شاركنا أهدافك العلاجية أو أي أسئلة تودّ طرحها على أطبائنا...',
      consent: 'أوافق على تواصل إيستالوكس معي بخصوص طلبي.',
      submit: 'أرسل طلب الاستشارة',
      submitting: 'جاري إرسال طلبك...',
      errors: {
        name: 'يرجى إدخال الاسم الكامل.',
        phone: 'يرجى إدخال رقم واتساب صحيح.',
        country: 'يرجى إدخال بلد الإقامة.',
        service: 'يرجى اختيار العلاج الذي يهمّك.',
        email: 'يرجى إدخال بريد إلكتروني صحيح.',
        consent: 'يرجى الموافقة للمتابعة.',
      },
      confirmTitle: 'تم استلام طلب الاستشارة بنجاح!',
      confirmBody:
        'شكراً لك. سيتواصل معك فريقنا عبر واتساب بشأن استشارتك المجانية. يمكنك أيضاً إرسال ملخص طلبك مباشرة عبر واتساب أدناه.',
      confirmWaBtn: 'المتابعة عبر واتساب',
      resetBtn: 'إرسال طلب استشارة آخر',
      waSummaryIntro: 'مرحباً إيستالوكس، أرغب في طلب استشارة مجانية.',
      waFieldName: 'الاسم الكامل',
      waFieldPhone: 'رقم واتساب',
      waFieldCountry: 'بلد الإقامة',
      waFieldEmail: 'البريد الإلكتروني',
      waFieldService: 'العلاج الذي يهمّك',
      waFieldTimeline: 'موعد السفر المتوقع',
      waFieldArrival: 'تاريخ الوصول المتوقع',
      waFieldNotes: 'أهداف العلاج أو الأسئلة',
    },
    lightbox: {
      close: 'إغلاق',
      prev: 'الحالة السابقة',
      next: 'الحالة التالية',
      cta: 'اطلب استشارة مجانية',
    },
    footer: {
      location: 'إسطنبول، تركيا',
      whatsappLabel: 'واتساب',
      privacy: 'سياسة الخصوصية',
      rights: `© ${new Date().getFullYear()} إيستالوكس. جميع الحقوق محفوظة.`,
      privacyTitle: 'سياسة الخصوصية والسرية الطبية',
      privacyText:
        'تحترم إيستالوكس خصوصيتك وتحافظ على سرية بياناتك الطبية والشخصية وفق أعلى المعايير الدولية. تُستخدم المعلومات المقدمة حصرياً من قبل فريق التنسيق الطبي والأطباء لإعداد استشارتك ولا يتم مشاركتها مع أي أطراف خارجية.',
      close: 'إغلاق',
    },
    admin: {
      loginTitle: 'بوابة إدارة ESTELUX',
      loginSub: 'أدخل رمز الدخول للتحكم في طلبات الاستشارة الواردة وتعديل صور المعرض والشعار.',
      pinPlaceholder: 'أدخل رمز الدخول',
      pinError: 'رمز الدخول غير صحيح. يرجى المحاولة مرة أخرى.',
      loginBtn: 'فتح لوحة التحكم',
      cancelBtn: 'العودة إلى صفحة الهبوط',
      portalTitle: 'لوحة تحكم ESTELUX',
      portalSub: 'مزامنة فورية ومباشرة مع صفحة الهبوط',
      logout: 'قفل والخروج',
      changePinBtn: 'تغيير رمز الدخول',
      pinModal: {
        title: 'تغيير رمز دخول لوحة التحكم',
        sub: 'قم بتحديث رمز الأمان المطلوب للدخول إلى لوحة تنسيق ESTELUX.',
        currentLabel: 'رمز الدخول الحالي',
        newLabel: 'رمز الدخول الجديد (4 خانات على الأقل)',
        confirmLabel: 'تأكيد رمز الدخول الجديد',
        saveBtn: 'حفظ الرمز الجديد',
        errCurrent: 'رمز الدخول الحالي غير صحيح.',
        errLength: 'يجب أن يتكون الرمز الجديد من 4 خانات على الأقل.',
        errMismatch: 'رمز الدخول الجديد وتأكيده غير متطابقين.',
        successToast: 'تم تحديث رمز دخول لوحة التحكم بنجاح!',
      },
      tabLeads: 'رسائل وطلبات الاستشارة',
      tabMedia: 'إدارة وتعديل الصور',
      stats: {
        total: 'إجمالي الطلبات',
        new: 'طلبات جديدة',
        booked: 'مواعيد مؤكدة',
        activePhotos: 'صور المعرض النشطة',
      },
      leads: {
        searchPlaceholder: 'ابحث بالاسم، رقم الهاتف، البلد، أو الملاحظات...',
        filterAll: 'الكل',
        statusNew: 'جديد',
        statusContacted: 'تم التواصل',
        statusBooked: 'تم الحجز',
        statusArchived: 'مؤرشف',
        exportCsv: 'تصدير Excel / CSV',
        empty: 'لا توجد رسائل تطابق خيارات البحث الحالية.',
        patient: 'المراجع',
        service: 'الخدمة المطلوبة',
        message: 'رسالة المراجع',
        noMessage: 'لم يترك المراجع رسالة إضافية.',
        notesLabel: 'ملاحظات فريق التنسيق (داخلية)',
        notesPlaceholder: 'أضف تفاصيل الرحلة، صور الأشعة، أو موعد المتابعة...',
        whatsappReply: 'رد عبر واتساب',
        deleteConfirm: 'اضغط مرة أخرى لتأكيد الحذف',
        deleteBtn: 'حذف',
        waReplyGreeting: (name: string, service: string) =>
          `مرحباً ${name}، شكراً لتواصلك مع إيستالوكس بخصوص خدمة (${service}). فريق التنسيق الطبي جاهز لمساعدتك في استشارتك المجانية.`,
      },
      media: {
        brandSectionTitle: 'تعديل شعار العلامة التجارية وصورة الواجهة الرئيسية',
        brandSectionSub: 'ارفع صورة من جهازك (يتم ضغطها تلقائياً) أو الصق رابط صورة مباشر. تظهر التعديلات فوراً في صفحة الهبوط.',
        logoLabel: 'شعار ESTELUX الرسمي',
        heroPhotoLabel: 'صورة الواجهة الرئيسية',
        uploadBtn: 'رفع صورة من الجهاز',
        urlPlaceholder: 'أو الصق رابط الصورة (https://...)',
        applyUrl: 'تطبيق',
        resetDefaults: 'استعادة جميع الصور الافتراضية',
        addCaseTitle: 'إضافة حالة قبل وبعد جديدة إلى المعرض',
        addCaseSub: 'ارفع صورة الحالة وأدخل العنوان والوصف باللغتين العربية والإنجليزية.',
        caseTitleEn: 'العنوان (بالإنجليزية)',
        caseTitleEnPh: 'مثال: Hollywood Smile',
        caseTitleAr: 'العنوان (بالعربية)',
        caseTitleArPh: 'مثال: هوليوود سمايل',
        caseCategory: 'التخصص الطبي',
        catDental: 'جراحة الأسنان وتجميلها',
        catHair: 'زراعة الشعر',
        catPlastic: 'جراحات التجميل',
        catSpine: 'جراحة العمود الفقري وعلاج أمراضه',
        caseCaptionEn: 'وصف مختصر (بالإنجليزية)',
        caseCaptionAr: 'وصف مختصر (بالعربية)',
        choosePhoto: 'اختر صورة من جهازك',
        orImageUrl: 'أو الصق رابط الصورة',
        addCaseBtn: 'نشر الصورة في المعرض',
        manageCasesTitle: 'التحكم في صور الحالات السريرية الحالية',
        manageCasesSub: 'تعديل العناوين والوصف، إظهار أو إخفاء الصورة في الصفحة، تغيير الترتيب، أو الحذف.',
        visibleBadge: 'ظاهرة في الموقع',
        hiddenBadge: 'مخفية',
        editBtn: 'تعديل البيانات',
        saveBtn: 'حفظ التعديلات',
        cancelEdit: 'إلغاء',
        moveUp: 'تحريك للأعلى',
        moveDown: 'تحريك للأسفل',
        toggleVisibility: 'إظهار / إخفاء',
        savedToast: 'تم حفظ التعديلات ومزامنتها فوراً!',
      },
    },
  },
};

const toArabicDigits = (num: number | string) =>
  String(num).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

const SpecialtyIcon = ({
  category,
  className = 'w-6 h-6',
}: {
  category: SpecialtyCategory;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {category === 'dental' && (
      <path d="M12 4c-2-1-3-2-5-1C2 4 3 10 5 13c1 2 1 8 4 8 2 0 1-7 3-7s1 7 3 7c3 0 3-6 4-8 2-3 3-9-2-10-2-.4-3 .5-5 1Z" />
    )}
    {category === 'hair' && <path d="M3 20h18M7 17c0-6 2-10 7-14M12 17c0-4 2-8 6-10M17 17c0-2 1-4 3-5" />}
    {category === 'plastic' && (
      <path d="M12 3c-5 0-8 3-8 8v2c0 4 4 8 8 8s8-4 8-8v-2c0-5-3-8-8-8Zm-4 9h.01m8 0h.01M10 16c1.3 1 2.7 1 4 0" />
    )}
    {category === 'spine' && (
      <>
        <path d="M12 2v3m0 14v3M10 7H8m6 0h2m-6 5H7m7 0h3m-7 5H8m6 0h2" />
        <rect x="10" y="5" width="4" height="4" rx="1" />
        <rect x="10" y="10" width="4" height="4" rx="1" />
        <rect x="10" y="15" width="4" height="4" rx="1" />
      </>
    )}
  </svg>
);

const SUPPORT_ICONS = [Car, BedDouble, Languages, HeartHandshake];

export function App() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    return new URLSearchParams(window.location.search).get('lang') === 'ar' ? 'ar' : 'en';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSecretAdminUrl = () => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return hash === '#admin' || hash.startsWith('#admin/') || params.get('admin') === '1';
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.adminSession) === '1';
    } catch {
      return false;
    }
  });

  const [view, setView] = useState<ViewMode>(() => {
    if (!isSecretAdminUrl()) return 'landing';
    try {
      return sessionStorage.getItem(STORAGE_KEYS.adminSession) === '1' ? 'admin' : 'login';
    } catch {
      return 'login';
    }
  });

  const [adminTab, setAdminTab] = useState<AdminTab>('leads');
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.adminPin) || ENV_ADMIN_PIN;
    } catch {
      return ENV_ADMIN_PIN;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Change PIN Modal State
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [currentPinField, setCurrentPinField] = useState('');
  const [newPinField, setNewPinField] = useState('');
  const [confirmPinField, setConfirmPinField] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');

  // Persistent Leads, Gallery Cases, Brand Logo & Hero Photo State
  const [leads, setLeads] = useState<ConsultationLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.leads);
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [dentalCases, setDentalCases] = useState<DentalCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.cases);
      if (!saved) return INITIAL_CASES;
      const parsed: DentalCase[] = JSON.parse(saved);
      // Sanitize any legacy broken file paths
      return parsed.map((c, idx) =>
        BROKEN_LEGACY_FILES.has(c.src)
          ? { ...c, src: INITIAL_CASES[idx % INITIAL_CASES.length].src }
          : c
      );
    } catch {
      return INITIAL_CASES;
    }
  });

  const [brandLogo, setBrandLogo] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.logo);
      if (!saved || BROKEN_LEGACY_FILES.has(saved)) return DEFAULT_ASSETS.logo;
      return saved;
    } catch {
      return DEFAULT_ASSETS.logo;
    }
  });

  const [heroPhoto, setHeroPhoto] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.heroPhoto) || DEFAULT_ASSETS.heroDental;
    } catch {
      return DEFAULT_ASSETS.heroDental;
    }
  });

  // Public Landing Page UI State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Consultation Form State
  const [selectedServiceValue, setSelectedServiceValue] = useState<string>('');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('soon');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+90');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState<ConsultationLead | null>(null);
  const fullNameInputRef = useRef<HTMLInputElement | null>(null);

  // Admin Dashboard Controls State
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | LeadStatus>('all');
  const [confirmDeleteLeadId, setConfirmDeleteLeadId] = useState<string | null>(null);

  // Media Manager State
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [heroUrlInput, setHeroUrlInput] = useState('');
  const [newCaseSrc, setNewCaseSrc] = useState('');
  const [newCaseTitleEn, setNewCaseTitleEn] = useState('');
  const [newCaseTitleAr, setNewCaseTitleAr] = useState('');
  const [newCaseCategory, setNewCaseCategory] = useState<SpecialtyCategory>('dental');
  const [newCaseCaptionEn, setNewCaseCaptionEn] = useState('');
  const [newCaseCaptionAr, setNewCaseCaptionAr] = useState('');
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DentalCase | null>(null);
  const newCaseFileRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(leads));
    } catch {
      // Ignore storage quota errors
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cases, JSON.stringify(dentalCases));
    } catch {
      // Ignore storage quota errors
    }
  }, [dentalCases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.logo, brandLogo);
    } catch {
      // Ignore storage quota errors
    }
  }, [brandLogo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.heroPhoto, heroPhoto);
    } catch {
      // Ignore storage quota errors
    }
  }, [heroPhoto]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.adminPin, adminPin);
    } catch {
      // Ignore storage quota errors
    }
  }, [adminPin]);

  const isRTL = lang === 'ar';
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.title = t.pageTitle;
  }, [lang, isRTL, t.pageTitle]);

  // Sync secret admin route on hashchange / popstate
  useEffect(() => {
    const syncRoute = () => {
      if (isSecretAdminUrl()) {
        setView(isAuthenticated ? 'admin' : 'login');
      } else {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, [isAuthenticated]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const hasModal = lightboxIndex !== null || privacyOpen || pinModalOpen;
    document.body.style.overflow = hasModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, privacyOpen, pinModalOpen]);

  const exitToLandingPage = () => {
    if (typeof window !== 'undefined') {
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    }
    setView('landing');
  };

  const openAdminPortal = () => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#admin');
    }
    setView(isAuthenticated ? 'admin' : 'login');
  };

  // Visible cases for public landing page
  const visibleCases = dentalCases.filter((c) => c.visible);
  const filteredCases = visibleCases;

  const defaultWaUrl = `https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(
    t.hero.whatsappPrefill
  )}`;

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  // Global keyboard shortcuts for modals & lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        if (privacyOpen) setPrivacyOpen(false);
        if (pinModalOpen) setPinModalOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
        return;
      }
      if (lightboxIndex === null || filteredCases.length === 0) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : isRTL
              ? (prev - 1 + filteredCases.length) % filteredCases.length
              : (prev + 1) % filteredCases.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : isRTL
              ? (prev + 1) % filteredCases.length
              : (prev - 1 + filteredCases.length) % filteredCases.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, privacyOpen, pinModalOpen, mobileMenuOpen, filteredCases.length, isRTL]);

  const handleSelectServiceAndScroll = (serviceValue: string) => {
    setSelectedServiceValue(serviceValue);
    setSubmitted(false);
    setMobileMenuOpen(false);
    const el = document.getElementById('consultation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        fullNameInputRef.current?.focus({ preventScroll: true });
      }, 500);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.name = t.form.errors.name;
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 6 || digits.length > 15) nextErrors.phone = t.form.errors.phone;
    if (!country.trim()) nextErrors.country = t.form.errors.country;
    if (!selectedServiceValue) nextErrors.service = t.form.errors.service;
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = t.form.errors.email;
    }
    if (!consent) nextErrors.consent = t.form.errors.consent;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const newLead: ConsultationLead = {
      id: `lead-${Date.now()}`,
      fullName: fullName.trim(),
      countryCode,
      phone: phone.trim(),
      country: country.trim(),
      email: email.trim(),
      serviceValue: selectedServiceValue,
      timeline: selectedTimeline,
      arrivalDate: arrivalDate.trim() || undefined,
      message: message.trim(),
      status: 'new',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      langSubmitted: lang,
    };

    setTimeout(() => {
      setLeads((prev) => [newLead, ...prev]);
      setLastSubmittedLead(newLead);
      setSubmitting(false);
      setSubmitted(true);
      setFullName('');
      setPhone('');
      setCountry('');
      setArrivalDate('');
      setEmail('');
      setMessage('');
    }, 380);
  };

  const buildWhatsAppLinkFromLead = (lead: ConsultationLead) => {
    const serviceLabel =
      t.form.services.find((s) => s.value === lead.serviceValue)?.label ||
      t.form.services[0].label;
    const timelineLabel =
      t.form.timelines.find((tl) => tl.value === lead.timeline)?.label || lead.timeline;

    const summary = [
      t.form.waSummaryIntro,
      `${t.form.waFieldName}: ${lead.fullName}`,
      `${t.form.waFieldPhone}: ${lead.countryCode} ${lead.phone}`,
      `${t.form.waFieldCountry}: ${lead.country}`,
      lead.email ? `${t.form.waFieldEmail}: ${lead.email}` : null,
      `${t.form.waFieldService}: ${serviceLabel}`,
      timelineLabel ? `${t.form.waFieldTimeline}: ${timelineLabel}` : null,
      lead.arrivalDate ? `${t.form.waFieldArrival}: ${lead.arrivalDate}` : null,
      lead.message ? `${t.form.waFieldNotes}: ${lead.message}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(summary)}`;
  };

  const formatCaseLabel = (index: number) =>
    isRTL ? `${t.hero.casePrefix}${toArabicDigits(index + 1)}` : `${t.hero.casePrefix}${index + 1}`;

  const getServiceLabel = (serviceValue: string) =>
    t.form.services.find((s) => s.value === serviceValue)?.label || serviceValue;

  // Client-side image compression + reader so uploaded photos fit comfortably in localStorage
  const handleImageFileUpload = (
    file: File | undefined,
    callback: (dataUrl: string) => void,
    preserveTransparency = false
  ) => {
    if (!file) return;
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') callback(reader.result);
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          callback(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const mime = preserveTransparency ? 'image/png' : 'image/jpeg';
        const compressed = canvas.toDataURL(mime, 0.82);
        callback(compressed);
      };
      img.onerror = () => callback(reader.result as string);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Admin Login / First-Time PIN Setup Handler (No hardcoded secrets in source code)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pinInput.trim();
    if (!adminPin) {
      if (entered.length < 4) {
        setPinError(true);
        return;
      }
      setAdminPin(entered);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.adminSession, '1');
      } catch {
        // Ignore session storage errors
      }
      setPinError(false);
      setPinInput('');
      setView('admin');
      return;
    }
    if (entered === adminPin) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEYS.adminSession, '1');
      } catch {
        // Ignore session storage errors
      }
      setPinError(false);
      setPinInput('');
      setView('admin');
    } else {
      setPinError(true);
    }
  };

  // Change Admin PIN Handler
  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinField.trim() !== adminPin) {
      setPinChangeError(t.admin.pinModal.errCurrent);
      return;
    }
    if (newPinField.trim().length < 4) {
      setPinChangeError(t.admin.pinModal.errLength);
      return;
    }
    if (newPinField.trim() !== confirmPinField.trim()) {
      setPinChangeError(t.admin.pinModal.errMismatch);
      return;
    }
    setAdminPin(newPinField.trim());
    setCurrentPinField('');
    setNewPinField('');
    setConfirmPinField('');
    setPinChangeError('');
    setPinModalOpen(false);
    showToast(t.admin.pinModal.successToast);
  };

  // Export Leads to CSV
  const exportLeadsCsv = () => {
    const headers = [
      'ID',
      'Full Name',
      'Phone',
      'Country',
      'Email',
      'Service',
      'Timeline',
      'Message',
      'Status',
      'Admin Notes',
      'Created At',
    ];
    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.countryCode} ${l.phone}"`,
      `"${l.country.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${getServiceLabel(l.serviceValue)}"`,
      `"${(l.timeline || '').replace(/"/g, '""')}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      l.status,
      `"${l.adminNotes.replace(/"/g, '""')}"`,
      l.createdAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `estelux-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads in Admin Dashboard
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
    const q = leadSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      lead.fullName.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.country.toLowerCase().includes(q) ||
      lead.message.toLowerCase().includes(q) ||
      lead.adminNotes.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Add New Clinical Case Handler
  const handleAddNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseSrc.trim()) return;
    const titleEn = newCaseTitleEn.trim() || 'Clinical Case';
    const titleAr = newCaseTitleAr.trim() || 'حالة طبية';
    const meta = CATEGORY_META[newCaseCategory];
    const created: DentalCase = {
      id: `case-${Date.now()}`,
      src: newCaseSrc.trim(),
      category: newCaseCategory,
      titleEn,
      titleAr,
      tagEn: meta.tagEn,
      tagAr: meta.tagAr,
      captionEn:
        newCaseCaptionEn.trim() || `Before and after photos: ${titleEn}`,
      captionAr:
        newCaseCaptionAr.trim() || `صور قبل وبعد: ${titleAr}`,
      visible: true,
    };
    setDentalCases((prev) => [created, ...prev]);
    setNewCaseSrc('');
    setNewCaseTitleEn('');
    setNewCaseTitleAr('');
    setNewCaseCaptionEn('');
    setNewCaseCaptionAr('');
    if (newCaseFileRef.current) newCaseFileRef.current.value = '';
    showToast(t.admin.media.savedToast);
  };

  const moveCase = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= dentalCases.length) return;
    const copy = [...dentalCases];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    setDentalCases(copy);
    showToast(t.admin.media.savedToast);
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const fieldClass = (hasError?: boolean) =>
    `w-full min-h-[44px] px-3.5 rounded-xl border bg-[#FFFCFA] text-sm text-[#32241F] placeholder:text-[#A8968F] transition-colors focus:outline-none focus:bg-white focus:border-[#884838] focus:ring-2 focus:ring-[#884838]/15 ${hasError ? 'border-red-500' : 'border-[#E0CCC3] hover:border-[#C9A99D]'
    }`;
  const labelClass = 'block text-[12.5px] font-semibold text-[#4A3530] mb-1.5';
  const sectionNumber = (n: number) => (isRTL ? toArabicDigits(`0${n}`) : `0${n}`);

  const renderCaseThumbs = (category: SpecialtyCategory, colsClass: string, heightClass: string) => {
    const items = visibleCases.filter((c) => c.category === category);
    if (items.length === 0) return null;
    return (
      <div className={`grid ${colsClass} gap-2.5`}>
        {items.map((item) => {
          const globalIdx = visibleCases.findIndex((c) => c.id === item.id);
          const label = isRTL ? item.titleAr : item.titleEn;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(globalIdx)}
              aria-label={`${t.specialtiesSection.enlargePrefix} ${label}`}
              title={label}
              className="group relative bg-[#FBF5F2] border border-[#EADBD3] hover:border-[#B27262] rounded-xl overflow-hidden cursor-zoom-in transition-colors"
            >
              <img
                src={item.src}
                alt={label}
                loading="lazy"
                decoding="async"
                className={`w-full ${heightClass} object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]`}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-[#32241F]/0 group-hover:bg-[#32241F]/30 transition-colors duration-300"
              >
                <span className="w-9 h-9 rounded-full bg-white/95 text-[#884838] grid place-items-center shadow-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      id="top"
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={lang}
      className="min-h-screen bg-[#FAF7F2] text-[#4A3F3B] selection:bg-[#9A4F3E] selection:text-white antialiased"
      style={{
        fontFamily: isRTL
          ? "'Cairo', system-ui, sans-serif"
          : "'Montserrat', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Live Save Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 end-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1918] text-white text-xs sm:text-sm font-semibold shadow-xl border border-[#C47D6B]/40"
        >
          <CheckCircle2 className="w-4 h-4 text-[#1E9E54]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Admin Preview Bar when logged in as Coordinator and viewing public site */}
      {view === 'landing' && isAuthenticated && (
        <div className="bg-[#1C1918] text-white text-xs py-2 px-4 border-b border-[#C47D6B]/40">
          <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#EACDA3]">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.nav.returnToAdmin}</span>
            </span>
            <button
              type="button"
              onClick={openAdminPortal}
              className="px-3 py-1 rounded-lg bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white font-bold text-xs cursor-pointer transition-colors"
            >
              {t.nav.dashboardBtn}
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STICKY MINIMAL LUXURY HEADER (PUBLIC SITE & ADMIN MODE)
      ====================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FCF9F7]/95 backdrop-blur-md border-b border-[#E8C9C1]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 h-[74px] flex items-center justify-between gap-4">
          {/* ESTELUX Horizontal Brand Lockup */}
          <a
            href="#top"
            onClick={(e) => {
              if (view !== 'landing') {
                e.preventDefault();
                exitToLandingPage();
              }
            }}
            aria-label={t.nav.homeAria}
            className="inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
          >
            <div className="bg-white rounded-xl px-2 py-1 border border-[#E8C9C1] flex items-center justify-center shrink-0">
              <img
                src={brandLogo === DEFAULT_ASSETS.logo ? '/estelux-emblem.png' : brandLogo}
                alt={t.nav.logoAlt}
                width={48}
                height={38}
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/estelux-logo.png')) {
                    target.src = DEFAULT_ASSETS.logo;
                  }
                }}
                className="h-9 w-auto object-contain block"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-[0.26em] text-[#9E5B4B] leading-none">
                ESTELUX
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.04em] text-[#6B504A] mt-1 whitespace-nowrap">
                {t.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Clean Section Navigation */}
          {view === 'landing' && (
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-[#3B2A26] whitespace-nowrap"
            >
              <a href="#services" className="hover:text-[#9A4F3E] transition-colors py-1">
                {t.nav.services}
              </a>
              <a href="#support" className="hover:text-[#9A4F3E] transition-colors py-1">
                {t.nav.support}
              </a>
              <a href="#reviews" className="hover:text-[#9A4F3E] transition-colors py-1">
                {t.nav.reviews}
              </a>
            </nav>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {view !== 'landing' && (
              <button
                type="button"
                onClick={exitToLandingPage}
                className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-[#EFE7DD] hover:bg-[#E5D6CE] text-[#1C1918] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{t.nav.backToSite}</span>
              </button>
            )}

            {view === 'landing' && (
              <div className="hidden sm:flex items-center gap-1" dir="ltr">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.nav.instagram}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#884838] hover:bg-[#F7EEEA] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <path d="M17.5 6.5h.01" />
                  </svg>
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.nav.facebook}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#884838] hover:bg-[#F7EEEA] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
                    <path d="M14 22v-9h3l.5-3H14V8c0-.9.3-1.5 1.6-1.5H18V3.8c-.5-.1-1.6-.3-2.8-.3-2.9 0-4.7 1.7-4.7 4.6V10H8v3h2.5v9Z" />
                  </svg>
                </a>
              </div>
            )}

            {/* Bilingual Toggle (EN / العربية) */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-[#DDB0A5] bg-white hover:border-[#9A4F3E] text-xs font-bold text-[#1C1918] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-[#9A4F3E] shrink-0" />
              <span>{t.nav.langSwitch}</span>
            </button>

            {view === 'landing' && (
              <>
                <a
                  href={defaultWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.nav.whatsappAria}
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 sm:px-4 rounded-xl bg-[#157A3E] hover:bg-[#106231] text-white text-xs font-bold transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{t.nav.whatsapp}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label="Toggle Menu"
                  aria-expanded={mobileMenuOpen}
                  className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#DDB0A5] bg-white text-[#1C1918] cursor-pointer shrink-0"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {view === 'landing' && mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#E8C9C1] px-4 py-4 space-y-3 shadow-lg">
            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-[#1C1918] text-center">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-[#FCF9F7] hover:bg-[#F7EAE6]"
              >
                {t.nav.services}
              </a>
              <a
                href="#support"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-[#FCF9F7] hover:bg-[#F7EAE6]"
              >
                {t.nav.support}
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-[#FCF9F7] hover:bg-[#F7EAE6]"
              >
                {t.nav.reviews}
              </a>
            </div>
            <a
              href="#consultation"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 rounded-xl bg-[#9A4F3E] text-white text-center text-xs font-bold"
            >
              {t.hero.primaryCta}
            </a>
          </div>
        )}
      </header>

      {/* =====================================================================
          VIEW 1: ADMIN LOGIN PORTAL (#admin)
      ====================================================================== */}
      {view === 'login' && (
        <main className="py-16 sm:py-24 px-4">
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E5D6CE] p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFE7DD] flex items-center justify-center text-[#C47D6B]">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#1C1918]">{t.admin.loginTitle}</h1>
              <p className="text-xs sm:text-sm text-[#5A4E4A]">{t.admin.loginSub}</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder={t.admin.pinPlaceholder}
                  autoFocus
                  className={`w-full min-h-[48px] px-4 rounded-xl border text-center tracking-[0.25em] font-bold text-lg text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B] ${pinError ? 'border-red-600' : 'border-[#CDBBB2]'
                    }`}
                />
                {pinError && (
                  <p className="mt-2 text-xs text-red-700 text-center font-semibold">
                    {t.admin.pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white font-bold text-sm transition-colors cursor-pointer"
              >
                {t.admin.loginBtn}
              </button>
            </form>

            <div className="pt-2 border-t border-[#E5D6CE] flex items-center justify-center">
              <button
                type="button"
                onClick={exitToLandingPage}
                className="text-xs font-semibold text-[#52443F] hover:text-[#1C1918] cursor-pointer"
              >
                {t.admin.cancelBtn}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 2: ADMIN DASHBOARD (LEADS INBOX + MEDIA/GALLERY MANAGER)
      ====================================================================== */}
      {view === 'admin' && isAuthenticated && (
        <main className="max-w-[1320px] mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6">
          {/* Top Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5D6CE]">
            <div>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#C47D6B]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1C1918]">
                  {t.admin.portalTitle}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#5A4E4A] mt-1">{t.admin.portalSub}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCurrentPinField('');
                  setNewPinField('');
                  setConfirmPinField('');
                  setPinChangeError('');
                  setPinModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CDBBB2] bg-white hover:border-[#C47D6B] text-xs font-semibold text-[#1C1918] cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#C47D6B]" />
                <span>{t.admin.changePinBtn}</span>
              </button>

              <button
                type="button"
                onClick={exitToLandingPage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CDBBB2] bg-[#FAF7F2] hover:border-[#C47D6B] text-xs font-semibold text-[#1C1918] cursor-pointer"
              >
                <span>{t.nav.backToSite}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  try {
                    sessionStorage.removeItem(STORAGE_KEYS.adminSession);
                  } catch {
                    // Ignore
                  }
                  exitToLandingPage();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1918] text-white text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.admin.logout}</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#52443F]">
                <span>{t.admin.stats.total}</span>
                <Users className="w-4 h-4 text-[#C47D6B]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1C1918]">
                {isRTL ? toArabicDigits(leads.length) : leads.length}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#52443F]">
                <span>{t.admin.stats.new}</span>
                <Clock className="w-4 h-4 text-[#8C4332]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#8C4332]">
                {isRTL ? toArabicDigits(newLeadsCount) : newLeadsCount}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#52443F]">
                <span>{t.admin.stats.booked}</span>
                <CheckSquare className="w-4 h-4 text-[#1E9E54]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1E9E54]">
                {isRTL
                  ? toArabicDigits(leads.filter((l) => l.status === 'booked').length)
                  : leads.filter((l) => l.status === 'booked').length}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5D6CE]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#52443F]">
                <span>{t.admin.stats.activePhotos}</span>
                <ImageIcon className="w-4 h-4 text-[#C47D6B]" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1C1918]">
                {isRTL ? toArabicDigits(visibleCases.length) : visibleCases.length}
              </p>
            </div>
          </div>

          {/* Primary Dashboard Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#E5D6CE] pb-3">
            <button
              type="button"
              onClick={() => setAdminTab('leads')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${adminTab === 'leads'
                ? 'bg-[#9A4F3E] text-white shadow-xs'
                : 'bg-white text-[#4A3F3B] border border-[#E5D6CE] hover:border-[#C47D6B]'
                }`}
            >
              <Inbox className="w-4 h-4" />
              <span>{t.admin.tabLeads}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${adminTab === 'leads'
                  ? 'bg-white text-[#C47D6B]'
                  : 'bg-[#EFE7DD] text-[#1C1918]'
                  }`}
              >
                {isRTL ? toArabicDigits(leads.length) : leads.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab('media')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${adminTab === 'media'
                ? 'bg-[#9A4F3E] text-white shadow-xs'
                : 'bg-white text-[#4A3F3B] border border-[#E5D6CE] hover:border-[#C47D6B]'
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t.admin.tabMedia}</span>
            </button>
          </div>

          {/* -----------------------------------------------------------------
              TAB A: CONSULTATION MESSAGES / LEADS INBOX
          ------------------------------------------------------------------ */}
          {adminTab === 'leads' && (
            <div className="space-y-4">
              {/* Filter & Search Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5D6CE] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#52443F] absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder={t.admin.leads.searchPlaceholder}
                    className="w-full min-h-[42px] ps-10 pe-3.5 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { key: 'all', label: t.admin.leads.filterAll },
                      { key: 'new', label: t.admin.leads.statusNew },
                      { key: 'contacted', label: t.admin.leads.statusContacted },
                      { key: 'booked', label: t.admin.leads.statusBooked },
                      { key: 'archived', label: t.admin.leads.statusArchived },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setLeadStatusFilter(st.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${leadStatusFilter === st.key
                        ? 'bg-[#1C1918] text-white'
                        : 'bg-[#FAF7F2] text-[#4A3F3B] border border-[#E5D6CE] hover:border-[#C47D6B]'
                        }`}
                    >
                      {st.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={exportLeadsCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFE7DD] hover:bg-[#E5D6CE] text-[#1C1918] text-xs font-bold cursor-pointer ms-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.admin.leads.exportCsv}</span>
                  </button>
                </div>
              </div>

              {/* Leads Cards List */}
              {filteredLeads.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E5D6CE] p-12 text-center text-sm text-[#52443F]">
                  {t.admin.leads.empty}
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredLeads.map((lead) => {
                    const serviceName = getServiceLabel(lead.serviceValue);
                    const waDigits = `${lead.countryCode}${lead.phone}`.replace(/\D/g, '');
                    const waReplyHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(
                      t.admin.leads.waReplyGreeting(lead.fullName, serviceName)
                    )}`;

                    const statusBadgeStyle =
                      lead.status === 'new'
                        ? 'bg-[#9A4F3E]/15 text-[#A86554] border-[#C47D6B]/30'
                        : lead.status === 'contacted'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : lead.status === 'booked'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200';

                    return (
                      <article
                        key={lead.id}
                        className="bg-white rounded-2xl border border-[#E5D6CE] p-5 space-y-4 shadow-2xs"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#EFE7DD] pb-3.5">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-[#1C1918]">
                                {lead.fullName}
                              </h3>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadgeStyle}`}
                              >
                                {lead.status === 'new'
                                  ? t.admin.leads.statusNew
                                  : lead.status === 'contacted'
                                    ? t.admin.leads.statusContacted
                                    : lead.status === 'booked'
                                      ? t.admin.leads.statusBooked
                                      : t.admin.leads.statusArchived}
                              </span>
                              {lead.timeline && (
                                <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5D6CE] text-[11px] font-semibold text-[#5A4E4A]">
                                  {lead.timeline}
                                </span>
                              )}
                              <span className="text-[11px] text-[#52443F]">
                                • {formatDate(lead.createdAt)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4A3F3B]">
                              <span dir="ltr" className="font-semibold text-[#1C1918]">
                                {lead.countryCode} {lead.phone}
                              </span>
                              <span>• {lead.country}</span>
                              {lead.email && <span>• {lead.email}</span>}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as LeadStatus;
                                setLeads((prev) =>
                                  prev.map((item) =>
                                    item.id === lead.id ? { ...item, status: nextStatus } : item
                                  )
                                );
                                showToast(t.admin.media.savedToast);
                              }}
                              className="min-h-[38px] px-3 rounded-xl border border-[#CDBBB2] bg-[#FAF7F2] text-xs font-bold text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                            >
                              <option value="new">{t.admin.leads.statusNew}</option>
                              <option value="contacted">{t.admin.leads.statusContacted}</option>
                              <option value="booked">{t.admin.leads.statusBooked}</option>
                              <option value="archived">{t.admin.leads.statusArchived}</option>
                            </select>

                            <a
                              href={waReplyHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 rounded-xl bg-[#157A3E] hover:bg-[#198747] text-white text-xs font-bold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{t.admin.leads.whatsappReply}</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirmDeleteLeadId === lead.id) {
                                  setLeads((prev) => prev.filter((item) => item.id !== lead.id));
                                  setConfirmDeleteLeadId(null);
                                } else {
                                  setConfirmDeleteLeadId(lead.id);
                                  setTimeout(() => setConfirmDeleteLeadId(null), 3000);
                                }
                              }}
                              className={`inline-flex items-center gap-1 min-h-[38px] px-3 rounded-xl border text-xs font-semibold cursor-pointer ${confirmDeleteLeadId === lead.id
                                ? 'bg-red-600 text-white border-red-600'
                                : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                                }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>
                                {confirmDeleteLeadId === lead.id
                                  ? t.admin.leads.deleteConfirm
                                  : t.admin.leads.deleteBtn}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          <div className="lg:col-span-6 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EFE7DD] space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#8C4332]">{serviceName}</span>
                              <span className="text-[11px] uppercase text-[#52443F]">
                                {lead.langSubmitted}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#1C1918] leading-relaxed flex items-start gap-2">
                              <FileText className="w-4 h-4 text-[#52443F] shrink-0 mt-0.5" />
                              <span>{lead.message || t.admin.leads.noMessage}</span>
                            </p>
                          </div>

                          <div className="lg:col-span-6 space-y-1">
                            <label className="block text-xs font-bold text-[#1C1918]">
                              {t.admin.leads.notesLabel}
                            </label>
                            <textarea
                              rows={2}
                              value={lead.adminNotes}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLeads((prev) =>
                                  prev.map((item) =>
                                    item.id === lead.id ? { ...item, adminNotes: val } : item
                                  )
                                );
                              }}
                              placeholder={t.admin.leads.notesPlaceholder}
                              className="w-full px-3 py-2 rounded-xl border border-[#CDBBB2] bg-white text-xs sm:text-sm text-[#1C1918] placeholder:text-[#8E7F7A] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                            />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              TAB B: MEDIA & GALLERY MANAGER (LOGO, HERO PHOTO, BEFORE & AFTER)
          ------------------------------------------------------------------ */}
          {adminTab === 'media' && (
            <div className="space-y-8">
              {/* 1. Brand Logo & Hero Banner Editor */}
              <section className="bg-white rounded-2xl border border-[#E5D6CE] p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE7DD] pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#1C1918]">
                      {t.admin.media.brandSectionTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5A4E4A] mt-0.5">
                      {t.admin.media.brandSectionSub}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBrandLogo(DEFAULT_ASSETS.logo);
                      setHeroPhoto(DEFAULT_ASSETS.heroDental);
                      setDentalCases(INITIAL_CASES);
                      showToast(t.admin.media.savedToast);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CDBBB2] bg-[#FAF7F2] hover:border-[#C47D6B] text-xs font-bold text-[#1C1918] self-start cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C47D6B]" />
                    <span>{t.admin.media.resetDefaults}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Logo Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D6CE] space-y-3">
                    <p className="text-sm font-bold text-[#1C1918]">{t.admin.media.logoLabel}</p>
                    <div className="h-28 rounded-xl bg-white flex items-center justify-center p-3 border border-[#E8C9C1]">
                      <img
                        src={brandLogo}
                        alt="ESTELUX Logo Preview"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_ASSETS.logo;
                        }}
                        className="max-h-24 w-auto object-contain"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{t.admin.media.uploadBtn}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(
                              e.target.files?.[0],
                              (url) => {
                                setBrandLogo(url);
                                showToast(t.admin.media.savedToast);
                              },
                              true
                            )
                          }
                        />
                      </label>

                      <div className="flex-1 min-w-[180px] flex gap-1.5">
                        <input
                          type="url"
                          value={logoUrlInput}
                          onChange={(e) => setLogoUrlInput(e.target.value)}
                          placeholder={t.admin.media.urlPlaceholder}
                          className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-[#CDBBB2] bg-white text-xs text-[#1C1918]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (logoUrlInput.trim()) {
                              setBrandLogo(logoUrlInput.trim());
                              setLogoUrlInput('');
                              showToast(t.admin.media.savedToast);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1C1918] text-white text-xs font-bold cursor-pointer"
                        >
                          {t.admin.media.applyUrl}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hero Banner Photo Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D6CE] space-y-3">
                    <p className="text-sm font-bold text-[#1C1918]">
                      {t.admin.media.heroPhotoLabel}
                    </p>
                    <div className="h-28 rounded-xl bg-[#EFE7DD] overflow-hidden border border-[#E5D6CE]">
                      <img
                        src={heroPhoto}
                        alt="Hero Clinic Preview"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_ASSETS.heroDental;
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{t.admin.media.uploadBtn}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e.target.files?.[0], (url) => {
                              setHeroPhoto(url);
                              showToast(t.admin.media.savedToast);
                            })
                          }
                        />
                      </label>

                      <div className="flex-1 min-w-[180px] flex gap-1.5">
                        <input
                          type="url"
                          value={heroUrlInput}
                          onChange={(e) => setHeroUrlInput(e.target.value)}
                          placeholder={t.admin.media.urlPlaceholder}
                          className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-[#CDBBB2] bg-white text-xs text-[#1C1918]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (heroUrlInput.trim()) {
                              setHeroPhoto(heroUrlInput.trim());
                              setHeroUrlInput('');
                              showToast(t.admin.media.savedToast);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1C1918] text-white text-xs font-bold cursor-pointer"
                        >
                          {t.admin.media.applyUrl}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Add New Before & After Clinical Case */}
              <section className="bg-white rounded-2xl border border-[#E5D6CE] p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#1C1918]">
                    {t.admin.media.addCaseTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A4E4A] mt-0.5">
                    {t.admin.media.addCaseSub}
                  </p>
                </div>

                <form onSubmit={handleAddNewCase} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-2">
                    <div className="aspect-[4/3] max-h-56 w-full rounded-xl border-2 border-dashed border-[#CDBBB2] bg-[#FAF7F2] flex flex-col items-center justify-center overflow-hidden p-2">
                      {newCaseSrc ? (
                        <img
                          src={newCaseSrc}
                          alt="New case preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center space-y-1.5 p-3">
                          <ImageIcon className="w-7 h-7 text-[#C47D6B] mx-auto" />
                          <p className="text-xs font-semibold text-[#5A4E4A]">
                            {t.admin.media.choosePhoto}
                          </p>
                        </div>
                      )}
                    </div>

                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#EFE7DD] hover:bg-[#E5D6CE] text-[#1C1918] text-xs font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#C47D6B]" />
                      <span>{t.admin.media.choosePhoto}</span>
                      <input
                        ref={newCaseFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e.target.files?.[0], (url) => setNewCaseSrc(url))
                        }
                      />
                    </label>

                    <input
                      type="text"
                      value={newCaseSrc}
                      onChange={(e) => setNewCaseSrc(e.target.value)}
                      placeholder={t.admin.media.orImageUrl}
                      className="w-full px-3 py-2 rounded-xl border border-[#CDBBB2] text-xs text-[#1C1918]"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1C1918] mb-1">
                          {t.admin.media.caseTitleEn}
                        </label>
                        <input
                          type="text"
                          value={newCaseTitleEn}
                          onChange={(e) => setNewCaseTitleEn(e.target.value)}
                          placeholder={t.admin.media.caseTitleEnPh}
                          className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C1918] mb-1">
                          {t.admin.media.caseTitleAr}
                        </label>
                        <input
                          type="text"
                          value={newCaseTitleAr}
                          onChange={(e) => setNewCaseTitleAr(e.target.value)}
                          placeholder={t.admin.media.caseTitleArPh}
                          className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1918] mb-1">
                        {t.admin.media.caseCategory}
                      </label>
                      <select
                        value={newCaseCategory}
                        onChange={(e) =>
                          setNewCaseCategory(e.target.value as SpecialtyCategory)
                        }
                        className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] bg-white text-xs sm:text-sm font-semibold"
                      >
                        <option value="dental">{t.admin.media.catDental}</option>
                        <option value="hair">{t.admin.media.catHair}</option>
                        <option value="plastic">{t.admin.media.catPlastic}</option>
                        <option value="spine">{t.admin.media.catSpine}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1C1918] mb-1">
                          {t.admin.media.caseCaptionEn}
                        </label>
                        <input
                          type="text"
                          value={newCaseCaptionEn}
                          onChange={(e) => setNewCaseCaptionEn(e.target.value)}
                          className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1C1918] mb-1">
                          {t.admin.media.caseCaptionAr}
                        </label>
                        <input
                          type="text"
                          value={newCaseCaptionAr}
                          onChange={(e) => setNewCaseCaptionAr(e.target.value)}
                          className="w-full min-h-[42px] px-3 rounded-xl border border-[#CDBBB2] text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={!newCaseSrc.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] disabled:opacity-50 text-white text-xs sm:text-sm font-bold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.admin.media.addCaseBtn}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </section>

              {/* 3. Manage Existing Clinical Cases */}
              <section className="bg-white rounded-2xl border border-[#E5D6CE] p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-extrabold text-[#1C1918]">
                    {t.admin.media.manageCasesTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A4E4A] mt-0.5">
                    {t.admin.media.manageCasesSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dentalCases.map((item, idx) => {
                    const isEditing = editingCaseId === item.id && editDraft !== null;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 ${item.visible
                          ? 'bg-[#FAF7F2] border-[#E5D6CE]'
                          : 'bg-stone-100/80 border-stone-300 opacity-80'
                          }`}
                      >
                        <div className="w-full sm:w-36 shrink-0 space-y-2">
                          <div className="aspect-[4/3] rounded-xl bg-white border border-[#E5D6CE] overflow-hidden">
                            <img
                              src={isEditing ? editDraft.src : item.src}
                              alt={item.titleEn}
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_ASSETS.case1;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <label className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-white border border-[#CDBBB2] hover:border-[#C47D6B] text-[11px] font-bold text-[#1C1918] cursor-pointer">
                            <Upload className="w-3 h-3 text-[#C47D6B]" />
                            <span>{t.admin.media.uploadBtn}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (url) => {
                                  if (isEditing && editDraft) {
                                    setEditDraft({ ...editDraft, src: url });
                                  } else {
                                    setDentalCases((prev) =>
                                      prev.map((c) => (c.id === item.id ? { ...c, src: url } : c))
                                    );
                                    showToast(t.admin.media.savedToast);
                                  }
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                          {isEditing && editDraft ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editDraft.titleEn}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, titleEn: e.target.value })
                                }
                                placeholder={t.admin.media.caseTitleEn}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={editDraft.titleAr}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, titleAr: e.target.value })
                                }
                                placeholder={t.admin.media.caseTitleAr}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={editDraft.captionEn}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, captionEn: e.target.value })
                                }
                                placeholder={t.admin.media.caseCaptionEn}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs"
                              />
                              <input
                                type="text"
                                value={editDraft.captionAr}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, captionAr: e.target.value })
                                }
                                placeholder={t.admin.media.caseCaptionAr}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs"
                              />
                              <select
                                value={editDraft.category}
                                onChange={(e) => {
                                  const cat = e.target.value as SpecialtyCategory;
                                  setEditDraft({
                                    ...editDraft,
                                    category: cat,
                                    tagEn: CATEGORY_META[cat].tagEn,
                                    tagAr: CATEGORY_META[cat].tagAr,
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs font-semibold"
                              >
                                <option value="dental">{t.admin.media.catDental}</option>
                                <option value="hair">{t.admin.media.catHair}</option>
                                <option value="plastic">{t.admin.media.catPlastic}</option>
                                <option value="spine">{t.admin.media.catSpine}</option>
                              </select>
                              <input
                                type="text"
                                value={editDraft.src}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, src: e.target.value })
                                }
                                placeholder={t.admin.media.orImageUrl}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-[11px]"
                              />
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.visible
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-200 text-stone-700'
                                    }`}
                                >
                                  {item.visible
                                    ? t.admin.media.visibleBadge
                                    : t.admin.media.hiddenBadge}
                                </span>
                                <span className="text-[11px] font-bold text-[#8C4332]">
                                  {isRTL ? item.tagAr : item.tagEn}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-[#1C1918]">{item.titleEn}</h3>
                              <p className="text-xs font-semibold text-[#5A4E4A]">{item.titleAr}</p>
                              <p className="text-[11px] text-[#52443F] line-clamp-2 pt-0.5">
                                {isRTL ? item.captionAr : item.captionEn}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E5D6CE]">
                            {isEditing && editDraft ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDentalCases((prev) =>
                                      prev.map((c) => (c.id === item.id ? editDraft : c))
                                    );
                                    setEditingCaseId(null);
                                    setEditDraft(null);
                                    showToast(t.admin.media.savedToast);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#157A3E] text-white text-xs font-bold cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{t.admin.media.saveBtn}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCaseId(null);
                                    setEditDraft(null);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-[#CDBBB2] bg-white text-xs font-semibold cursor-pointer"
                                >
                                  {t.admin.media.cancelEdit}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCaseId(item.id);
                                    setEditDraft({ ...item });
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#CDBBB2] hover:border-[#C47D6B] text-xs font-semibold text-[#1C1918] cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3 text-[#C47D6B]" />
                                  <span>{t.admin.media.editBtn}</span>
                                </button>

                                <button
                                  type="button"
                                  title={t.admin.media.toggleVisibility}
                                  onClick={() => {
                                    setDentalCases((prev) =>
                                      prev.map((c) =>
                                        c.id === item.id ? { ...c, visible: !c.visible } : c
                                      )
                                    );
                                    showToast(t.admin.media.savedToast);
                                  }}
                                  className="p-1.5 rounded-lg bg-white border border-[#CDBBB2] hover:border-[#C47D6B] text-[#1C1918] cursor-pointer"
                                >
                                  {item.visible ? (
                                    <Eye className="w-3.5 h-3.5 text-[#1E9E54]" />
                                  ) : (
                                    <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  title={t.admin.media.moveUp}
                                  disabled={idx === 0}
                                  onClick={() => moveCase(idx, -1)}
                                  className="p-1.5 rounded-lg bg-white border border-[#CDBBB2] disabled:opacity-40 text-[#1C1918] cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  title={t.admin.media.moveDown}
                                  disabled={idx === dentalCases.length - 1}
                                  onClick={() => moveCase(idx, 1)}
                                  className="p-1.5 rounded-lg bg-white border border-[#CDBBB2] disabled:opacity-40 text-[#1C1918] cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  title={t.admin.leads.deleteBtn}
                                  onClick={() => {
                                    setDentalCases((prev) => prev.filter((c) => c.id !== item.id));
                                    showToast(t.admin.media.savedToast);
                                  }}
                                  className="p-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-700 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </main>
      )}

      {/* =====================================================================
          VIEW 3: PUBLIC LANDING PAGE (CLIENT CONTENT & STRUCTURE)
      ====================================================================== */}
      {view === 'landing' && (
        <main>
          {/* =================================================================
              SECTION 01 — HERO + CONSULTATION FORM (ABOVE THE FOLD)
          ================================================================== */}
          <section
            aria-labelledby="main-heading"
            className="relative overflow-hidden bg-gradient-to-b from-[#F7EEEA] via-[#FAF3EF] to-[#FFFCFA] border-b border-[#EADBD3]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -end-40 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(178,114,98,0.16),transparent_65%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-48 -start-40 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(136,72,56,0.08),transparent_65%)]"
            />

            <div className="relative max-w-[1200px] mx-auto px-4 sm:px-8 py-10 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* LEFT: Brand story */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2.5 ps-1.5 pe-4 py-1.5 rounded-full bg-white/70 border border-[#EADBD3] backdrop-blur-sm">
                  <span className="w-7 h-7 rounded-full bg-[#884838] grid place-items-center">
                    <img
                      src="/client-logo.webp"
                      alt=""
                      className="w-4 h-4 object-contain brightness-0 invert"
                    />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#884838]">
                    {t.hero.eyebrow}
                  </span>
                </div>

                <h1
                  id="main-heading"
                  className="font-editorial text-[2.6rem] sm:text-5xl xl:text-[3.6rem] font-semibold text-[#32241F] leading-[1.06] tracking-tight"
                >
                  {t.hero.title}
                </h1>

                <p className="font-editorial italic text-xl sm:text-2xl text-[#884838] flex items-center gap-3">
                  <span>{t.hero.sloganLeft}</span>
                  <span aria-hidden="true" className="h-px w-8 bg-[#B27262]/60" />
                  <span>{t.hero.sloganRight}</span>
                </p>

                <p className="text-[15px] text-[#69554E] leading-relaxed max-w-[46ch]">
                  {t.hero.lead}
                </p>

                {/* Specialty quick links */}
                <div className="grid grid-cols-2 gap-2.5 max-w-md">
                  {t.hero.quickLinks.map((link) => (
                    <a
                      key={link.id}
                      href="#services"
                      className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/80 border border-[#EADBD3] hover:border-[#B27262] hover:bg-white transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-[#F7EEEA] text-[#884838] grid place-items-center shrink-0 group-hover:bg-[#884838] group-hover:text-white transition-colors">
                        <SpecialtyIcon category={link.id} className="w-[18px] h-[18px]" />
                      </span>
                      <span className="text-[13px] font-semibold text-[#32241F] leading-tight">
                        {link.label}
                      </span>
                    </a>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                  <a
                    href={defaultWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[46px] px-5 rounded-xl bg-[#157A3E] hover:bg-[#106231] text-white font-bold text-sm shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.hero.whatsappCta}</span>
                  </a>
                  <a
                    href={defaultWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="text-sm font-semibold text-[#32241F] hover:text-[#884838] transition-colors"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                </div>
              </div>

              {/* RIGHT: Consultation form */}
              <div className="lg:col-span-7">
                <div
                  id="consultation"
                  className="relative bg-white rounded-3xl border border-[#EADBD3] shadow-[0_24px_60px_-20px_rgba(86,46,34,0.18)] p-6 sm:p-8 scroll-mt-24"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-[#B27262] via-[#884838] to-[#B27262]"
                  />

                  <div className="mb-5">
                    <h2
                      id="form-heading"
                      className="font-editorial text-2xl sm:text-[1.9rem] font-semibold text-[#32241F] tracking-tight"
                    >
                      {t.form.heading}
                    </h2>
                    <p className="mt-1.5 text-[13.5px] text-[#69554E] leading-relaxed">
                      {t.form.intro}
                    </p>
                  </div>

                  {submitted && lastSubmittedLead ? (
                    <div className="p-6 rounded-2xl bg-[#FBF7F4] border border-[#EADBD3] space-y-4">
                      <div className="flex items-center gap-2.5 text-[#0F6934] font-bold text-base">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{t.form.confirmTitle}</span>
                      </div>
                      <p className="text-sm text-[#4A3F3B] leading-relaxed">{t.form.confirmBody}</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <a
                          href={buildWhatsAppLinkFromLead(lastSubmittedLead)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[46px] inline-flex items-center gap-2 px-5 rounded-xl bg-[#157A3E] hover:bg-[#106231] text-white font-bold text-sm transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{t.form.confirmWaBtn}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false);
                            setLastSubmittedLead(null);
                          }}
                          className="text-xs font-bold text-[#884838] underline underline-offset-4 cursor-pointer"
                        >
                          {t.form.resetBtn}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      <fieldset className="min-w-0">
                        <legend className={labelClass}>{t.form.timelineLabel}</legend>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#F7EEEA]/70 border border-[#EADBD3]">
                          {t.form.timelines.map((tl) => (
                            <button
                              key={tl.value}
                              type="button"
                              aria-pressed={selectedTimeline === tl.value}
                              onClick={() => setSelectedTimeline(tl.value)}
                              className={`min-h-[38px] px-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${selectedTimeline === tl.value
                                  ? 'bg-[#884838] text-white shadow-sm'
                                  : 'text-[#5A4640] hover:bg-white/80'
                                }`}
                            >
                              {tl.label}
                            </button>
                          ))}
                        </div>
                      </fieldset>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
                        <div>
                          <label htmlFor="full-name" className={labelClass}>
                            {t.form.fullName} <span className="text-[#B27262]">*</span>
                          </label>
                          <input
                            ref={fullNameInputRef}
                            id="full-name"
                            type="text"
                            autoComplete="name"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                            placeholder={t.form.fullNamePlaceholder}
                            className={fieldClass(!!errors.name)}
                          />
                          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                          <label htmlFor="country" className={labelClass}>
                            {t.form.country} <span className="text-[#B27262]">*</span>
                          </label>
                          <input
                            id="country"
                            type="text"
                            autoComplete="country-name"
                            value={country}
                            onChange={(e) => {
                              setCountry(e.target.value);
                              if (errors.country) setErrors({ ...errors, country: '' });
                            }}
                            placeholder={t.form.countryPlaceholder}
                            className={fieldClass(!!errors.country)}
                          />
                          {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                        </div>

                        <div>
                          <label htmlFor="whatsapp-phone" className={labelClass}>
                            {t.form.whatsapp} <span className="text-[#B27262]">*</span>
                          </label>
                          <div className="flex gap-2" dir="ltr">
                            <select
                              aria-label={t.form.countryCodeAria}
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="w-[92px] shrink-0 min-h-[44px] px-2 rounded-xl border border-[#E0CCC3] bg-[#FBF5F2] text-xs font-bold text-[#32241F] focus:outline-none focus:border-[#884838] focus:ring-2 focus:ring-[#884838]/15"
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.id} value={c.code}>
                                  {c.flag} {c.code}
                                </option>
                              ))}
                            </select>
                            <input
                              id="whatsapp-phone"
                              type="tel"
                              autoComplete="tel"
                              value={phone}
                              onChange={(e) => {
                                setPhone(e.target.value);
                                if (errors.phone) setErrors({ ...errors, phone: '' });
                              }}
                              placeholder={t.form.whatsappPlaceholder}
                              className={`${fieldClass(!!errors.phone)} flex-1 min-w-0`}
                            />
                          </div>
                          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                        </div>

                        <div>
                          <label htmlFor="interested-service" className={labelClass}>
                            {t.form.serviceLabel} <span className="text-[#B27262]">*</span>
                          </label>
                          <select
                            id="interested-service"
                            value={selectedServiceValue}
                            onChange={(e) => {
                              setSelectedServiceValue(e.target.value);
                              if (errors.service) setErrors({ ...errors, service: '' });
                            }}
                            className={`${fieldClass(!!errors.service)} ${selectedServiceValue ? '' : 'text-[#A8968F]'}`}
                          >
                            <option value="" disabled>
                              {t.form.servicePlaceholder}
                            </option>
                            {t.form.services.map((srv) => (
                              <option key={srv.value} value={srv.value} className="text-[#32241F]">
                                {srv.label}
                              </option>
                            ))}
                          </select>
                          {errors.service && <p className="mt-1 text-xs text-red-600">{errors.service}</p>}
                        </div>

                        <div>
                          <label htmlFor="arrival-date" className={labelClass}>
                            {t.form.arrivalDate}
                          </label>
                          <input
                            id="arrival-date"
                            type="date"
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                            className={fieldClass()}
                          />
                        </div>

                        <div>
                          <label htmlFor="email-address" className={labelClass}>
                            {t.form.email}
                          </label>
                          <input
                            id="email-address"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            placeholder={t.form.emailPlaceholder}
                            className={fieldClass(!!errors.email)}
                          />
                          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="treatment-notes" className={labelClass}>
                            {t.form.message}
                          </label>
                          <textarea
                            id="treatment-notes"
                            rows={2}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t.form.messagePlaceholder}
                            className={`${fieldClass()} py-2.5 resize-y`}
                          />
                        </div>
                      </div>

                      <div className="pt-1 space-y-3.5">
                        <div>
                          <label className="flex items-start gap-2.5 text-[13px] text-[#69554E] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={consent}
                              onChange={(e) => {
                                setConsent(e.target.checked);
                                if (errors.consent) setErrors({ ...errors, consent: '' });
                              }}
                              className="mt-0.5 h-4 w-4 accent-[#884838] shrink-0"
                            />
                            <span>{t.form.consent}</span>
                          </label>
                          {errors.consent && <p className="mt-1 text-xs text-red-600">{errors.consent}</p>}
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-[#884838] hover:bg-[#6A382D] disabled:opacity-60 text-white font-bold text-[15px] shadow-[0_10px_24px_-10px_rgba(136,72,56,0.6)] transition-colors cursor-pointer"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{t.form.submitting}</span>
                            </>
                          ) : (
                            <>
                              <span>{t.form.submit}</span>
                              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 02 — OUR MEDICAL SERVICES
          ================================================================== */}
          <section
            id="services"
            aria-labelledby="services-heading"
            className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 scroll-mt-20"
          >
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="inline-block h-px w-12 bg-[#B27262] mb-4" aria-hidden="true" />
              <h2
                id="services-heading"
                className="font-editorial text-3xl sm:text-[2.6rem] font-semibold text-[#32241F] tracking-tight"
              >
                {t.specialtiesSection.heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(['dental', 'hair', 'plastic', 'spine'] as SpecialtyCategory[]).map((cat, idx) => {
                const s = t.specialtiesSection;
                const title = s[cat].title;
                return (
                  <article
                    key={cat}
                    className="luxury-card-hover group/card flex flex-col bg-white border border-[#EADBD3] rounded-3xl p-6 sm:p-7"
                  >
                    <header className="flex items-start gap-4 mb-4">
                      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F7EEEA] to-[#EFD9CF] text-[#884838] grid place-items-center shrink-0">
                        <SpecialtyIcon category={cat} className="w-6 h-6" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold tracking-[0.2em] text-[#B27262]">
                          {sectionNumber(idx + 1)}
                        </span>
                        <h3 className="font-editorial text-xl sm:text-[1.55rem] font-semibold text-[#32241F] leading-snug">
                          {title}
                        </h3>
                      </div>
                    </header>

                    <div className="space-y-3 text-[14px] text-[#69554E] leading-relaxed mb-5">
                      {cat === 'dental' && <p>{s.dental.desc}</p>}
                      {cat === 'hair' && <p>{s.hair.desc}</p>}
                      {cat === 'plastic' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#884838] mb-1">
                              {s.plastic.bodyTitle}
                            </h4>
                            <p>{s.plastic.bodyDesc}</p>
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#884838] mb-1">
                              {s.plastic.faceTitle}
                            </h4>
                            <p>{s.plastic.faceDesc}</p>

                          </div>
                        </div>
                      )}
                      {cat === 'spine' && (
                        <>
                          <p>{s.spine.desc}</p>
                          <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7EEEA] text-[#884838] text-[12.5px] font-bold">
                            <Award className="w-3.5 h-3.5" />
                            {s.spine.experience}
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                            {s.spine.offerings.map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#B27262] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    <div className="mt-auto space-y-4">
                      {cat === 'dental' && renderCaseThumbs('dental', 'grid-cols-3', 'h-[120px]')}
                      {cat === 'hair' && renderCaseThumbs('hair', 'grid-cols-3', 'h-[120px]')}
                      {cat === 'plastic' && renderCaseThumbs('plastic', 'grid-cols-2', 'h-[150px] lg:h-[230px]')}
                      {cat === 'spine' && renderCaseThumbs('spine', 'grid-cols-1', 'h-[140px]')}

                      <div className="pt-4 border-t border-[#F1E5DF]">
                        <button
                          type="button"
                          onClick={() => handleSelectServiceAndScroll(cat)}
                          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#884838] hover:text-[#32241F] transition-colors cursor-pointer"
                        >
                          <span>{s.consultCta}</span>
                          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* =================================================================
              SECTION 03 — PATIENT SUPPORT
          ================================================================== */}
          <section
            id="support"
            aria-labelledby="support-heading"
            className="bg-[#F7EEEA] border-y border-[#EADBD3] py-16 sm:py-20 scroll-mt-20"
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                <span className="inline-block h-px w-12 bg-[#B27262] mb-4" aria-hidden="true" />
                <h2
                  id="support-heading"
                  className="font-editorial text-3xl sm:text-[2.6rem] font-semibold text-[#32241F] tracking-tight"
                >
                  {t.support.heading}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {t.support.items.map((item, idx) => {
                  const Icon = SUPPORT_ICONS[idx] ?? HeartHandshake;
                  return (
                    <article
                      key={item.title}
                      className="luxury-card-hover relative flex items-start gap-5 bg-[#FFFCFA] border border-[#EADBD3] rounded-2xl p-6 sm:p-7 overflow-hidden"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-4 end-5 font-editorial text-5xl font-semibold text-[#884838]/[0.07] select-none leading-none"
                      >
                        {sectionNumber(idx + 1)}
                      </span>
                      <span className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F7EEEA] to-[#EFD9CF] border border-[#EADBD3] text-[#884838] grid place-items-center shrink-0 shadow-[0_6px_16px_-8px_rgba(136,72,56,0.35)]">
                        <Icon className="w-6 h-6" strokeWidth={1.6} />
                      </span>
                      <div className="relative flex-1 min-w-0 pe-8">
                        <h3 className="text-lg font-bold text-[#32241F] leading-snug">{item.title}</h3>
                        <p className="mt-1.5 text-[14px] text-[#69554E] leading-relaxed">{item.desc}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =================================================================
              SECTION 04 — PATIENT REVIEWS
          ================================================================== */}
          <section
            id="reviews"
            aria-labelledby="reviews-heading"
            className="max-w-[1200px] mx-auto px-4 sm:px-8 py-16 sm:py-20 scroll-mt-20"
          >
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="inline-block h-px w-12 bg-[#B27262] mb-4" aria-hidden="true" />
              <h2
                id="reviews-heading"
                className="font-editorial text-3xl sm:text-[2.6rem] font-semibold text-[#32241F] tracking-tight"
              >
                {t.reviews.heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {t.reviews.items.map((rev) => (
                <blockquote
                  key={rev.cite}
                  className="luxury-card-hover flex flex-col gap-5 bg-white border border-[#EADBD3] rounded-2xl p-7"
                >
                  <div className="flex items-center justify-between">
                    <Quote className="w-8 h-8 text-[#B27262]/40 rtl:-scale-x-100" />
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C89B5A] text-[#C89B5A]" />
                      ))}
                    </div>
                  </div>
                  <p className="font-editorial text-lg sm:text-xl text-[#32241F] leading-relaxed flex-1">
                    {rev.quote}
                  </p>
                  <cite className="not-italic flex items-center gap-3 pt-4 border-t border-[#F1E5DF]">
                    <span className="w-9 h-9 rounded-full bg-[#F7EEEA] text-[#884838] grid place-items-center text-sm font-bold">
                      {rev.cite.charAt(0)}
                    </span>
                    <span className="text-[13.5px] font-semibold text-[#69554E]">{rev.cite}</span>
                  </cite>
                </blockquote>
              ))}
            </div>
          </section>

          {/* =================================================================
              SECTION 05 — CONNECT WITH ESTELUX (CTA BAND)
          ================================================================== */}
          <section className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-16 sm:pb-20">
            <div className="relative overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_80%_0%,#A76150,#6A382D)] px-6 sm:px-12 py-10 sm:py-12 text-center">
              <img
                src="/client-logo.webp"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -end-10 -bottom-12 w-64 opacity-[0.08] brightness-0 invert"
              />
              <h2 className="relative font-editorial text-2xl sm:text-4xl font-semibold text-white tracking-tight">
                {t.social.heading}
              </h2>
              <div className="relative flex flex-wrap items-center justify-center gap-3 mt-7">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 min-h-[48px] px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <path d="M17.5 6.5h.01" />
                  </svg>
                  <span>{t.social.instagram}</span>
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 min-h-[48px] px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
                    <path d="M14 22v-9h3l.5-3H14V8c0-.9.3-1.5 1.6-1.5H18V3.8c-.5-.1-1.6-.3-2.8-.3-2.9 0-4.7 1.7-4.7 4.6V10H8v3h2.5v9Z" />
                  </svg>
                  <span>{t.social.facebook}</span>
                </a>
                <a
                  href={defaultWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 min-h-[48px] px-5 rounded-xl bg-[#25D366] hover:bg-[#1fbe5a] text-[#0F3B22] font-bold text-sm transition-colors"
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                  <span>{t.social.whatsapp}</span>
                </a>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          MINIMAL FOOTER
      ====================================================================== */}
      <footer className="border-t border-[#E8D7CF] bg-[#FFFCFA] py-6 pb-20 sm:pb-6">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#69554E]">
          <div className="flex items-center gap-3">
            <a href="#top" className="inline-flex items-center gap-2.5">
              <img
                src={brandLogo === DEFAULT_ASSETS.logo ? '/estelux-emblem.png' : brandLogo}
                alt="ESTELUX"
                width={44}
                height={46}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_ASSETS.logo;
                }}
                className="h-9 w-auto object-contain block"
              />
              <span className="text-sm font-extrabold tracking-[0.24em] text-[#884838]">
                ESTELUX
              </span>
            </a>
            <span className="text-[#CDBBB2]" aria-hidden="true">
              ·
            </span>
            <span className="font-semibold text-[#32241F]">{t.footer.location}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#32241F] hover:text-[#884838]"
            >
              <Phone className="w-3.5 h-3.5 text-[#884838]" />
              <span>{t.footer.whatsappLabel}:</span>
              <span dir="ltr">{WHATSAPP_DISPLAY}</span>
            </a>

            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="underline underline-offset-4 hover:text-[#32241F] cursor-pointer"
            >
              {t.footer.privacy}
            </button>

            <span>{t.footer.rights}</span>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          FLOATING WHATSAPP BUTTON & MOBILE STICKY CONSULTATION BAR
      ====================================================================== */}
      {view === 'landing' && (
        <>
          <a
            href={defaultWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.whatsappAria}
            className="hidden sm:inline-flex fixed bottom-6 end-6 z-40 items-center gap-2.5 px-4 py-3 rounded-full bg-[#157A3E] hover:bg-[#198747] text-white font-bold text-sm shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.nav.whatsapp}</span>
          </a>

          <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5D6CE] px-3 py-2 flex items-center gap-2">
            <a
              href="#consultation"
              onClick={(e) => {
                e.preventDefault();
                handleSelectServiceAndScroll(selectedServiceValue);
              }}
              className="flex-1 min-h-[42px] inline-flex items-center justify-center rounded-xl bg-[#9A4F3E] text-white font-bold text-xs"
            >
              {t.form.heading}
            </a>
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#157A3E] text-white font-bold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.nav.whatsapp}</span>
            </a>
          </div>
        </>
      )}

      {/* =====================================================================
          CLINICAL RESULTS LIGHTBOX MODAL
      ====================================================================== */}
      {lightboxIndex !== null && filteredCases[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full rounded-2xl bg-white overflow-hidden shadow-2xl border border-[#E5D6CE]"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5D6CE] bg-[#FAF7F2]">
              <div>
                <p className="text-xs font-bold text-[#8C4332]">
                  {isRTL
                    ? filteredCases[lightboxIndex].tagAr
                    : filteredCases[lightboxIndex].tagEn}
                </p>
                <h3 className="text-sm sm:text-base font-extrabold text-[#1C1918]">
                  {isRTL
                    ? filteredCases[lightboxIndex].titleAr
                    : filteredCases[lightboxIndex].titleEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label={t.lightbox.close}
                className="p-2 rounded-lg hover:bg-[#EFE7DD] text-[#1C1918] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-white p-2 flex items-center justify-center max-h-[68vh] overflow-hidden">
              <img
                src={filteredCases[lightboxIndex].src}
                alt={
                  isRTL
                    ? filteredCases[lightboxIndex].titleAr
                    : filteredCases[lightboxIndex].titleEn
                }
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_ASSETS.case1;
                }}
                className="max-h-[65vh] w-auto object-contain"
              />
              {filteredCases.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label={t.lightbox.prev}
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + filteredCases.length) % filteredCases.length
                      )
                    }
                    className="absolute start-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white border border-[#E5D6CE] shadow-md text-[#1C1918] cursor-pointer"
                  >
                    {isRTL ? (
                      <ChevronRight className="w-5 h-5" />
                    ) : (
                      <ChevronLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={t.lightbox.next}
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredCases.length)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white border border-[#E5D6CE] shadow-md text-[#1C1918] cursor-pointer"
                  >
                    {isRTL ? (
                      <ChevronLeft className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-4 bg-[#FAF7F2] border-t border-[#E5D6CE] space-y-3">
              <p className="text-xs sm:text-sm text-[#4A3F3B] leading-relaxed">
                {isRTL
                  ? filteredCases[lightboxIndex].captionAr
                  : filteredCases[lightboxIndex].captionEn}
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#52443F]">
                  {formatCaseLabel(lightboxIndex)} /{' '}
                  {isRTL ? toArabicDigits(filteredCases.length) : filteredCases.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const cat = filteredCases[lightboxIndex].category;
                    setLightboxIndex(null);
                    handleSelectServiceAndScroll(cat);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white text-xs font-bold cursor-pointer"
                >
                  {t.lightbox.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          CHANGE DASHBOARD PIN MODAL
      ====================================================================== */}
      {pinModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPinModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-2xl bg-white p-6 space-y-4 border border-[#E5D6CE] shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#C47D6B]" />
                <h3 className="font-bold text-lg text-[#1C1918]">{t.admin.pinModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPinModalOpen(false)}
                aria-label={t.footer.close}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5A4E4A]">{t.admin.pinModal.sub}</p>

            <form onSubmit={handleUpdatePin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1918] mb-1">
                  {t.admin.pinModal.currentLabel}
                </label>
                <input
                  type="password"
                  value={currentPinField}
                  onChange={(e) => {
                    setCurrentPinField(e.target.value);
                    setPinChangeError('');
                  }}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#CDBBB2] text-sm text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1918] mb-1">
                  {t.admin.pinModal.newLabel}
                </label>
                <input
                  type="password"
                  value={newPinField}
                  onChange={(e) => {
                    setNewPinField(e.target.value);
                    setPinChangeError('');
                  }}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#CDBBB2] text-sm text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1918] mb-1">
                  {t.admin.pinModal.confirmLabel}
                </label>
                <input
                  type="password"
                  value={confirmPinField}
                  onChange={(e) => {
                    setConfirmPinField(e.target.value);
                    setPinChangeError('');
                  }}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-[#CDBBB2] text-sm text-[#1C1918] focus:outline-none focus:ring-2 focus:ring-[#C47D6B]"
                />
              </div>

              {pinChangeError && (
                <p className="text-xs text-red-700 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinChangeError}</span>
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#CDBBB2] text-xs font-semibold text-[#1C1918] cursor-pointer"
                >
                  {t.admin.media.cancelEdit}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#9A4F3E] hover:bg-[#7D3D2E] text-white text-xs font-bold cursor-pointer"
                >
                  {t.admin.pinModal.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          PRIVACY POLICY MODAL
      ====================================================================== */}
      {privacyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPrivacyOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-2xl bg-white p-6 space-y-3 border border-[#E5D6CE] shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#1C1918]">{t.footer.privacyTitle}</h3>
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                aria-label={t.footer.close}
                className="p-1 rounded-lg hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#4A3F3B] leading-relaxed">{t.footer.privacyText}</p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#1C1918] text-white text-xs font-semibold cursor-pointer"
              >
                {t.footer.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
