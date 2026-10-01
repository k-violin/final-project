export const BLOG_CATEGORIES = ["데이터", "AI", "교육", "정책", "산업", "기업", "기타"] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  category: BlogCategory;
  writtenDate: string | null;
  author: string | null;
  published: boolean;
  isPinned: boolean;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export function blogPublishedLabel(published: boolean) {
  return published ? "노출" : "숨김";
}

export const STORAGE_KEY = "wisein-blog-mock";
export const BLOG_UPDATED_EVENT = "wisein-blog-updated";

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "mock-blog-1",
    title: "공공기관 데이터 분석, 어디서부터 시작하면 좋을까요?",
    content:
      "공공 자료는 출처와 수집 시점이 제각각인 경우가 많습니다. 먼저 의사결정에 필요한 질문을 정리하고, 그에 맞는 자료만 모아 같은 기준으로 정제하면 해석이 한결 쉬워집니다.\n\n와이즈인컴퍼니는 조사 설계부터 결과 보고까지 한 흐름으로 지원합니다. 숫자만 나열하기보다, 내부에서 바로 공유할 수 있는 의미를 함께 정리하는 것이 핵심입니다.",
    imagePath: "/company.jpg",
    category: "데이터",
    writtenDate: "2026-09-12",
    author: "와이즈인컴퍼니",
    published: true,
    isPinned: false,
    sortOrder: null,
    createdAt: "2026-09-12T09:00:00.000Z",
    updatedAt: "2026-09-12T09:00:00.000Z",
  },
  {
    id: "mock-blog-2",
    title: "조사분석 업무에 AI를 더할 때 점검할 세 가지",
    content:
      "자동화는 속도만의 문제가 아닙니다. 문항의 타당성, 개인정보 처리 범위, 결과 해석의 책임 소재를 먼저 나눠 두는 것이 안전합니다.\n\n특히 공공 영역에서는 설명 가능한 결과를 남기는 것이 중요합니다. 모델이 내놓은 값을 그대로 쓰기보다, 사람이 검토할 지점을 프로세스에 포함하는 편이 좋습니다.",
    imagePath: "/vision.png",
    category: "AI",
    writtenDate: "2026-08-28",
    author: "데이터연구소",
    published: true,
    isPinned: false,
    sortOrder: null,
    createdAt: "2026-08-28T09:00:00.000Z",
    updatedAt: "2026-08-28T09:00:00.000Z",
  },
  {
    id: "mock-blog-3",
    title: "국비 데이터 교육, 실무와 연결하는 방법",
    content:
      "강의실에서 배운 도구가 현장 자료와 만나야 역량이 됩니다. 실제 설문·행정 자료를 익명화해 실습에 쓰고, 보고 문서를 끝까지 작성해 보는 과정이 필요합니다.\n\n교육 과정은 도구 사용법보다 분석 질문을 세우는 연습에 더 많은 시간을 두는 것이 좋습니다.",
    imagePath: "/portfolio-1.jpg",
    category: "교육",
    writtenDate: "2026-07-15",
    author: "교육팀",
    published: false,
    isPinned: false,
    sortOrder: null,
    createdAt: "2026-07-15T09:00:00.000Z",
    updatedAt: "2026-07-15T09:00:00.000Z",
  },
];

export function loadBlogPosts(): BlogPost[] {
  if (typeof window === "undefined") return MOCK_BLOG_POSTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_BLOG_POSTS));
      return MOCK_BLOG_POSTS;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return MOCK_BLOG_POSTS;
    return parsed.map(normalizeBlogPost).filter((item): item is BlogPost => Boolean(item));
  } catch {
    return MOCK_BLOG_POSTS;
  }
}

function normalizeBlogPost(raw: unknown): BlogPost | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<BlogPost> & { status?: string };
  if (typeof item.id !== "string" || typeof item.title !== "string") return null;
  const published =
    typeof item.published === "boolean"
      ? item.published
      : item.status === "게시됨" || item.status === "공개";
  return {
    id: item.id,
    title: item.title,
    content: typeof item.content === "string" ? item.content : "",
    imagePath: typeof item.imagePath === "string" ? item.imagePath : "",
    category: (BLOG_CATEGORIES.includes(item.category as BlogCategory) ? item.category : "기타") as BlogCategory,
    writtenDate: item.writtenDate ?? null,
    author: item.author ?? null,
    published,
    isPinned: item.isPinned === true,
    sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : null,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? new Date().toISOString(),
  };
}

function persist(posts: BlogPost[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* ignore quota errors in mock mode */
  }
  window.dispatchEvent(new Event(BLOG_UPDATED_EVENT));
}

export function upsertBlogPost(post: BlogPost) {
  const posts = loadBlogPosts();
  const index = posts.findIndex((item) => item.id === post.id);
  const next = index >= 0 ? posts.map((item) => (item.id === post.id ? post : item)) : [post, ...posts];
  persist(next);
  return next;
}

export function deleteBlogPost(id: string) {
  const next = loadBlogPosts().filter((item) => item.id !== id);
  persist(next);
  return next;
}

export function getBlogPost(id: string) {
  return loadBlogPosts().find((item) => item.id === id);
}

export function publishedBlogPosts() {
  return loadBlogPosts()
    .filter((item) => item.published)
    .sort((a, b) => (b.writtenDate ?? b.createdAt).localeCompare(a.writtenDate ?? a.createdAt));
}

export function formatBlogDate(value?: string | null) {
  if (!value) return "";
  const ymd = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    const [year, month, day] = ymd.split("-");
    return `${year}. ${month}. ${day}`;
  }
  return "";
}
