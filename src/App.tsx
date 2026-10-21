import { useState, useEffect } from "react";
import "./App.css";
import { events } from "./data/events";
import type { Category } from "./types/campus-event";
import { filterByCategory, searchEvents, findEventById } from "./utils/filter-events";
import type { PageName } from "./types/page";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import EventList from "./components/events/EventList";
import EventFilter from "./components/events/EventFilter";
import EventDetail from "./components/events/EventDetail";
import EventForm from "./components/forms/EventForm";

function App() {
  const [page, setPage] = useState<PageName>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<Category | "">("");

  const selected = selectedId ? findEventById(events, selectedId) : undefined;

  let pageTitle = "Ana Sayfa";
  if (page === "events") pageTitle = "Etkinlikler";
  else if (page === "add") pageTitle = "Ekle";
  else if (page === "update") pageTitle = "Etkinlik Güncelle";
  else if (page === "detail" && selected) pageTitle = selected.title;

  useEffect(() => {
    document.title = `Kampüs Etkinlikleri — ${pageTitle}`;
  }, [pageTitle]);

  function go(next: PageName, id: string | null = null) {
    setPage(next);
    setSelectedId(id);
  }

  const upcoming = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  const categories = [...new Set(events.map((e) => e.category))];

  const filteredEvents = filterByCategory(
    searchEvents(events, searchText),
    category
  );

  return (
    <>
      <Header
        title={pageTitle}
        text={page === "home" ? "Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin." : undefined}
      />
      <Navigation current={page} onNavigate={go} />

      <main>
        {/* ANA SAYFA */}
        {page === "home" && (
          <div>
            <h2>Yaklaşan 2 Etkinlik</h2>
            <EventList events={upcoming} onShowDetail={(id) => go("detail", id)} />
            <div style={{ marginTop: "1.5rem" }}>
              <a href="#" className="buton" onClick={(e) => { e.preventDefault(); go("events"); }}>
                Tüm etkinlikleri gör
              </a>
            </div>
          </div>
        )}

        {/* ETKİNLİKLER SAYFASI */}
        {page === "events" && (
          <div>
            <EventFilter
              searchText={searchText}
              category={category}
              categories={categories}
              onSearchChange={setSearchText}
              onCategoryChange={setCategory}
            />

            <EventList
              events={filteredEvents}
              onShowDetail={(id) => go("detail", id)}
              emptyText="Aramanıza uygun etkinlik bulunamadı."
            />
          </div>
        )}

        {/* DETAY SAYFASI (Afiş Görseli Yalnızca Burada Gösterilir) */}
        {page === "detail" && selected && (
          <EventDetail
            event={selected}
            onBack={() => go("events")}
            onEdit={(id) => go("update", id)}
          />
        )}

        {/* EKLE / GÜNCELLE SAYFASI */}
        {(page === "add" || page === "update") && (
          <div>
            <h2>{page === "add" ? "Etkinlik Ekle" : "Etkinlik Güncelle"}</h2>
            <EventForm onSubmit={() => window.scrollTo(0, 0)} />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;