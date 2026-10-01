export const NOTICE_CATEGORIES = ["전체공지", "서비스", "회사소식", "기타"] as const;
export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

export type Notice = {
  id: string;
  category: NoticeCategory;
  title: string;
  content: string;
  writtenDate: string | null;
  author: string | null;
  isPinned: boolean;
  sortOrder: number | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export const NOTICE_STORAGE_KEY = "wisein-notice-mock";

export const MOCK_NOTICES: Notice[] = [
  {
    id: "mock-notice-1",
    category: "전체공지",
    title: "설 연휴 고객센터 운영 안내",
    content:
      "설 연휴 기간 동안 고객센터 운영 시간이 단축됩니다.\n\n문의가 급하시면 홈페이지 문의 폼을 이용해 주시면, 정상 근무일부터 순차적으로 답변드리겠습니다.",
    writtenDate: "2026-09-20",
    author: "와이즈인컴퍼니",
    isPinned: false,
    sortOrder: null,
    published: true,
    createdAt: "2026-09-20T09:00:00.000Z",
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "mock-notice-2",
    category: "서비스",
    title: "와이즈온 서비스 점검 안내",
    content:
      "더 안정적인 서비스 제공을 위해 시스템 점검을 진행합니다.\n\n점검 시간 동안 일부 기능 이용이 제한될 수 있습니다. 양해 부탁드립니다.",
    writtenDate: "2026-09-10",
    author: "서비스팀",
    isPinned: false,
    sortOrder: null,
    published: true,
    createdAt: "2026-09-10T09:00:00.000Z",
    updatedAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "mock-notice-3",
    category: "회사소식",
    title: "2026년 하반기 교육 일정 안내",
    content:
      "하반기 국비교육 과정 일정이 확정되었습니다.\n\n자세한 커리큘럼과 신청 방법은 교육 페이지에서 확인하실 수 있습니다.",
    writtenDate: "2026-08-28",
    author: "교육팀",
    isPinned: false,
    sortOrder: null,
    published: true,
    createdAt: "2026-08-28T09:00:00.000Z",
    updatedAt: "2026-08-28T09:00:00.000Z",
  },
];

function persist(notices: Notice[]) {
  window.localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(notices));
}

export function loadNotices(): Notice[] {
  if (typeof window === "undefined") return MOCK_NOTICES;
  try {
    const raw = window.localStorage.getItem(NOTICE_STORAGE_KEY);
    if (!raw) {
      persist(MOCK_NOTICES);
      return MOCK_NOTICES;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return MOCK_NOTICES;
    return parsed.filter(isNotice);
  } catch {
    return MOCK_NOTICES;
  }
}

function isNotice(value: unknown): value is Notice {
  if (!value || typeof value !== "object") return false;
  const item = value as Notice;
  return (
    typeof item.id === "string" &&
    NOTICE_CATEGORIES.includes(item.category as NoticeCategory) &&
    typeof item.title === "string" &&
    typeof item.content === "string"
  );
}

export function saveNotice(notice: Notice) {
  const notices = loadNotices();
  const index = notices.findIndex((item) => item.id === notice.id);
  const next =
    index >= 0 ? notices.map((item) => (item.id === notice.id ? notice : item)) : [notice, ...notices];
  persist(next);
  return next;
}

export function deleteNotice(id: string) {
  const next = loadNotices().filter((item) => item.id !== id);
  persist(next);
  return next;
}

export function getNotice(id: string) {
  return loadNotices().find((item) => item.id === id) ?? null;
}

export function formatNoticeDate(value?: string | null) {
  if (!value) return "";
  const ymd = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    const [year, month, day] = ymd.split("-");
    return `${year}. ${month}. ${day}`;
  }
  return "";
}
