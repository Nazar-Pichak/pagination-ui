document.addEventListener('DOMContentLoaded', function() {
  
  const span = (text, index) => {
    const node = document.createElement("span");
  
    node.textContent = text;
    node.style.setProperty("--index", index);
  
    return node;
  };
  
  const byLetter = (text) => [...text].map(span);
  
  const { matches: motionOK } = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  );
  
  if (motionOK) {
    const splitTargets = document.querySelectorAll("[split-by]");
  
    splitTargets.forEach((node) => {
      let nodes = byLetter(node.innerText);
  
      if (nodes) node.firstChild.replaceWith(...nodes);
    });
  }
  
  
  (() => {
    if (!("onscrollend" in window)) {
      let e = function (e, t, s) {
        let i = e[t];
        e[t] = function () {
          let e = Array.prototype.slice.apply(arguments, [0]);
          i.apply(this, e), e.unshift(i), s.apply(this, e);
        };
      },
        t = function (e, t, s, l) {
          if ("scroll" != t && "scrollend" != t) return;
          let o = this,
            a = n.get(o);
          if (void 0 === a) {
            let t = 0;
            (a = {
              scrollListener: (e) => {
                clearTimeout(t),
                  (t = setTimeout(() => {
                    r.size
                      ? setTimeout(a.scrollListener, 100)
                      : (o.dispatchEvent(i), (t = 0));
                  }, 100));
              },
              listeners: 0,
            }),
              e.apply(o, ["scroll", a.scrollListener]),
              n.set(o, a);
          }
          a.listeners++;
        },
        s = function (e, t, s) {
          if ("scroll" != t && "scrollend" != t) return;
          let i = this,
            r = n.get(i);
          void 0 !== r &&
            (r[t]--,
              --r.listeners > 0 ||
              (e.apply(i, ["scroll", r.scrollListener]), n.delete(i)));
        },
        i = new Event("scrollend"),
        r = new Set();
      document.addEventListener(
        "touchstart",
        (e) => {
          for (let t of e.changedTouches) r.add(t.identifier);
        },
        { passive: !0 }
      ),
        document.addEventListener(
          "touchend",
          (e) => {
            for (let t of e.changedTouches) r.delete(t.identifier);
          },
          { passive: !0 }
        );
      let n = new WeakMap();
      e(Element.prototype, "addEventListener", t),
        e(window, "addEventListener", t),
        e(document, "addEventListener", t),
        e(Element.prototype, "removeEventListener", s),
        e(window, "removeEventListener", s),
        e(document, "removeEventListener", s);
    }
    document.querySelectorAll(".gui-carousel").forEach((e) => {
      new (class {
        constructor(e) {
          (this.elements = {
            root: e,
            scroller: e.querySelector(".gui-carousel--scroller"),
            snaps: e.querySelectorAll(".gui-carousel--snap"),
            previous: null,
            next: null,
            pagination: null,
          }),
            (this.current = void 0),
            (this.hasIntersected = new Set()),
            this.elements.root.setAttribute("tabindex", -1),
            this.elements.root.setAttribute("aria-roledescription", "carousel"),
            this.elements.scroller.setAttribute("role", "group"),
            this.elements.scroller.setAttribute("aria-label", "Items Scroller"),
            this.elements.scroller.setAttribute("aria-live", "Polite"),
            this.#e(),
            this.#t(),
            this.#s(),
            this.#i(),
            this.#r(),
            this.#n();
        }
        #n() {
          for (let e of this.hasIntersected) {
            e.target.toggleAttribute("inert", !e.isIntersecting);
            let t = this.elements.pagination.children[this.#l(e.target)];
            t.setAttribute("aria-selected", e.isIntersecting),
              t.setAttribute("tabindex", e.isIntersecting ? "0" : "-1"),
              e.isIntersecting &&
              ((this.current = e.target),
                this.goToElement({
                  scrollport: this.elements.pagination,
                  element: t,
                }));
          }
          this.#o(), this.hasIntersected.clear();
        }
        goNext() {
          let e = this.current.nextElementSibling;
          this.current !== e &&
            (e
              ? (this.goToElement({
                scrollport: this.elements.scroller,
                element: e,
              }),
                (this.current = e))
              : console.log("at the end"));
        }
        goPrevious() {
          let e = this.current.previousElementSibling;
          this.current !== e &&
            (e
              ? (this.goToElement({
                scrollport: this.elements.scroller,
                element: e,
              }),
                (this.current = e))
              : console.log("at the beginning"));
        }
        goToElement({ scrollport: e, element: t }) {
          let s = this.#a(),
            i = Math.abs(e.offsetLeft - t.offsetLeft),
            r = parseInt(getComputedStyle(e)["padding-left"]),
            n = e.clientWidth / 2 > i ? i - r : i + r;
          e.scrollTo("ltr" === s ? n : -1 * n, 0);
        }
        #o() {
          let { lastElementChild: e, firstElementChild: t } =
            this.elements.scroller,
            s = this.current === e,
            i = this.current === t;
          document.activeElement === this.elements.next && s
            ? this.elements.previous.focus()
            : document.activeElement === this.elements.previous &&
            i &&
            this.elements.next.focus(),
            this.elements.next.toggleAttribute("disabled", s),
            this.elements.previous.toggleAttribute("disabled", i);
        }
        #r() {
          for (let e of this.elements.snaps) this.carousel_observer.observe(e);
          this.mutation_observer.observe(document, {
            childList: !0,
            subtree: !0,
          }),
            this.elements.scroller.addEventListener(
              "scrollend",
              this.#n.bind(this)
            ),
            this.elements.next.addEventListener("click", this.goNext.bind(this)),
            this.elements.previous.addEventListener(
              "click",
              this.goPrevious.bind(this)
            ),
            this.elements.pagination.addEventListener(
              "click",
              this.#c.bind(this)
            ),
            this.elements.root.addEventListener("keydown", this.#u.bind(this));
        }
        #h() {
          for (let e of this.elements.snaps) this.carousel_observer.unobserve(e);
          this.mutation_observer.disconnect(),
            this.elements.scroller.removeEventListener("scrollend", this.#n),
            this.elements.next.removeEventListener("click", this.goNext),
            this.elements.previous.removeEventListener("click", this.goPrevious),
            this.elements.pagination.removeEventListener("click", this.#c),
            this.elements.root.removeEventListener("keydown", this.#u);
        }
        #e() {
          (this.carousel_observer = new IntersectionObserver(
            (e) => {
              for (let t of e)
                this.hasIntersected.add(t),
                  t.target.classList.toggle("--in-view", t.isIntersecting);
            },
            { root: this.elements.scroller, threshold: 0.6 }
          )),
            (this.mutation_observer = new MutationObserver((e, t) => {
              e.filter((e) => e.removedNodes.length > 0).forEach((e) => {
                [...e.removedNodes].filter((e => e.querySelector(".gui-carousel") === this.elements.root)).forEach((e) => {
                  this.#h();
                });
              });
            }));
        }
        #i() {
          let e = this.elements.root.hasAttribute("carousel-start")
            ? this.elements.root.getAttribute("carousel-start") - 1
            : 0;
          (this.current = this.elements.snaps[e]),
            this.#m(),
            this.elements.snaps.forEach((e, t) => {
              this.hasIntersected.add({ isIntersecting: 0 === t, target: e }),
                this.elements.pagination.appendChild(this.#d(e, t)),
                e.setAttribute(
                  "aria-label",
                  `${t + 1} of ${this.elements.snaps.length}`
                ),
                e.setAttribute("aria-roledescription", "item");
            });
        }
        #m() {
          if (this.elements.root.hasAttribute("carousel-start")) {
            let e = this.elements.root.getAttribute("carousel-start"),
              t = this.elements.snaps[e - 1];
            this.elements.snaps.forEach(
              (e) => (e.style.scrollSnapAlign = "unset")
            ),
              (t.style.scrollSnapAlign = null),
              (t.style.animation = "carousel-scrollstart 1ms"),
              t.addEventListener(
                "animationend",
                (e) => {
                  (t.animation = null),
                    this.elements.snaps.forEach(
                      (e) => (e.style.scrollSnapAlign = null)
                    );
                },
                { once: !0 }
              );
          }
        }
        #c(e) {
          if (e.target.classList.contains("gui-carousel--pagination")) return;
          e.target.setAttribute("aria-selected", !0);
          let t = this.elements.snaps[this.#l(e.target)];
          this.goToElement({ scrollport: this.elements.scroller, element: t });
        }
        #u(e) {
          let t = this.#a(),
            s = this.#l(e.target);
          switch (e.key) {
            case "ArrowRight":
              e.preventDefault();
              let i = "ltr" === t ? 1 : -1,
                r = "ltr" === t ? this.elements.next : this.elements.previous;
              e.target.closest(".gui-carousel--pagination")
                ? this.elements.pagination.children[s + i]?.focus()
                : (document.activeElement === r && this.#g(r), r.focus()),
                "ltr" === t ? this.goNext() : this.goPrevious();
              break;
            case "ArrowLeft":
              e.preventDefault();
              let n = "ltr" === t ? -1 : 1,
                l = "ltr" === t ? this.elements.previous : this.elements.next;
              e.target.closest(".gui-carousel--pagination")
                ? this.elements.pagination.children[s + n]?.focus()
                : (document.activeElement === l && this.#g(l), l.focus()),
                "ltr" === t ? this.goPrevious() : this.goNext();
          }
        }
        #l(e) {
          let t = 0;
          for (; (e = e.previousElementSibling);) t++;
          return t;
        }
        #t() {
          let e = document.createElement("nav");
          (e.className = "gui-carousel--pagination"),
            this.elements.root.appendChild(e),
            (this.elements.pagination = e);
        }
        #d(e, t) {
          let s = this.elements.root.getAttribute("carousel-pagination");
          return (
            t++,
            "gallery" == s
              ? this.#p({ index: t, type: s, item: e })
              : this.#v({ index: t, type: s, item: e })
          );
        }
        #v({ index: e, type: t, item: s }) {
          let i = document.createElement("button"),
            r = s.querySelector("img"),
            n = s.querySelector("figcaption");
          return (
            (i.className = "gui-carousel--control"),
            (i.type = "button"),
            (i.role = "tab"),
            (i.title = `Item ${e}: ${r?.alt || n?.innerText}`),
            i.setAttribute("aria-label", r?.alt || n?.innerText),
            i.setAttribute("aria-setsize", this.elements.snaps.length),
            i.setAttribute("aria-posinset", e),
            i.setAttribute("aria-controls", `carousel-item-${e}`),
            i
          );
        }
        #p({ index: e, type: t, item: s }) {
          let i = document.createElement("button"),
            r = s.querySelector("img");
          return (
            (i.style.backgroundImage = `url(${r.src})`),
            (i.className = "gui-carousel--control --gallery"),
            (i.type = "button"),
            (i.role = "tab"),
            (i.title = `Item ${e}: ${r.alt}`),
            i.setAttribute("aria-label", r.alt),
            i.setAttribute("aria-setsize", this.elements.snaps.length),
            i.setAttribute("aria-posinset", e),
            i.setAttribute("aria-controls", `carousel-item-${e}`),
            i
          );
        }
        #s() {
          let e = document.createElement("div");
          e.className = "gui-carousel--controls";
          let t = this.#b("previous"),
            s = this.#b("next");
          e.appendChild(t),
            e.appendChild(s),
            (this.elements.previous = t),
            (this.elements.next = s),
            this.elements.root.prepend(e);
        }
        #b(e) {
          let t = document.createElement("button"),
            s = `${e.charAt(0).toUpperCase() + e.slice(1)} Item`;
          (t.type = "button"),
            (t.title = s),
            (t.className = `gui-carousel--control --${e}`),
            t.setAttribute("aria-controls", "gui-carousel--controls"),
            t.setAttribute("aria-label", s);
          let i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          i.setAttribute("aria-hidden", "true"),
            i.setAttribute("viewBox", "0 0 20 20"),
            i.setAttribute("fill", "currentColor");
          let r = document.createElementNS("http://www.w3.org/2000/svg", "path");
          return (
            r.setAttribute("fill-rule", "evenodd"),
            r.setAttribute("clip-rule", "evenodd"),
            r.setAttribute(
              "d",
              "next" === e
                ? "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                : "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            ),
            i.appendChild(r),
            t.appendChild(i),
            t
          );
        }
        #g(e) {
          (e.style.animation =
            "gui-carousel--control-keypress 145ms var(--ease-2)"),
            e.addEventListener(
              "animationend",
              (t) => {
                e.style.animation = null;
              },
              { once: !0 }
            );
        }
        #a() {
          return document.firstElementChild.getAttribute("dir") || "ltr";
        }
      })(e);
    });
  })();
  
  
});