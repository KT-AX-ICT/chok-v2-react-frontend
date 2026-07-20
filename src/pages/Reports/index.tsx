import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReports } from "../../api/reports";
import { SEVERITY_META } from "../../types/report";
import type { Report, Severity } from "../../types/report";
import { handleSeverityFilter, handleSearch, handleSort } from "../../utils/eventHandlers";
import { toLocalDateStr } from "../../utils/dateUtils";
import "../../styles/pages/reports.css";

const VALID_FILTERS = new Set(["all", "HIGH", "MID", "LOW"]);
const VALID_SORTS = new Set(["latest", "severity"]);
const VALID_PAGE_SIZES = new Set(["5", "10", "20"]);

const DEFAULTS = {
  filter: "all" as "all" | Severity,
  sort: "latest" as "latest" | "severity",
  pageSize: 10,
  page: 1,
  search: "",
};

function initDateRange() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  return { from: toLocalDateStr(weekAgo), to: toLocalDateStr(today) };
}

export default function Reports() {
  const nav = useNavigate();
  const [items, setItems] = useState<Report[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Severity>(DEFAULTS.filter);
  const [sort, setSort] = useState<"latest" | "severity">(DEFAULTS.sort);
  const [pageSize, setPageSize] = useState(DEFAULTS.pageSize);
  const [page, setPage] = useState(DEFAULTS.page);
  const [from, setFrom] = useState(() => initDateRange().from);
  const [to, setTo] = useState(() => initDateRange().to);
  const [search, setSearch] = useState(DEFAULTS.search);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    // 필터·검색·정렬·페이지네이션 전부 서버(mock 포함)에 위임 — 클라이언트 사이드로는 다시 계산하지 않음
    fetchReports({
      page: page - 1,
      size: pageSize,
      severity: filter !== "all" ? filter : undefined,
      from,
      to,
      search: search || undefined,
      sort,
    })
      .then((res) => { if (!ignore) { setItems(res.items); setTotalItems(res.total); } })
      .catch(() => { if (!ignore) { setItems([]); setTotalItems(0); } })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [page, pageSize, filter, from, to, search, sort]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const resetFilters = () => {
    const { from: initFrom, to: initTo } = initDateRange();
    setFilter(DEFAULTS.filter);
    setSort(DEFAULTS.sort);
    setPageSize(DEFAULTS.pageSize);
    setPage(DEFAULTS.page);
    setFrom(initFrom);
    setTo(initTo);
    setSearch(DEFAULTS.search);
  };

  return (
    <div className="screen reports-page">
      <div className="reports-page__title">리포트 목록</div>

      {/* 필터 바 */}
      <div className="reports-filters">
        <select
          aria-label="심각도 필터"
          value={filter}
          onChange={(e) => {
            const v = e.target.value;
            if (VALID_FILTERS.has(v)) handleSeverityFilter(v as "all" | Severity, setFilter, setPage);
          }}
          className="reports-ctrl"
        >
          <option value="all">전체 심각도</option>
          <option value="HIGH">HIGH</option>
          <option value="MID">MID</option>
          <option value="LOW">LOW</option>
        </select>
        <input
          type="date"
          aria-label="시작 날짜"
          value={from}
          onChange={(e) => { setFrom(e.target.value); setPage(1); }}
          className="reports-ctrl"
        />
        <span className="reports-range-sep">~</span>
        <input
          type="date"
          aria-label="종료 날짜"
          value={to}
          onChange={(e) => { setTo(e.target.value); setPage(1); }}
          className="reports-ctrl"
        />
        <input
          type="text"
          placeholder="서비스명·요약 검색..."
          aria-label="서비스명 또는 요약 검색"
          value={search}
          onChange={(e) => handleSearch(e.target.value, setSearch, setPage)}
          className="reports-search"
        />
        <select
          aria-label="정렬 기준"
          value={sort}
          onChange={(e) => {
            const v = e.target.value;
            if (VALID_SORTS.has(v)) handleSort(v as "latest" | "severity", setSort, setPage);
          }}
          className="reports-ctrl"
        >
          <option value="latest">최신순</option>
          <option value="severity">심각도순</option>
        </select>
        <select
          aria-label="페이지 크기"
          value={String(pageSize)}
          onChange={(e) => {
            const v = e.target.value;
            if (VALID_PAGE_SIZES.has(v)) { setPageSize(Number(v)); setPage(1); }
          }}
          className="reports-ctrl"
        >
          <option value="5">5개</option>
          <option value="10">10개</option>
          <option value="20">20개</option>
        </select>
        <button onClick={resetFilters} className="reports-reset-btn">초기화</button>
      </div>

      {/* 테이블 */}
      <div className="reports-table-wrap">
        <table className="reports-table">
          <colgroup>
            <col style={{ width: "80px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "155px" }} />
            <col />
            <col style={{ width: "72px" }} />
          </colgroup>
          <thead>
            <tr>
              <th className="reports-th reports-th--nowrap">심각도</th>
              <th className="reports-th">유형</th>
              <th className="reports-th">서비스</th>
              <th className="reports-th reports-th--nowrap">감지 시각</th>
              <th className="reports-th">요약</th>
              <th className="reports-th--action" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="reports-empty">로딩 중...</td>
              </tr>
            )}
            {!loading && items.map((r) => {
              const sev = SEVERITY_META[r.severity];
              return (
                <tr key={r.id} className="reports-row">
                  <td className="reports-td">
                    <span className="sev-badge" style={{ background: sev.bg, color: sev.color }}>{sev.label}</span>
                  </td>
                  <td className="reports-td reports-td--type">{r.type}</td>
                  <td className="reports-td reports-td--service">{r.service}</td>
                  <td className="reports-td reports-td--time">{r.time}</td>
                  <td className="reports-td reports-td--summary">{r.summary}</td>
                  <td className="reports-td reports-td--action">
                    <button
                      onClick={() => nav(`/app/reports/${r.id}`)}
                      aria-label="리포트 상세 보기"
                      className="reports-nav-btn"
                    >→</button>
                  </td>
                </tr>
              );
            })}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="reports-empty">조건에 맞는 리포트가 없습니다. 필터를 초기화해 보세요.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="reports-pagination">
        <span className="reports-pagination__count">총 {totalItems}건</span>
        <div className="reports-pagination__btns">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="reports-page-btn">← 이전</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button key={pg} onClick={() => setPage(pg)} className={`reports-page-btn${pg === page ? " reports-page-btn--active" : ""}`}>{pg}</button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="reports-page-btn">다음 →</button>
        </div>
      </div>
    </div>
  );
}
