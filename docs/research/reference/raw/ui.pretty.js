(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  52990,
  (e) => {
    e.v(function (t, n) {
      return e.b(
        t,
        "static/chunks/turbopack-worker-0sjn--fhq~1cg.js",
        ["static/chunks/0zimq09hzcz83.js", "static/chunks/turbopack-067e1b_0dkymz.js"],
        n,
      );
    });
  },
  53851,
  (e) => {
    "use strict";
    let t;
    var n = e.i(43476),
      r = e.i(47167);
    let a =
      ((t = 0), () => ((t += 1), `u${`0000${((1679616 * Math.random()) | 0).toString(36)}`.slice(-4)}${t}`));
    function i(e) {
      let t = [];
      for (let n = 0, r = e.length; n < r; n++) t.push(e[n]);
      return t;
    }
    let l = null;
    function s(e = {}) {
      return (
        l ||
        (l = e.includeStyleProperties
          ? e.includeStyleProperties
          : i(window.getComputedStyle(document.documentElement)))
      );
    }
    function o(e, t) {
      let n = (e.ownerDocument.defaultView || window).getComputedStyle(e).getPropertyValue(t);
      return n ? parseFloat(n.replace("px", "")) : 0;
    }
    function d(e, t = {}) {
      let n, r, a, i;
      return {
        width:
          t.width ||
          ((n = o(e, "border-left-width")), (r = o(e, "border-right-width")), e.clientWidth + n + r),
        height:
          t.height ||
          ((a = o(e, "border-top-width")), (i = o(e, "border-bottom-width")), e.clientHeight + a + i),
      };
    }
    function c(e) {
      return new Promise((t, n) => {
        let r = new Image();
        ((r.onload = () => {
          r.decode().then(() => {
            requestAnimationFrame(() => t(r));
          });
        }),
          (r.onerror = n),
          (r.crossOrigin = "anonymous"),
          (r.decoding = "async"),
          (r.src = e));
      });
    }
    async function u(e) {
      return Promise.resolve()
        .then(() => new XMLSerializer().serializeToString(e))
        .then(encodeURIComponent)
        .then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
    }
    async function m(e, t, n) {
      let r = "http://www.w3.org/2000/svg",
        a = document.createElementNS(r, "svg"),
        i = document.createElementNS(r, "foreignObject");
      return (
        a.setAttribute("width", `${t}`),
        a.setAttribute("height", `${n}`),
        a.setAttribute("viewBox", `0 0 ${t} ${n}`),
        i.setAttribute("width", "100%"),
        i.setAttribute("height", "100%"),
        i.setAttribute("x", "0"),
        i.setAttribute("y", "0"),
        i.setAttribute("externalResourcesRequired", "true"),
        a.appendChild(i),
        i.appendChild(e),
        u(a)
      );
    }
    let h = (e, t) => {
      if (e instanceof t) return !0;
      let n = Object.getPrototypeOf(e);
      return null !== n && (n.constructor.name === t.name || h(n, t));
    };
    function g(e, t, n, r) {
      let i,
        l,
        o,
        d = window.getComputedStyle(e, n),
        c = d.getPropertyValue("content");
      if ("" === c || "none" === c) return;
      let u = a();
      try {
        t.className = `${t.className} ${u}`;
      } catch (e) {
        return;
      }
      let m = document.createElement("style");
      (m.appendChild(
        ((i = `.${u}:${n}`),
        (o = d.cssText
          ? ((l = d.getPropertyValue("content")), `${d.cssText} content: '${l.replace(/'|"/g, "")}';`)
          : s(r)
              .map((e) => {
                let t = d.getPropertyValue(e),
                  n = d.getPropertyPriority(e);
                return `${e}: ${t}${n ? " !important" : ""};`;
              })
              .join(" ")),
        document.createTextNode(`${i}{${o}}`)),
      ),
        t.appendChild(m));
    }
    let p = "application/font-woff",
      b = "image/jpeg",
      f = {
        woff: p,
        woff2: p,
        ttf: "application/font-truetype",
        eot: "application/vnd.ms-fontobject",
        png: "image/png",
        jpg: b,
        jpeg: b,
        gif: "image/gif",
        tiff: "image/tiff",
        svg: "image/svg+xml",
        webp: "image/webp",
      };
    function y(e) {
      let t;
      return f[((t = /\.([^./]*?)$/g.exec(e)) ? t[1] : "").toLowerCase()] || "";
    }
    function x(e) {
      return -1 !== e.search(/^(data:)/);
    }
    function v(e, t) {
      return `data:${t};base64,${e}`;
    }
    async function w(e, t, n) {
      let r = await fetch(e, t);
      if (404 === r.status) throw Error(`Resource "${r.url}" not found`);
      let a = await r.blob();
      return new Promise((e, t) => {
        let i = new FileReader();
        ((i.onerror = t),
          (i.onloadend = () => {
            try {
              e(n({ res: r, result: i.result }));
            } catch (e) {
              t(e);
            }
          }),
          i.readAsDataURL(a));
      });
    }
    let j = {};
    async function E(e, t, n) {
      var r, a, i;
      let l,
        s,
        o =
          ((r = e),
          (a = t),
          (i = n.includeQueryParams),
          (s = r.replace(/\?.*/, "")),
          i && (s = r),
          /ttf|otf|eot|woff2?/i.test(s) && (s = s.replace(/.*\//, "")),
          a ? `[${a}]${s}` : s);
      if (null != j[o]) return j[o];
      n.cacheBust && (e += (/\?/.test(e) ? "&" : "?") + new Date().getTime());
      try {
        let r = await w(
          e,
          n.fetchRequestInit,
          ({ res: e, result: n }) => (t || (t = e.headers.get("Content-Type") || ""), n.split(/,/)[1]),
        );
        l = v(r, t);
      } catch (r) {
        l = n.imagePlaceholder || "";
        let t = `Failed to fetch resource: ${e}`;
        (r && (t = "string" == typeof r ? r : r.message), t && console.warn(t));
      }
      return ((j[o] = l), l);
    }
    async function S(e) {
      let t = e.toDataURL();
      return "data:," === t ? e.cloneNode(!1) : c(t);
    }
    async function N(e, t) {
      if (e.currentSrc) {
        let t = document.createElement("canvas"),
          n = t.getContext("2d");
        return (
          (t.width = e.clientWidth),
          (t.height = e.clientHeight),
          null == n || n.drawImage(e, 0, 0, t.width, t.height),
          c(t.toDataURL())
        );
      }
      let n = e.poster,
        r = y(n);
      return c(await E(n, r, t));
    }
    async function A(e, t) {
      var n;
      try {
        if (null == (n = null == e ? void 0 : e.contentDocument) ? void 0 : n.body)
          return await k(e.contentDocument.body, t, !0);
      } catch (e) {}
      return e.cloneNode(!1);
    }
    async function R(e, t) {
      return h(e, HTMLCanvasElement)
        ? S(e)
        : h(e, HTMLVideoElement)
          ? N(e, t)
          : h(e, HTMLIFrameElement)
            ? A(e, t)
            : e.cloneNode(I(e));
    }
    let I = (e) => null != e.tagName && "SVG" === e.tagName.toUpperCase();
    async function T(e, t, n) {
      var r, a;
      if (I(t)) return t;
      let l = [];
      return (
        0 ===
          (l =
            null != e.tagName && "SLOT" === e.tagName.toUpperCase() && e.assignedNodes
              ? i(e.assignedNodes())
              : h(e, HTMLIFrameElement) && (null == (r = e.contentDocument) ? void 0 : r.body)
                ? i(e.contentDocument.body.childNodes)
                : i((null != (a = e.shadowRoot) ? a : e).childNodes)).length ||
          h(e, HTMLVideoElement) ||
          (await l.reduce(
            (e, r) =>
              e
                .then(() => k(r, n))
                .then((e) => {
                  e && t.appendChild(e);
                }),
            Promise.resolve(),
          )),
        t
      );
    }
    async function C(e, t) {
      let n = e.querySelectorAll ? e.querySelectorAll("use") : [];
      if (0 === n.length) return e;
      let r = {};
      for (let a = 0; a < n.length; a++) {
        let i = n[a].getAttribute("xlink:href");
        if (i) {
          let n = e.querySelector(i),
            a = document.querySelector(i);
          n || !a || r[i] || (r[i] = await k(a, t, !0));
        }
      }
      let a = Object.values(r);
      if (a.length) {
        let t = "http://www.w3.org/1999/xhtml",
          n = document.createElementNS(t, "svg");
        (n.setAttribute("xmlns", t),
          (n.style.position = "absolute"),
          (n.style.width = "0"),
          (n.style.height = "0"),
          (n.style.overflow = "hidden"),
          (n.style.display = "none"));
        let r = document.createElementNS(t, "defs");
        n.appendChild(r);
        for (let e = 0; e < a.length; e++) r.appendChild(a[e]);
        e.appendChild(n);
      }
      return e;
    }
    async function k(e, t, n) {
      return n || !t.filter || t.filter(e)
        ? Promise.resolve(e)
            .then((e) => R(e, t))
            .then((n) => T(e, n, t))
            .then((n) =>
              (function (e, t, n) {
                if (
                  h(t, Element) &&
                  (!(function (e, t, n) {
                    let r = t.style;
                    if (!r) return;
                    let a = window.getComputedStyle(e);
                    a.cssText
                      ? ((r.cssText = a.cssText), (r.transformOrigin = a.transformOrigin))
                      : s(n).forEach((n) => {
                          let i = a.getPropertyValue(n);
                          if ("font-size" === n && i.endsWith("px")) {
                            let e = Math.floor(parseFloat(i.substring(0, i.length - 2))) - 0.1;
                            i = `${e}px`;
                          }
                          (h(e, HTMLIFrameElement) && "display" === n && "inline" === i && (i = "block"),
                            "d" === n && t.getAttribute("d") && (i = `path(${t.getAttribute("d")})`),
                            r.setProperty(n, i, a.getPropertyPriority(n)));
                        });
                  })(e, t, n),
                  g(e, t, ":before", n),
                  g(e, t, ":after", n),
                  h(e, HTMLTextAreaElement) && (t.innerHTML = e.value),
                  h(e, HTMLInputElement) && t.setAttribute("value", e.value),
                  h(e, HTMLSelectElement))
                ) {
                  let n = Array.from(t.children).find((t) => e.value === t.getAttribute("value"));
                  n && n.setAttribute("selected", "");
                }
                return t;
              })(e, n, t),
            )
            .then((e) => C(e, t))
        : null;
    }
    let M = /url\((['"]?)([^'"]+?)\1\)/g,
      O = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,
      z = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
    async function $(e, t, n, r, a) {
      try {
        let i,
          l,
          s = n
            ? (function (e, t) {
                if (e.match(/^[a-z]+:\/\//i)) return e;
                if (e.match(/^\/\//)) return window.location.protocol + e;
                if (e.match(/^[a-z]+:/i)) return e;
                let n = document.implementation.createHTMLDocument(),
                  r = n.createElement("base"),
                  a = n.createElement("a");
                return (
                  n.head.appendChild(r),
                  n.body.appendChild(a),
                  t && (r.href = t),
                  (a.href = e),
                  a.href
                );
              })(t, n)
            : t,
          o = y(t);
        if (a) {
          let e = await a(s);
          i = v(e, o);
        } else i = await E(s, o, r);
        return e.replace(
          ((l = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1")), RegExp(`(url\\(['"]?)(${l})(['"]?\\))`, "g")),
          `$1${i}$3`,
        );
      } catch (e) {}
      return e;
    }
    function P(e) {
      return -1 !== e.search(M);
    }
    async function L(e, t, n) {
      let r;
      if (!P(e)) return e;
      let a = (function (e, { preferredFontFormat: t }) {
        return t
          ? e.replace(z, (e) => {
              for (;;) {
                let [n, , r] = O.exec(e) || [];
                if (!r) return "";
                if (r === t) return `src: ${n};`;
              }
            })
          : e;
      })(e, n);
      return ((r = []), a.replace(M, (e, t, n) => (r.push(n), e)), r.filter((e) => !x(e))).reduce(
        (e, r) => e.then((e) => $(e, r, t, n)),
        Promise.resolve(a),
      );
    }
    async function D(e, t, n) {
      var r;
      let a = null == (r = t.style) ? void 0 : r.getPropertyValue(e);
      if (a) {
        let r = await L(a, null, n);
        return (t.style.setProperty(e, r, t.style.getPropertyPriority(e)), !0);
      }
      return !1;
    }
    async function F(e, t) {
      ((await D("background", e, t)) || (await D("background-image", e, t)),
        (await D("mask", e, t)) ||
          (await D("-webkit-mask", e, t)) ||
          (await D("mask-image", e, t)) ||
          (await D("-webkit-mask-image", e, t)));
    }
    async function G(e, t) {
      let n = h(e, HTMLImageElement);
      if (!(n && !x(e.src)) && !(h(e, SVGImageElement) && !x(e.href.baseVal))) return;
      let r = n ? e.src : e.href.baseVal,
        a = await E(r, y(r), t);
      await new Promise((r, i) => {
        ((e.onload = r),
          (e.onerror = t.onImageErrorHandler
            ? (...e) => {
                try {
                  r(t.onImageErrorHandler(...e));
                } catch (e) {
                  i(e);
                }
              }
            : i),
          e.decode && (e.decode = r),
          "lazy" === e.loading && (e.loading = "eager"),
          n ? ((e.srcset = ""), (e.src = a)) : (e.href.baseVal = a));
      });
    }
    async function U(e, t) {
      let n = i(e.childNodes).map((e) => _(e, t));
      await Promise.all(n).then(() => e);
    }
    async function _(e, t) {
      h(e, Element) && (await F(e, t), await G(e, t), await U(e, t));
    }
    let W = {};
    async function H(e) {
      let t = W[e];
      if (null != t) return t;
      let n = await fetch(e);
      return ((t = { url: e, cssText: await n.text() }), (W[e] = t), t);
    }
    async function B(e, t) {
      let n = e.cssText,
        r = /url\(["']?([^"')]+)["']?\)/g;
      return Promise.all(
        (n.match(/url\([^)]+\)/g) || []).map(async (a) => {
          let i = a.replace(r, "$1");
          return (
            i.startsWith("https://") || (i = new URL(i, e.url).href),
            w(i, t.fetchRequestInit, ({ result: e }) => ((n = n.replace(a, `url(${e})`)), [a, e]))
          );
        }),
      ).then(() => n);
    }
    function V(e) {
      if (null == e) return [];
      let t = [],
        n = e.replace(/(\/\*[\s\S]*?\*\/)/gi, ""),
        r = RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
      for (;;) {
        let e = r.exec(n);
        if (null === e) break;
        t.push(e[0]);
      }
      n = n.replace(r, "");
      let a = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,
        i = RegExp(
          "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",
          "gi",
        );
      for (;;) {
        let e = a.exec(n);
        if (null === e) {
          if (null === (e = i.exec(n))) break;
          a.lastIndex = i.lastIndex;
        } else i.lastIndex = a.lastIndex;
        t.push(e[0]);
      }
      return t;
    }
    async function J(e, t) {
      let n = [],
        r = [];
      return (
        e.forEach((n) => {
          if ("cssRules" in n)
            try {
              i(n.cssRules || []).forEach((e, a) => {
                if (e.type === CSSRule.IMPORT_RULE) {
                  let i = a + 1,
                    l = e.href,
                    s = H(l)
                      .then((e) => B(e, t))
                      .then((e) =>
                        V(e).forEach((e) => {
                          try {
                            n.insertRule(e, e.startsWith("@import") ? (i += 1) : n.cssRules.length);
                          } catch (t) {
                            console.error("Error inserting rule from remote css", { rule: e, error: t });
                          }
                        }),
                      )
                      .catch((e) => {
                        console.error("Error loading remote css", e.toString());
                      });
                  r.push(s);
                }
              });
            } catch (i) {
              let a = e.find((e) => null == e.href) || document.styleSheets[0];
              (null != n.href &&
                r.push(
                  H(n.href)
                    .then((e) => B(e, t))
                    .then((e) =>
                      V(e).forEach((e) => {
                        a.insertRule(e, a.cssRules.length);
                      }),
                    )
                    .catch((e) => {
                      console.error("Error loading remote stylesheet", e);
                    }),
                ),
                console.error("Error inlining remote css file", i));
            }
        }),
        Promise.all(r).then(
          () => (
            e.forEach((e) => {
              if ("cssRules" in e)
                try {
                  i(e.cssRules || []).forEach((e) => {
                    n.push(e);
                  });
                } catch (t) {
                  console.error(`Error while reading CSS rules from ${e.href}`, t);
                }
            }),
            n
          ),
        )
      );
    }
    async function X(e, t) {
      if (null == e.ownerDocument) throw Error("Provided element is not within a Document");
      let n = i(e.ownerDocument.styleSheets);
      return (await J(n, t))
        .filter((e) => e.type === CSSRule.FONT_FACE_RULE)
        .filter((e) => P(e.style.getPropertyValue("src")));
    }
    function Y(e) {
      return e.trim().replace(/["']/g, "");
    }
    async function q(e, t) {
      let n,
        r = await X(e, t),
        a =
          ((n = new Set()),
          !(function e(t) {
            ((t.style.fontFamily || getComputedStyle(t).fontFamily).split(",").forEach((e) => {
              n.add(Y(e));
            }),
              Array.from(t.children).forEach((t) => {
                t instanceof HTMLElement && e(t);
              }));
          })(e),
          n);
      return (
        await Promise.all(
          r
            .filter((e) => a.has(Y(e.style.fontFamily)))
            .map((e) => {
              let n = e.parentStyleSheet ? e.parentStyleSheet.href : null;
              return L(e.cssText, n, t);
            }),
        )
      ).join("\n");
    }
    async function K(e, t) {
      let n = null != t.fontEmbedCSS ? t.fontEmbedCSS : t.skipFonts ? null : await q(e, t);
      if (n) {
        let t = document.createElement("style"),
          r = document.createTextNode(n);
        (t.appendChild(r), e.firstChild ? e.insertBefore(t, e.firstChild) : e.appendChild(t));
      }
    }
    async function Q(e, t = {}) {
      let { width: n, height: r } = d(e, t),
        a = await k(e, t, !0);
      return (
        await K(a, t),
        await _(a, t),
        !(function (e, t) {
          let { style: n } = e;
          (t.backgroundColor && (n.backgroundColor = t.backgroundColor),
            t.width && (n.width = `${t.width}px`),
            t.height && (n.height = `${t.height}px`));
          let r = t.style;
          null != r &&
            Object.keys(r).forEach((e) => {
              n[e] = r[e];
            });
        })(a, t),
        await m(a, n, r)
      );
    }
    async function Z(e, t = {}) {
      let { width: n, height: a } = d(e, t),
        i = await Q(e, t),
        l = await c(i),
        s = document.createElement("canvas"),
        o = s.getContext("2d"),
        u =
          t.pixelRatio ||
          (function () {
            let e, t;
            try {
              t = r.default;
            } catch (e) {}
            let n = t && t.env ? t.env.devicePixelRatio : null;
            return (n && Number.isNaN((e = parseInt(n, 10))) && (e = 1), e || window.devicePixelRatio || 1);
          })(),
        m = t.canvasWidth || n,
        h = t.canvasHeight || a;
      return (
        (s.width = m * u),
        (s.height = h * u),
        !t.skipAutoScale &&
          (s.width > 16384 || s.height > 16384) &&
          (s.width > 16384 && s.height > 16384
            ? s.width > s.height
              ? ((s.height *= 16384 / s.width), (s.width = 16384))
              : ((s.width *= 16384 / s.height), (s.height = 16384))
            : s.width > 16384
              ? ((s.height *= 16384 / s.width), (s.width = 16384))
              : ((s.width *= 16384 / s.height), (s.height = 16384))),
        (s.style.width = `${m}`),
        (s.style.height = `${h}`),
        t.backgroundColor && ((o.fillStyle = t.backgroundColor), o.fillRect(0, 0, s.width, s.height)),
        o.drawImage(l, 0, 0, s.width, s.height),
        s
      );
    }
    async function ee(e, t = {}) {
      let n = await Z(e, t);
      return await (function (e, t = {}) {
        return new Promise(
          e.toBlob
            ? (n) => {
                e.toBlob(n, t.type ? t.type : "image/png", t.quality ? t.quality : 1);
              }
            : (n) => {
                let r = window.atob(
                    e.toDataURL(t.type ? t.type : void 0, t.quality ? t.quality : void 0).split(",")[1],
                  ),
                  a = r.length,
                  i = new Uint8Array(a);
                for (let e = 0; e < a; e += 1) i[e] = r.charCodeAt(e);
                n(new Blob([i], { type: t.type ? t.type : "image/png" }));
              },
        );
      })(n);
    }
    var et = e.i(71645),
      en = e.i(66737),
      er = e.i(70510),
      ea = e.i(14353),
      ei = e.i(85572);
    let el =
        "maybe spend more time locking in, and less time cheating. You're pretty bad at the latter anyways",
      es = (e, t) => Math.max(0, Math.min(2, e) - Math.max(0, t)),
      eo = (e, t = !1) => {
        if (0 === e.length) return [];
        let n = e.map((e) => (t ? 1 : Math.max(0, e.weight))),
          r = n.reduce((e, t) => e + t, 0) > 0 ? n : e.map(() => 1),
          a = r.reduce((e, t) => e + t, 0),
          i = 0;
        return r.map((e) => {
          let t = (i / a) * 360,
            n = ((i += e) / a) * 360;
          return { start: t, end: n, centre: (t + n) / 2, size: n - t };
        });
      };
    var ed = e.i(95503);
    let ec = "Isekai Waterloo: The Roulette Table that Decides my Jobless Fate!",
      eu = {
        id: "opening",
        title: ec,
        lines: [
          "I was a jobless bum on a Leetcode sabbatical when Truck-kun flattened me before I could update LinkedIn.",
          "Then Goddess Aqua decided I was hot enough for one more chance and dropped me into Waterloo.",
          "With this roulette table, let me not become unemployed in another world!!",
        ],
        continueLabel: "BEGIN",
      },
      em = {
        id: "graduation",
        title: "THE GRADUATION ARC",
        lines: [
          "Somehow, I survived Waterloo and walked across the stage with a degree in my hands.",
          "Every terrible roll, rejected interview, and sleepless term has become lore for my character arc.",
          "Now I only need the labour market to believe any of this was worth it.",
        ],
        continueLabel: "SEE MY FATE",
      },
      eh = {
        id: "death",
        title: "TRUCK-KUN RETURNS",
        lines: [
          "Truck-kun found me again, which feels less like fate and more like targeted harassment.",
          "My second life at Waterloo ends before I can optimize the résumé bullet.",
          "Sometimes life happens... to me, apparently.",
        ],
        continueLabel: "SEE MY FATE",
      },
      eg = {
        id: "yc",
        title: "THE FOUNDER ARC",
        lines: [
          "I got into YC, so apparently dropping out is visionary when investors approve it.",
          "Aqua is already calling this my genius founder arc instead of academic withdrawal.",
          "I am moving to California to become someone else's LinkedIn post.",
        ],
        continueLabel: "SEE MY FATE",
      };
    var ep = e.i(77204),
      eb = e.i(30995),
      ef = e.i(95659),
      ey = e.i(18272);
    let ex = er.COMPANIES,
      ev = { systems: 0, product: 0, aiData: 0, quant: 0, hardware: 0, mechanical: 0, bioNano: 0 },
      ew = { gold: "#f7c948", red: "#d94a38", green: "#1f8a60", ink: "#262622", cream: "#c9bfa9" },
      ej = new Set(["highschool-average", "scholarship", "study-grade", "recruit-count", "work-eval"]),
      eE = 1e3 / 12,
      eS = ["/audio/click3.mp3", "/audio/click4.mp3"],
      eN = "waterloo-roulette:meta-unlocked",
      eA = { x1: 0.12, y1: 0.68, x2: 0.11, y2: 1 },
      eR = { x1: 0.55, y1: 0, x2: 0.45, y2: 1 },
      eI = (e) => Object.fromEntries(ea.AXES.map((t) => [t, e[t] ?? 0])),
      eT = (e, t, n = 0) => {
        let r = eI(e);
        return (
          Array.isArray(t)
            ? t.forEach((e) => {
                r[e] = Math.max(0, r[e] + n);
              })
            : ea.AXES.forEach((e) => {
                r[e] = Math.max(0, r[e] + (t[e] ?? 0));
              }),
          r
        );
      },
      eC = (e, t, n = "spin") => {
        let r =
          ((e) => {
            let t = 0x811c9dc5;
            for (let n = 0; n < e.length; n += 1) ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 0x1000193)));
            return t >>> 0;
          })(`${e}:${t}:${n}`) || 1;
        return ((r ^= r << 13), (r ^= r >>> 17), ((r ^= r << 5) >>> 0) / 0x100000000);
      },
      ek = (e) => ({
        contentVersion: "2026.8",
        seed: e,
        rngCounter: 0,
        stage: "highschool-average",
        status: "active",
        highSchoolAverage: null,
        program: null,
        major: null,
        sequenceName: null,
        timeline: [],
        termIndex: 0,
        studyTerms: 0,
        consecutiveLowTerms: 0,
        rizz: eI(ev),
        average: 78,
        integrity: 2,
        momentum: 0,
        savings: 0,
        moneyEvents: [],
        scholarshipId: null,
        exchange: { applicationRolled: !1, accepted: !1, universityId: null, pending: !1, active: !1 },
        guaranteedAmazonOffer: !1,
        professorReference: !1,
        teams: [],
        jobs: [],
        returnOffers: [],
        pendingJob: null,
        currentJob: null,
        currentWorkEvents: [],
        ycContinuation: null,
        bankNoticeShown: !1,
        bankNoticePending: !1,
        multiTaskRollsRemaining: 0,
        admissions: {
          mainEngineeringId: null,
          backupEngineeringId: null,
          selectedMathProgramIds: [],
          currentProgramId: null,
          results: [],
        },
        gradSchool: { selectedIds: [], currentId: null, results: [] },
        recruiting: { target: 0, completed: 0, interviews: [], selectedJob: null },
        log: [],
        lastResult: null,
        ending: null,
        endingCode: null,
      }),
      eM = (e) => (e ? (ex.find((t) => t.id === e.id) ?? e) : null),
      eO = () => {
        let e = "waterloo-roulette:visitor",
          t = window.localStorage.getItem(e);
        if (t) return t;
        let n = crypto.randomUUID();
        return (window.localStorage.setItem(e, n), n);
      },
      ez = async () => {
        let e = await fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "playtime", visitorId: eO() }),
            keepalive: !0,
          }),
          t = await e.json();
        if (!e.ok || !0 !== t.configured || !Number.isFinite(t.playtimeSeconds))
          throw Error("Playtime unavailable");
        return t.playtimeSeconds;
      },
      e$ = async (e) => {
        let t = await fetch("/api/leaderboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              visitorId: eO(),
              runId: e.seed,
              savings: e.savings,
              totalRizz: ea.AXES.reduce((t, n) => t + e.rizz[n], 0),
              escaped:
                "yc" === e.endingCode ||
                !!e.exchange.universityId ||
                e.jobs.some((e) => e.job && (0, er.isOutsideGtaAndLoo)(e.job.location)),
              coopJobs: e.jobs.filter((e) => e.job || e.evaluation.startsWith(ed.DESIGN_TEAM_COOP_EVALUATION))
                .length,
              moneyEvents: e.moneyEvents,
            }),
          }),
          n = await t.json();
        if (!t.ok || !("configured" in n) || !n.configured)
          throw Error("Leaderboard is waiting for its Redis connection.");
        return n;
      },
      eP = (e) => e.timeline[e.termIndex] ?? null,
      eL = (e) => e.timeline[e.termIndex + 1] ?? null,
      eD = (e) => Math.round(100 * e) / 100,
      eF = (e, t, n, r = eP(e)?.label ?? "PRE-REG") => {
        let a = eD(t.savings - e.savings);
        return 0 === a
          ? t
          : {
              ...t,
              moneyEvents: [...t.moneyEvents, { term: r, label: n, amount: a, balance: eD(t.savings) }].slice(
                -64,
              ),
            };
      },
      eG = (e) => e.returnOffers ?? [],
      eU = (e) => e.savings < 0 && 0 === eG(e).length,
      e_ = (e, t) => e.filter((e) => e.job.id !== t),
      eW = (e) => e.timeline.slice(0, e.termIndex + 2).filter((e) => "coop" === e.kind).length,
      eH = (e) => {
        let t = ea.AXES.map((t) => e.rizz[t]).sort((e, t) => t - e);
        return 0.55 * t[0] + 0.25 * t[1] + 0.2 * t[2];
      },
      eB = (e) => ({
        rizz: e.rizz,
        completedCoops: e.jobs.filter((e) => e.job).length,
        leadership: e.teams.reduce((e, t) => e + t.rank, 0),
        average: e.average,
        integrityIncidents: 2 - e.integrity,
        workTerm: Math.max(1, eW(e)),
      }),
      eV = {
        ship: 2.75,
        mentor: 1,
        tests: 0.5,
        forgotten: -2.5,
        incident: -5,
        patent: 4.5,
        workaholic: 0,
        cancelled: -0.5,
        layoff: -0.25,
        fired: -8,
        dropout: 4,
      },
      eJ = (e, t) => (0, ei.resumeScore)(eB(e), t),
      eX = (e) =>
        new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: "CAD",
          maximumFractionDigits: 0,
        }).format(e),
      eY = (e) => `${eX(e)} (CAD)/HR`,
      eq = (e) =>
        e <= 2
          ? "easy interview"
          : e <= 4
            ? "doable interview"
            : e <= 6
              ? "hard interview"
              : e <= 8
                ? "very hard interview"
                : "insane interview",
      eK = (e, t, n, r = "ink") => {
        let a = eP(e)?.label ?? "PRE-REG",
          i = { id: e.rngCounter, term: a, title: t, detail: n, tone: r };
        return { ...e, log: [i, ...e.log].slice(0, 80), lastResult: { title: t, detail: n, tone: r } };
      },
      eQ = (e) => {
        let t = eP(e);
        return t
          ? "study" === t.kind
            ? { ...e, stage: "study-grade" }
            : "off" === t.kind
              ? { ...e, stage: "term-event" }
              : e.pendingJob
                ? {
                    ...e,
                    stage: "term-event",
                    currentJob: e.pendingJob,
                    pendingJob: null,
                    currentWorkEvents: [],
                  }
                : { ...e, stage: "unemployed", currentJob: null }
          : { ...e, stage: eU(e) ? "ending-select" : "grad-applications" };
      },
      eZ = (e) => eQ({ ...e, termIndex: e.termIndex + 1 }),
      e0 = (e) =>
        eL(e)?.kind === "coop"
          ? {
              ...e,
              stage: "recruit-count",
              recruiting: { target: 0, completed: 0, interviews: [], selectedJob: null },
            }
          : eZ(e),
      e1 = (e) => {
        let t = eP(e);
        return e.program && ea.MATH_MAJOR_PROGRAM_IDS.includes(e.program.id) && !e.major && t?.label === "1B"
          ? { ...e, stage: "major" }
          : eL(e)?.kind === "coop"
            ? {
                ...e,
                stage: "recruit-count",
                recruiting: { target: 0, completed: 0, interviews: [], selectedJob: null },
              }
            : eZ(e);
      },
      e2 = () =>
        ex.find((e) => "Amazon" === e.company && "Software Development Engineer Intern" === e.role) ??
        ex.find((e) => "Amazon" === e.company) ??
        null,
      e5 = (e, t) =>
        e.jobs.some((e) => e.job?.location.endsWith(", CA"))
          ? { ...e, stage: "yc-roll", ycContinuation: t }
          : "study" === t
            ? e1(e)
            : e0(e),
      e3 = (e) =>
        (0, ef.isExchangeEligibleStudyTerm)(eP(e)?.label) && e.average >= 80 && !e.exchange.applicationRolled
          ? { ...e, stage: "exchange-application" }
          : e5(e, "study"),
      e6 = (e) => {
        let t,
          n,
          r,
          a = new Set(e.teams.map((e) => e.name));
        return (
          (t = ea.TEAMS.filter((e) => !a.has(e.name))),
          (n = "team"),
          (r = ea.DESIGN_TEAM_ROLL_SIZE),
          [...t]
            .sort(
              (t, r) =>
                eC(e.seed, e.rngCounter, `${n}:${r.id ?? r.name}`) -
                eC(e.seed, e.rngCounter, `${n}:${t.id ?? t.name}`),
            )
            .slice(0, r)
        );
      },
      e4 = (e) => {
        let t = e.reduce((e, t) => e + Math.max(0, t.weight), 0);
        return [
          ...e,
          {
            id: "run-over",
            label: "Got run over",
            short: "GOT RUN OVER",
            detail: "The run ends immediately.",
            weight: ((5 / 360) * t) / (1 - 5 / 360),
            tone: "red",
          },
        ];
      },
      e8 = (e) =>
        [
          ...e.recruiting.interviews.filter((e) => "offer" === e.outcome).map((e) => e.job),
          ...eG(e).map((e) => e.job),
          ...(e.guaranteedAmazonOffer && e2() ? [e2()] : []),
        ].filter((e, t, n) => n.findIndex((t) => t.id === e.id) === t),
      e7 = (e, t, n) => {
        let r = 1 - e;
        return 3 * r * r * e * t + 3 * r * e * e * n + e * e * e;
      };
    function e9() {
      return (0, n.jsxs)("svg", {
        className: "top-meta-lock",
        viewBox: "0 0 12 12",
        "aria-hidden": "true",
        focusable: "false",
        children: [
          (0, n.jsx)("rect", {
            x: "2.5",
            y: "5.5",
            width: "7",
            height: "5",
            rx: "0.6",
            fill: "currentColor",
          }),
          (0, n.jsx)("path", {
            d: "M4 5.5V4a2 2 0 0 1 4 0v1.5",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.2",
            strokeLinecap: "square",
          }),
        ],
      });
    }
    function te({ state: e }) {
      return 0 === e.timeline.length
        ? (0, n.jsx)("div", { className: "timeline empty", "aria-hidden": "true" })
        : (0, n.jsx)("div", {
            className: "timeline",
            "aria-label": "Study and work term timeline",
            children: e.timeline.map((t, r) =>
              (0, n.jsxs)(
                "div",
                {
                  className: `timeline-node ${t.kind} ${r === e.termIndex ? "current" : ""} ${r < e.termIndex ? "past" : ""}`,
                  children: [
                    (0, n.jsx)("span", { children: t.label }),
                    (0, n.jsx)("small", {
                      children: "study" === t.kind ? "STUDY" : "coop" === t.kind ? "WORK" : "OFF",
                    }),
                  ],
                },
                t.id,
              ),
            ),
          });
    }
    function tt({
      options: e,
      rotation: t,
      spinning: r,
      busy: a,
      companyMode: i,
      duration: l,
      onSpin: s,
      onBoundaryCrossing: o,
    }) {
      let d = (0, et.useRef)(t),
        c = (0, et.useMemo)(() => ((e, t = !1) => eo(e, t).map((e) => e.centre))(e, i), [e, i]),
        u = (0, et.useMemo)(() => eo(e, i).map((e) => e.start), [e, i]),
        m = (0, et.useMemo)(
          () =>
            !i && e.length > 24
              ? []
              : i
                ? c.length <= 24
                  ? c.map((e, t) => t)
                  : c
                      .map((e, n) => {
                        let r = (((e + t) % 360) + 360) % 360;
                        return { index: n, dist: Math.min(r, 360 - r) };
                      })
                      .sort((e, t) => e.dist - t.dist)
                      .slice(0, 24)
                      .map((e) => e.index)
                      .sort((e, t) => e - t)
                : e.map((e, t) => t),
          [c, i, e, t],
        ),
        h = i && e.length > 32 ? 8 : 1;
      ((0, et.useEffect)(() => {
        r || (d.current = t);
      }, [t, r]),
        (0, et.useEffect)(() => {
          if (!r || 0 === u.length || l <= 0) return;
          let e = d.current,
            n = t - e;
          if (0 === n) return;
          let a = i ? eR : eA,
            s = performance.now(),
            c = 0,
            m = e,
            h = -1 / 0,
            g = (t) => {
              let r,
                i = Math.min(1, (t - s) / l),
                d =
                  e +
                  n *
                    ((e, t) => {
                      let n = Math.max(0, Math.min(1, e));
                      if (0 === n || 1 === n) return n;
                      let r = 0,
                        a = 1,
                        i = n;
                      for (let e = 0; e < 12; e += 1)
                        e7((i = (r + a) / 2), t.x1, t.x2) < n ? (r = i) : (a = i);
                      return e7(i, t.y1, t.y2);
                    })(i, a);
              ((r = m),
                u.reduce(
                  (e, t) => e + Math.max(0, Math.floor((t + d) / 360) - Math.floor((t + r) / 360)),
                  0,
                ) > 0 &&
                  t - h >= eE &&
                  (o(), (h = t)),
                (m = d),
                i < 1 && (c = window.requestAnimationFrame(g)));
            };
          return ((c = window.requestAnimationFrame(g)), () => window.cancelAnimationFrame(c));
        }, [u, i, l, o, t, r]));
      let g = `wheel ${i ? "company-wheel" : ""} ${e.length > 16 ? "dense" : ""} ${r ? "spinning" : ""}`,
        p = {
          "--spin-duration": `${l}ms`,
          "--spin-easing": i ? "cubic-bezier(0.55, 0, 0.45, 1)" : "cubic-bezier(0.12, 0.68, 0.11, 1)",
          background: ((e, t = !1) => {
            let n = eo(e, t);
            if (0 === e.length) return "var(--ink)";
            let r = e.map((e, t) => {
              let r = n[t],
                a = r.start,
                i = r.end,
                l = ew[e.tone ?? (t % 2 ? "ink" : "gold")];
              return `${l} ${a}deg ${i}deg`;
            });
            return `conic-gradient(from 0deg, ${r.join(",")})`;
          })(e, i),
          transform: `rotate(${t}deg)`,
        },
        b = (0, n.jsxs)(n.Fragment, {
          children: [
            (0, n.jsx)("span", { className: "wheel-rim", "aria-hidden": "true" }),
            u.map((e, t) =>
              t % h == 0
                ? (0, n.jsx)(
                    "span",
                    {
                      className: "wheel-separator",
                      style: { transform: `rotate(${e}deg)` },
                      "aria-hidden": "true",
                    },
                    `separator-${t}`,
                  )
                : null,
            ),
            m.map((r) => {
              let a = e[r];
              return (0, n.jsx)(
                "span",
                {
                  className: "wheel-label",
                  "data-side": (((c[r] + t) % 360) + 360) % 360 >= 180 ? "left" : "right",
                  style: {
                    transform: `rotate(${c[r]}deg) translateY(calc(var(--wheel-size) * ${i ? (r % 2 ? -0.44 : -0.46) : -0.34})) rotate(90deg)`,
                  },
                  children: (0, n.jsx)("span", {
                    className: "wheel-label-text",
                    children: a.short ?? a.label,
                  }),
                },
                `${a.id}-${r}`,
              );
            }),
            (0, n.jsx)("span", {
              className: "wheel-hub",
              children: (0, n.jsx)("b", { children: r ? "ROLLING" : "SPIN" }),
            }),
          ],
        });
      return (0, n.jsxs)("div", {
        className: `wheel-zone ${i ? "company-wheel-zone" : ""}`,
        children: [
          (0, n.jsx)("div", { className: "pointer", "aria-hidden": "true" }),
          (0, n.jsx)("div", {
            className: `wheel-frame ${i ? "company-wheel-frame" : ""}`,
            children: i
              ? (0, n.jsx)("div", { className: g, style: p, "aria-hidden": "true", children: b })
              : (0, n.jsx)("button", {
                  className: g,
                  type: "button",
                  onClick: s,
                  disabled: a || 0 === e.length,
                  "aria-label": r ? "Wheel spinning" : a ? "Wheel result pending" : "Spin the wheel",
                  style: p,
                  children: b,
                }),
          }),
          i &&
            (0, n.jsx)("button", {
              type: "button",
              className: "company-wheel-trigger",
              onClick: s,
              disabled: a || 0 === e.length,
              "aria-label": r
                ? "Company wheel spinning"
                : a
                  ? "Company result pending"
                  : "Spin the company wheel",
            }),
        ],
      });
    }
    function tn({ options: e, targetIndex: t, run: r, spinning: a, busy: i, duration: l, onSpin: s }) {
      let o = Math.max(0, (t ?? (e.length > 20 ? e.length + Math.floor(0.75 * e.length) : e.length)) - 1),
        d = Array.from({ length: 8 }, () => e).flat(),
        c = { "--slot-shift": `${-72 * o}px`, "--slot-duration": `${l}ms` };
      return (0, n.jsx)("div", {
        className: "slot-zone",
        children: (0, n.jsxs)("div", {
          className: `slot-cabinet ${a ? "rolling" : ""}`,
          style: c,
          children: [
            (0, n.jsxs)("button", {
              type: "button",
              className: "slot-machine",
              onClick: s,
              disabled: i || 0 === e.length,
              "aria-label": a ? "Slot reel rolling" : i ? "Slot result pending" : "Roll the slot reel",
              children: [
                (0, n.jsx)("span", { className: "slot-marker", "aria-hidden": "true" }),
                (0, n.jsx)("span", {
                  className: "slot-window",
                  children: (0, n.jsx)(
                    "span",
                    {
                      className: `slot-reel ${a ? "rolling" : ""}`,
                      children: d.map((e, t) =>
                        (0, n.jsx)(
                          "span",
                          {
                            className: `slot-row ${e.tone ?? "ink"}`,
                            children: (0, n.jsx)("b", { children: e.label }),
                          },
                          `${t}-${e.id}`,
                        ),
                      ),
                    },
                    r,
                  ),
                }),
              ],
            }),
            (0, n.jsx)("span", {
              className: "slot-crank",
              "aria-hidden": "true",
              children: (0, n.jsx)("span", {
                className: "slot-crank-arm",
                children: (0, n.jsx)("span", { className: "slot-crank-grip" }),
              }),
            }),
          ],
        }),
      });
    }
    function tr({ jobs: e, returnOfferIds: t, onSelect: r }) {
      return (0, n.jsx)("div", {
        className: "offer-picker",
        children: (0, n.jsx)("div", {
          className: "offer-list",
          children: e.map((e) =>
            (0, n.jsxs)(
              "button",
              {
                type: "button",
                onClick: () => r(e.id),
                children: [
                  (0, n.jsx)("span", { className: "offer-company", children: e.company }),
                  (0, n.jsx)("span", { className: "offer-role", children: e.role }),
                  (0, n.jsxs)("span", {
                    className: "offer-meta",
                    children: [
                      t.has(e.id) ? "RETURN OFFER · " : "",
                      e.location,
                      " · ",
                      (0, er.prestigeBandFor)(e.prestige),
                      " · ",
                      eq(e.selectivity),
                      " · ",
                      eY(e.pay),
                    ],
                  }),
                  (0, n.jsx)("b", { children: "ACCEPT" }),
                ],
              },
              e.id,
            ),
          ),
        }),
      });
    }
    function ta({ selectedIds: e, onToggle: t, onSubmit: r }) {
      return (0, n.jsx)("div", {
        className: "application-picker",
        children: (0, n.jsxs)("div", {
          className: "application-form",
          children: [
            (0, n.jsx)("aside", {
              className: "application-rules",
              "aria-label": "Masters application rules",
              children: (0, n.jsxs)("ul", {
                children: [
                  (0, n.jsxs)("li", {
                    children: ["Apply to up to ", ey.MAX_GRAD_APPLICATIONS, " masters programs"],
                  }),
                  (0, n.jsx)("li", { children: "A professor reference improves admit odds" }),
                ],
              }),
            }),
            (0, n.jsxs)("section", {
              className: "program-choice-group",
              "aria-labelledby": "grad-schools-label",
              children: [
                (0, n.jsxs)("h3", {
                  id: "grad-schools-label",
                  children: ["MASTERS (", e.length, "/", ey.MAX_GRAD_APPLICATIONS, ")"],
                }),
                (0, n.jsx)("div", {
                  className: "program-choice-grid math-program-choice-grid",
                  children: ey.GRAD_SCHOOLS.map((r) => {
                    let a = e.includes(r.id),
                      i = !a && e.length >= ey.MAX_GRAD_APPLICATIONS;
                    return (0, n.jsxs)(
                      "button",
                      {
                        type: "button",
                        className: "program-choice",
                        "aria-pressed": a,
                        disabled: i,
                        onClick: () => t(r.id),
                        children: [
                          (0, n.jsx)("b", { children: r.short }),
                          (0, n.jsx)("span", { children: r.name }),
                        ],
                      },
                      r.id,
                    );
                  }),
                }),
              ],
            }),
            (0, n.jsx)("button", {
              type: "button",
              className: "application-submit",
              disabled: !(0, ey.isValidGradApplicationSelection)(e),
              onClick: r,
              children: "SUBMIT APPLICATIONS",
            }),
          ],
        }),
      });
    }
    function ti({ choices: e, onSelect: t }) {
      return (0, n.jsx)("div", {
        className: "offer-picker",
        children: (0, n.jsx)("div", {
          className: "offer-list",
          children: e.map((e) =>
            (0, n.jsxs)(
              "button",
              {
                type: "button",
                onClick: () => t(e.id),
                children: [
                  (0, n.jsx)("span", { className: "offer-company", children: e.title }),
                  (0, n.jsx)("span", { className: "offer-role", children: e.detail }),
                  (0, n.jsx)("span", { className: "offer-meta", children: e.meta }),
                  (0, n.jsx)("b", { children: "CHOOSE" }),
                ],
              },
              e.id,
            ),
          ),
        }),
      });
    }
    function tl({
      mainEngineeringId: e,
      backupEngineeringId: t,
      selectedMathProgramIds: r,
      onChange: a,
      onSubmit: i,
    }) {
      let l = ea.PROGRAMS.filter((e) => "ENG" === e.faculty),
        s = en.SELECTABLE_MATH_APPLICATION_IDS.map((e) => ea.PROGRAMS.find((t) => t.id === e)).filter(
          (e) => void 0 !== e,
        ),
        o = (0, en.applicationCount)(e, r);
      return (0, n.jsx)("div", {
        className: "application-picker",
        children: (0, n.jsxs)("div", {
          className: "application-form",
          children: [
            (0, n.jsx)("aside", {
              className: "application-rules",
              "aria-label": "Application rules",
              children: (0, n.jsxs)("ul", {
                children: [
                  (0, n.jsx)("li", { children: "You can only apply to 3 Waterloo programs" }),
                  (0, n.jsx)("li", { children: "If you apply to engineering, you can select one backup" }),
                ],
              }),
            }),
            (0, n.jsxs)("section", {
              className: "program-choice-group",
              "aria-labelledby": "main-engineering-label",
              children: [
                (0, n.jsx)("h3", { id: "main-engineering-label", children: "ENGINEERING" }),
                (0, n.jsx)("div", {
                  className: "program-choice-grid",
                  children: l.map((r) =>
                    (0, n.jsxs)(
                      "button",
                      {
                        type: "button",
                        className: "program-choice",
                        "aria-pressed": r.id === e,
                        onClick: () => a("main", r.id),
                        disabled: r.id === t || (!e && o >= en.MAX_WATERLOO_APPLICATIONS),
                        children: [
                          (0, n.jsx)("b", { children: r.short }),
                          (0, n.jsx)("span", { children: r.name.replace(/ Engineering$/, "") }),
                        ],
                      },
                      r.id,
                    ),
                  ),
                }),
              ],
            }),
            (0, n.jsxs)("section", {
              className: "program-choice-group",
              "aria-labelledby": "backup-engineering-label",
              children: [
                (0, n.jsx)("h3", { id: "backup-engineering-label", children: "BACKUP ENGINEERING" }),
                (0, n.jsx)("div", {
                  className: "program-choice-grid",
                  children: l.map((r) =>
                    (0, n.jsxs)(
                      "button",
                      {
                        type: "button",
                        className: "program-choice",
                        "aria-pressed": r.id === t,
                        onClick: () => a("backup", r.id),
                        disabled: !e || r.id === e,
                        children: [
                          (0, n.jsx)("b", { children: r.short }),
                          (0, n.jsx)("span", { children: r.name.replace(/ Engineering$/, "") }),
                        ],
                      },
                      r.id,
                    ),
                  ),
                }),
              ],
            }),
            (0, n.jsxs)("section", {
              className: "program-choice-group math-application-group",
              "aria-labelledby": "math-programs-label",
              children: [
                (0, n.jsx)("h3", { id: "math-programs-label", children: "MATHEMATICS" }),
                (0, n.jsx)("div", {
                  className: "program-choice-grid math-program-choice-grid",
                  children: s.map((e) => {
                    let t = r.includes(e.id);
                    return (0, n.jsxs)(
                      "button",
                      {
                        type: "button",
                        className: "program-choice",
                        "aria-pressed": t,
                        onClick: () => a("math", e.id),
                        disabled: !t && o >= en.MAX_WATERLOO_APPLICATIONS,
                        children: [
                          (0, n.jsx)("b", { children: e.short }),
                          (0, n.jsx)("span", { children: e.name }),
                        ],
                      },
                      e.id,
                    );
                  }),
                }),
              ],
            }),
            (0, n.jsx)("button", {
              type: "button",
              className: "application-submit",
              onClick: i,
              disabled: !(0, en.isValidApplicationSelection)(e, t, r),
              children: "SUBMIT APPLICATIONS",
            }),
          ],
        }),
      });
    }
    function ts({ programs: e, results: t, onSelect: r }) {
      return (0, n.jsxs)("div", {
        className: "offer-picker program-picker",
        children: [
          (0, n.jsx)("div", {
            className: "admission-results",
            "aria-label": "Admission results",
            children: t
              .filter((e) => "fallback" !== e.source)
              .map((e) => {
                let t = ea.PROGRAMS.find((t) => t.id === e.programId);
                return (0, n.jsxs)(
                  "span",
                  {
                    className: "offer" === e.outcome ? "accepted" : "rejected",
                    children: [t?.short, " · ", "offer" === e.outcome ? "OFFER" : "NO OFFER"],
                  },
                  e.programId,
                );
              }),
          }),
          (0, n.jsx)("div", {
            className: "offer-list program-offer-list",
            children: e.map((e) =>
              (0, n.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => r(e.id),
                  children: [
                    (0, n.jsx)("span", { className: "offer-company", children: e.name }),
                    (0, n.jsx)("span", { className: "offer-role", children: e.faculty }),
                    (0, n.jsx)("b", { children: "ACCEPT" }),
                  ],
                },
                e.id,
              ),
            ),
          }),
        ],
      });
    }
    function to({ value: e }) {
      let t = (0, et.useRef)(null),
        r = (0, et.useRef)(e);
      return (
        (0, et.useEffect)(() => {
          let n = t.current,
            a = e > r.current ? "up" : e < r.current ? "down" : null;
          if (((r.current = e), !n || !a)) return;
          let i = `metric-change-${a}`;
          (n.classList.remove("metric-change-up", "metric-change-down"),
            n.getBoundingClientRect(),
            n.classList.add(i));
          let l = () => n.classList.remove(i);
          return (
            n.addEventListener("animationend", l, { once: !0 }),
            () => {
              (n.removeEventListener("animationend", l), n.classList.remove(i));
            }
          );
        }, [e]),
        (0, n.jsx)("b", {
          className: "animated-metric",
          children: (0, n.jsx)("span", { ref: t, className: "metric-change", children: eX(e) }),
        })
      );
    }
    function td({ value: e, x: t }) {
      let r = (0, et.useRef)(null),
        a = (0, et.useRef)(e);
      return (
        (0, et.useEffect)(() => {
          let t = r.current,
            n = e > a.current ? "up" : e < a.current ? "down" : null;
          if (((a.current = e), !t || !n)) return;
          let i = `metric-change-${n}`;
          (t.classList.remove("metric-change-up", "metric-change-down"),
            t.getBoundingClientRect(),
            t.classList.add(i));
          let l = () => t.classList.remove(i);
          return (
            t.addEventListener("animationend", l, { once: !0 }),
            () => {
              (t.removeEventListener("animationend", l), t.classList.remove(i));
            }
          );
        }, [e]),
        (0, n.jsx)("tspan", { ref: r, className: "radar-axis-value", x: t, dy: "9", children: Math.round(e) })
      );
    }
    function tc({ rizz: e }) {
      let t = (e, t) => {
          let n = (2 * Math.PI * e) / ea.AXES.length - Math.PI / 2;
          return [110 + 72 * Math.cos(n) * t, 110 + 72 * Math.sin(n) * t];
        },
        r = ea.AXES.map((n, r) => t(r, Math.min(100, e[n]) / 100).join(",")).join(" ");
      return (0, n.jsx)("div", {
        className: "radar-shell",
        children: (0, n.jsxs)("svg", {
          className: "radar",
          viewBox: "0 0 220 220",
          role: "img",
          "aria-label": `Role fit: ${ea.AXES.map((t) => `${ea.AXIS_LABELS[t]} ${Math.round(e[t])}`).join(", ")}`,
          children: [
            [0.25, 0.5, 0.75, 1].map((e) =>
              (0, n.jsx)(
                "polygon",
                { className: "radar-ring", points: ea.AXES.map((n, r) => t(r, e).join(",")).join(" ") },
                e,
              ),
            ),
            ea.AXES.map((e, r) => {
              let [a, i] = t(r, 1);
              return (0, n.jsx)("line", { x1: 110, y1: 110, x2: a, y2: i }, e);
            }),
            (0, n.jsx)("polygon", { className: "radar-value", points: r }),
            ea.AXES.map((r, a) => {
              let [i, l] = t(a, 1.28),
                s = i < 106 ? "end" : i > 114 ? "start" : "middle";
              return (0, n.jsxs)(
                "text",
                {
                  className: "radar-axis-label",
                  x: i,
                  y: l,
                  textAnchor: s,
                  children: [ea.AXIS_LABELS[r], (0, n.jsx)(td, { value: e[r], x: i })],
                },
                r,
              );
            }),
          ],
        }),
      });
    }
    function tu({ state: e }) {
      let t = e.teams.filter((e) => e.active),
        r = [...e.jobs]
          .filter((e) => e.job)
          .sort((e, t) => (t.job?.prestige ?? 0) - (e.job?.prestige ?? 0))[0];
      return (0, n.jsxs)("aside", {
        className: "dossier",
        children: [
          (0, n.jsxs)("div", {
            className: "dossier-head",
            children: [
              (0, n.jsxs)("div", {
                children: [
                  (0, n.jsx)("h2", { children: e.program?.short ?? "—" }),
                  (0, n.jsx)("p", { children: e.major ?? e.program?.name ?? "No program" }),
                ],
              }),
              (0, n.jsx)("div", { className: "id-stamp", children: e.sequenceName ?? "—" }),
            ],
          }),
          (0, n.jsx)(tc, { rizz: e.rizz }),
          (0, n.jsxs)("div", {
            className: "stat-grid",
            children: [
              (0, n.jsxs)("div", {
                children: [
                  (0, n.jsx)("span", { children: e.studyTerms ? "AVERAGE" : "HS AVERAGE" }),
                  (0, n.jsx)("b", {
                    children: e.studyTerms
                      ? `${Math.round(e.average)}%`
                      : e.highSchoolAverage
                        ? `${e.highSchoolAverage}%`
                        : "—",
                  }),
                ],
              }),
              (0, n.jsxs)("div", {
                children: [
                  (0, n.jsx)("span", { children: "INTEGRITY" }),
                  (0, n.jsxs)("b", {
                    className:
                      e.integrity <= 0
                        ? "integrity-danger"
                        : 1 === e.integrity
                          ? "integrity-warning"
                          : "integrity-safe",
                    children: [e.integrity, "/", 2],
                  }),
                ],
              }),
              (0, n.jsxs)("div", {
                children: [(0, n.jsx)("span", { children: "SAVINGS" }), (0, n.jsx)(to, { value: e.savings })],
              }),
              (0, n.jsxs)("div", {
                children: [
                  (0, n.jsx)("span", { children: "CO-OPS" }),
                  (0, n.jsx)("b", { children: e.jobs.length }),
                ],
              }),
            ],
          }),
          (t[0] || r?.job) &&
            (0, n.jsxs)("section", {
              className: "compact-records",
              children: [
                t[0] &&
                  (0, n.jsxs)("div", {
                    children: [
                      (0, n.jsx)("span", { children: "TEAM" }),
                      (0, n.jsx)("b", { children: t[0].name }),
                      (0, n.jsx)("small", { children: ea.RANKS[t[0].rank] }),
                    ],
                  }),
                r?.job &&
                  (0, n.jsxs)("div", {
                    children: [
                      (0, n.jsxs)("span", {
                        children: ["BEST CO-OP · ", (0, er.prestigeBandFor)(r.job.prestige)],
                      }),
                      (0, n.jsx)("b", { children: r.job.company }),
                      (0, n.jsxs)("small", { children: [r.job.role, " · ", r.job.location] }),
                    ],
                  }),
              ],
            }),
        ],
      });
    }
    function tm({ state: e, onRestart: t, onViewStatistics: r, onViewLeaderboard: a }) {
      let i,
        l =
          ((i = e.jobs.flatMap((e) => (e.job ? [e.job.location] : []))),
          [
            {
              label: "Made it into Cali",
              achieved: "yc" === e.endingCode || i.some((e) => e.endsWith(", CA")),
            },
            { label: "Made it to NYC", achieved: i.includes("New York, NY") },
            {
              label: "Made it outta the GTA",
              achieved:
                "yc" === e.endingCode ||
                !!e.exchange.universityId ||
                i.some((e) => (0, er.isOutsideGtaAndLoo)(e)),
            },
            { label: "Masters admit", achieved: !!e.endingCode?.startsWith("grad:") },
            { label: "Return full-time", achieved: !!e.endingCode?.startsWith("return:") },
            { label: "Graduated", achieved: "graduated" === e.status },
          ]),
        s = (0, eb.scholarshipOutcome)(e.scholarshipId ?? "none"),
        o = (0, et.useRef)(null),
        [d, c] = (0, et.useState)(!1),
        u = async () => {
          let t = o.current;
          if (t && !d) {
            c(!0);
            try {
              let n = await ee(t, {
                cacheBust: !0,
                pixelRatio: Math.min(2, window.devicePixelRatio || 2),
                backgroundColor: "#1d1d19",
              });
              if (!n) return;
              let r = new File([n], "waterloo-roulette-result.png", { type: "image/png" }),
                a = `Waterloo Roulette — ${e.ending} \xb7 ${eX(e.savings)}`;
              if (navigator.canShare?.({ files: [r] }))
                return void (await navigator.share({ files: [r], title: "Waterloo Roulette", text: a }));
              if (navigator.share)
                return void (await navigator.share({
                  title: "Waterloo Roulette",
                  text: a,
                  url: window.location.href,
                }));
              let i = URL.createObjectURL(n),
                l = document.createElement("a");
              ((l.href = i), (l.download = r.name), l.click(), URL.revokeObjectURL(i));
            } catch (e) {
              if (e instanceof DOMException && "AbortError" === e.name) return;
            } finally {
              c(!1);
            }
          }
        };
      return (0, n.jsxs)("div", {
        className: "summary-card",
        children: [
          (0, n.jsxs)("div", {
            ref: o,
            className: "summary-share-target",
            children: [
              (0, n.jsx)("span", { className: "summary-stamp", children: e.status.toUpperCase() }),
              (0, n.jsx)("h1", { children: e.ending }),
              (0, n.jsxs)("p", {
                className: "summary-lede",
                children: [
                  e.program?.name,
                  " · ",
                  e.major ? `${e.major} \xb7 ` : "",
                  e.sequenceName,
                  e.exchange.universityId
                    ? ` \xb7 Exchange: ${ef.EXCHANGE_UNIVERSITIES.find((t) => t.id === e.exchange.universityId)?.short ?? "ABROAD"}`
                    : "",
                ],
              }),
              (0, n.jsxs)("div", {
                className: "summary-grid",
                children: [
                  (0, n.jsxs)("div", {
                    children: [
                      (0, n.jsx)("span", { children: "FINAL CAV" }),
                      (0, n.jsxs)("b", { children: [Math.round(e.average), "%"] }),
                    ],
                  }),
                  (0, n.jsxs)("div", {
                    className: "summary-savings",
                    children: [
                      (0, n.jsx)("span", { children: "FINAL SAVINGS" }),
                      (0, n.jsx)("b", { children: eX(e.savings) }),
                      "yc" === e.endingCode
                        ? (0, n.jsxs)("small", {
                            className: "yc-seed-bonus",
                            children: ["+", ep.YC_SEED_FUNDING.toLocaleString(), "$ Seed"],
                          })
                        : null,
                    ],
                  }),
                  (0, n.jsxs)("div", {
                    children: [
                      (0, n.jsx)("span", { children: "WORK TERMS" }),
                      (0, n.jsx)("b", { children: e.jobs.length }),
                    ],
                  }),
                  (0, n.jsxs)("div", {
                    children: [
                      (0, n.jsx)("span", { children: "INTEGRITY POINTS" }),
                      (0, n.jsxs)("b", {
                        className:
                          e.integrity <= 0
                            ? "integrity-danger"
                            : 1 === e.integrity
                              ? "integrity-warning"
                              : "integrity-safe",
                        children: [e.integrity, "/", 2],
                      }),
                    ],
                  }),
                  (0, n.jsxs)("div", {
                    className: "summary-scholarship",
                    children: [
                      (0, n.jsx)("span", { children: "SCHOLARSHIP" }),
                      (0, n.jsxs)("b", {
                        title: s.label,
                        children: [s.label, s.savings > 0 ? ` \xb7 ${eX(s.savings)}` : ""],
                      }),
                    ],
                  }),
                ],
              }),
              (0, n.jsx)("div", {
                className: "summary-achievements",
                role: "list",
                "aria-label": "Run achievements",
                children: l.map((e) =>
                  (0, n.jsxs)(
                    "div",
                    {
                      className: `achievement-check ${e.achieved ? "checked" : ""}`,
                      role: "checkbox",
                      "aria-checked": e.achieved,
                      "aria-readonly": "true",
                      children: [
                        (0, n.jsx)("span", { "aria-hidden": "true", children: e.achieved ? "✓" : "" }),
                        (0, n.jsx)("b", { children: e.label }),
                      ],
                    },
                    e.label,
                  ),
                ),
              }),
              (0, n.jsxs)("div", {
                className: "summary-jobs",
                children: [
                  e.jobs
                    .slice(-6)
                    .map((e, t) =>
                      (0, n.jsxs)(
                        "div",
                        {
                          children: [
                            (0, n.jsx)("span", { children: e.term }),
                            (0, n.jsx)("b", { children: e.job?.company ?? e.evaluation }),
                            (0, n.jsxs)("small", {
                              children: [
                                e.job
                                  ? `${e.job.role} \xb7 ${e.job.location}`
                                  : "Alternate work-term outcome",
                                " · ",
                                e.evaluation,
                              ],
                            }),
                          ],
                        },
                        `${e.term}-${t}`,
                      ),
                    ),
                  "survival-job" === e.endingCode
                    ? (0, n.jsxs)("div", {
                        children: [
                          (0, n.jsx)("span", { children: "FT" }),
                          (0, n.jsx)("b", { children: "McDonald's" }),
                          (0, n.jsx)("small", { children: "McDonald's crew member" }),
                        ],
                      })
                    : null,
                ],
              }),
              (0, n.jsx)("p", { className: "summary-share-brand", children: "Waterloo Roulette" }),
            ],
          }),
          (0, n.jsxs)("div", {
            className: "summary-actions",
            children: [
              (0, n.jsx)("button", {
                type: "button",
                className: "share-button",
                onClick: () => void u(),
                disabled: d,
                children: d ? "SHARING…" : "SHARE RESULT",
              }),
              (0, n.jsx)("button", {
                type: "button",
                className: "restart-large",
                onClick: t,
                children: "NEW RUN",
              }),
              (0, n.jsx)("button", {
                type: "button",
                className: "statistics-button",
                onClick: r,
                children: "VIEW OUTCOME STATISTICS",
              }),
              (0, n.jsx)("button", {
                type: "button",
                className: "leaderboard-button",
                onClick: a,
                children: "LEADERBOARD",
              }),
            ],
          }),
        ],
      });
    }
    function th({ scene: e, onContinue: t }) {
      return (0, n.jsx)("div", {
        className: "narration-backdrop",
        children: (0, n.jsxs)("section", {
          className: "narration-window",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": `narration-title-${e.id}`,
          children: [
            (0, n.jsx)("span", { className: "narration-speaker", children: "ME" }),
            (0, n.jsx)("h2", { id: `narration-title-${e.id}`, children: e.title }),
            (0, n.jsx)("div", {
              className: "narration-copy",
              children: e.lines.map((e) => (0, n.jsx)("p", { children: e }, e)),
            }),
            (0, n.jsxs)("button", {
              type: "button",
              autoFocus: !0,
              onClick: t,
              children: [e.continueLabel, " →"],
            }),
          ],
        }),
      });
    }
    function tg({ onContinue: e }) {
      return (0, n.jsx)("div", {
        className: "bank-notice-backdrop",
        children: (0, n.jsxs)("section", {
          className: "bank-notice",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Bank borrowing limit",
          children: [
            (0, n.jsx)("p", {
              children:
                "I’m below the bank’s borrowing limit, so they won’t lend me any more money and I have to work this term.",
            }),
            (0, n.jsx)("button", { type: "button", autoFocus: !0, onClick: e, children: "OK" }),
          ],
        }),
      });
    }
    function tp({ onContinue: e }) {
      return (0, n.jsx)("div", {
        className: "bank-notice-backdrop",
        children: (0, n.jsxs)("section", {
          className: "bank-notice",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Complete a run first",
          children: [
            (0, n.jsx)("p", {
              children:
                "Complete a run first to see the leaderboard and simulate outcome statistics with Monte Carlo.",
            }),
            (0, n.jsx)("button", { type: "button", autoFocus: !0, onClick: e, children: "OK" }),
          ],
        }),
      });
    }
    function tb({
      report: e,
      error: t,
      runs: r,
      running: a,
      progress: i,
      onRunsChange: l,
      onRun: s,
      onClose: o,
    }) {
      let d = e
          ? [
              ["Academic expulsion", e.outcomes.academicExpulsion],
              ["Integrity expulsion", e.outcomes.integrityExpulsion],
              ["YC ending", e.outcomes.yc],
              ["Masters ending", e.outcomes.gradSchool],
              ["Return full-time", e.outcomes.returnFullTime],
              ["Open to work", e.outcomes.openToWork],
              ["Made it outta the GTA", e.outcomes.madeItOuttaTheGta],
              ["Made it to NYC", e.outcomes.madeItToNyc],
              ["Made it into Cali", e.outcomes.madeItIntoCali],
              ["Graduated", e.outcomes.graduated],
              ["Got run over", e.outcomes.runOver],
              ["Full-time dropout", e.outcomes.fullTimeDropout],
              ["Exchange eligible", e.outcomes.exchangeEligible],
              ["Went on exchange", e.outcomes.wentOnExchange],
              ["Lost forever abroad", e.outcomes.lostForever],
            ]
          : [],
        c = a && r > 1e3,
        u = Math.round(100 * (c ? Math.min(1, (i?.completed ?? 0) / Math.max(1, i?.total ?? r)) : 0));
      return (0, n.jsx)("div", {
        className: "simulation-backdrop",
        role: "presentation",
        children: (0, n.jsxs)("section", {
          className: "simulation-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "simulation-title",
          children: [
            (0, n.jsxs)("header", {
              children: [
                (0, n.jsxs)("div", {
                  children: [
                    (0, n.jsx)("span", { children: e ? `${e.runs.toLocaleString()} RUNS` : "MONTE CARLO" }),
                    (0, n.jsx)("h2", { id: "simulation-title", children: "Ending probabilities" }),
                  ],
                }),
                (0, n.jsx)("button", {
                  type: "button",
                  onClick: o,
                  "aria-label": "Close simulation results",
                  children: "×",
                }),
              ],
            }),
            (0, n.jsxs)("div", {
              className: "simulation-controls",
              children: [
                (0, n.jsxs)("label", {
                  htmlFor: "simulation-runs",
                  children: [
                    (0, n.jsx)("span", { children: "RUNS" }),
                    (0, n.jsx)("b", { children: r.toLocaleString() }),
                  ],
                }),
                (0, n.jsx)("input", {
                  id: "simulation-runs",
                  type: "range",
                  min: "100",
                  max: "10000",
                  step: "100",
                  value: r,
                  disabled: a,
                  onChange: (e) => l(Number(e.target.value)),
                }),
                (0, n.jsx)("button", {
                  type: "button",
                  onClick: s,
                  disabled: a,
                  children: a ? "RUNNING" : "RUN SIMULATION",
                }),
              ],
            }),
            t
              ? (0, n.jsx)("p", { className: "simulation-error", children: t })
              : a
                ? (0, n.jsxs)("div", {
                    className: "simulation-pending",
                    children: [
                      (0, n.jsxs)("b", { children: ["SIMULATING ", r.toLocaleString(), " RUNS…"] }),
                      c
                        ? (0, n.jsxs)("div", {
                            className: "simulation-progress",
                            role: "progressbar",
                            "aria-valuemin": 0,
                            "aria-valuemax": 100,
                            "aria-valuenow": u,
                            "aria-label": "Simulation progress",
                            children: [
                              (0, n.jsx)("div", {
                                className: "simulation-progress-track",
                                children: (0, n.jsx)("div", {
                                  className: "simulation-progress-fill",
                                  style: { width: `${u}%` },
                                }),
                              }),
                              (0, n.jsxs)("span", {
                                children: [
                                  (i?.completed ?? 0).toLocaleString(),
                                  " /",
                                  " ",
                                  (i?.total ?? r).toLocaleString(),
                                ],
                              }),
                            ],
                          })
                        : null,
                    ],
                  })
                : e
                  ? (0, n.jsxs)("div", {
                      className: "simulation-results",
                      children: [
                        (0, n.jsxs)("div", {
                          className: "simulation-summary",
                          children: [
                            (0, n.jsxs)("section", {
                              children: [
                                (0, n.jsx)("span", { children: "SAVINGS" }),
                                (0, n.jsxs)("dl", {
                                  children: [
                                    (0, n.jsxs)("div", {
                                      children: [
                                        (0, n.jsx)("dt", { children: "Average" }),
                                        (0, n.jsx)("dd", { children: eX(e.savings.average) }),
                                      ],
                                    }),
                                    (0, n.jsxs)("div", {
                                      children: [
                                        (0, n.jsx)("dt", { children: "Median" }),
                                        (0, n.jsx)("dd", { children: eX(e.savings.median) }),
                                      ],
                                    }),
                                    (0, n.jsxs)("div", {
                                      children: [
                                        (0, n.jsx)("dt", { children: "Maximum" }),
                                        (0, n.jsx)("dd", { children: eX(e.savings.maximum) }),
                                      ],
                                    }),
                                    (0, n.jsxs)("div", {
                                      children: [
                                        (0, n.jsx)("dt", { children: "Minimum" }),
                                        (0, n.jsx)("dd", { children: eX(e.savings.minimum) }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            (0, n.jsxs)("section", {
                              children: [
                                (0, n.jsx)("span", { children: "DESIGN-TEAM POINTS" }),
                                (0, n.jsxs)("dl", {
                                  children: [
                                    (0, n.jsxs)("div", {
                                      children: [
                                        (0, n.jsx)("dt", { children: "Average" }),
                                        (0, n.jsx)("dd", { children: e.designTeamPoints.average.toFixed(2) }),
                                      ],
                                    }),
                                    (0, n.jsxs)("div", {
                                      children: [
                                        (0, n.jsx)("dt", { children: "Median" }),
                                        (0, n.jsx)("dd", { children: e.designTeamPoints.median.toFixed(1) }),
                                      ],
                                    }),
                                    (0, n.jsxs)("div", {
                                      children: [
                                        (0, n.jsx)("dt", { children: "Maximum" }),
                                        (0, n.jsx)("dd", { children: e.designTeamPoints.maximum }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, n.jsx)("div", {
                          className: "simulation-outcomes",
                          children: d.map(([e, t]) =>
                            (0, n.jsxs)(
                              "div",
                              {
                                children: [
                                  (0, n.jsx)("span", { children: e }),
                                  (0, n.jsxs)("b", { children: [t.toFixed(2), "%"] }),
                                ],
                              },
                              e,
                            ),
                          ),
                        }),
                        (0, n.jsxs)("section", {
                          className: "simulation-scholarships",
                          children: [
                            (0, n.jsx)("span", { children: "SCHOLARSHIP DISTRIBUTION" }),
                            (0, n.jsx)("div", {
                              children: e.scholarshipDistribution.map((e) =>
                                (0, n.jsxs)(
                                  "p",
                                  {
                                    children: [
                                      (0, n.jsx)("span", { children: e.label }),
                                      (0, n.jsxs)("b", {
                                        children: [
                                          e.percentage.toFixed(2),
                                          "%",
                                          (0, n.jsx)("small", { children: e.count.toLocaleString() }),
                                        ],
                                      }),
                                    ],
                                  },
                                  e.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                        (0, n.jsxs)("div", {
                          className: "simulation-breakdowns",
                          children: [
                            (0, n.jsxs)("section", {
                              children: [
                                (0, n.jsx)("span", { children: "PROGRAM DISTRIBUTION" }),
                                (0, n.jsx)("div", {
                                  children: e.programDistribution.map((e) =>
                                    (0, n.jsxs)(
                                      "p",
                                      {
                                        children: [
                                          (0, n.jsx)("span", { children: e.label }),
                                          (0, n.jsxs)("b", { children: [e.percentage.toFixed(1), "%"] }),
                                        ],
                                      },
                                      e.id,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                            (0, n.jsxs)("section", {
                              children: [
                                (0, n.jsx)("span", { children: "AVERAGE WAGE BY CO-OP" }),
                                (0, n.jsx)("div", {
                                  className: "simulation-coops",
                                  children: e.coopWages.map((e) =>
                                    (0, n.jsxs)(
                                      "details",
                                      {
                                        children: [
                                          (0, n.jsxs)("summary", {
                                            children: [
                                              (0, n.jsxs)("span", { children: ["C", e.coop] }),
                                              (0, n.jsx)("b", { children: eY(e.averageHourlyPay) }),
                                              (0, n.jsxs)("small", {
                                                children: [e.placementRate.toFixed(0), "% placed"],
                                              }),
                                            ],
                                          }),
                                          (0, n.jsx)("div", {
                                            className: "simulation-locations",
                                            children: e.locations.length
                                              ? e.locations.map((e) =>
                                                  (0, n.jsxs)(
                                                    "p",
                                                    {
                                                      children: [
                                                        (0, n.jsx)("span", { children: e.location }),
                                                        (0, n.jsxs)("b", {
                                                          children: [e.percentage.toFixed(1), "%"],
                                                        }),
                                                      ],
                                                    },
                                                    e.location,
                                                  ),
                                                )
                                              : (0, n.jsxs)("p", {
                                                  children: [
                                                    (0, n.jsx)("span", { children: "No placements" }),
                                                    (0, n.jsx)("b", { children: "—" }),
                                                  ],
                                                }),
                                          }),
                                        ],
                                      },
                                      e.coop,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  : null,
          ],
        }),
      });
    }
    function tf({ report: e, error: t, loading: r, onClose: a }) {
      let i, l, s;
      return (0, n.jsx)("div", {
        className: "simulation-backdrop",
        role: "presentation",
        children: (0, n.jsxs)("section", {
          className: "leaderboard-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "leaderboard-title",
          children: [
            (0, n.jsxs)("header", {
              children: [
                (0, n.jsxs)("div", {
                  children: [
                    (0, n.jsx)("span", { children: e?.city ?? "GLOBAL" }),
                    (0, n.jsx)("h2", { id: "leaderboard-title", children: "Leaderboard" }),
                  ],
                }),
                (0, n.jsx)("button", {
                  type: "button",
                  onClick: a,
                  "aria-label": "Close leaderboard",
                  children: "×",
                }),
              ],
            }),
            r
              ? (0, n.jsx)("div", { className: "leaderboard-status", children: "LOADING" })
              : t
                ? (0, n.jsx)("div", { className: "leaderboard-status", children: t })
                : e
                  ? (0, n.jsxs)("div", {
                      className: "leaderboard-content",
                      children: [
                        (0, n.jsxs)("div", {
                          className: "leaderboard-summary",
                          children: [
                            (0, n.jsxs)("div", {
                              children: [
                                (0, n.jsx)("span", { children: "YOUR RUNS" }),
                                (0, n.jsx)("b", { children: e.user.runs }),
                              ],
                            }),
                            (0, n.jsxs)("div", {
                              children: [
                                (0, n.jsx)("span", { children: "YOUR BEST SAVINGS" }),
                                (0, n.jsx)("b", { children: eX(e.user.bestSavings) }),
                              ],
                            }),
                            (0, n.jsxs)("div", {
                              children: [
                                (0, n.jsx)("span", { children: "YOUR BEST JOB RIZZ" }),
                                (0, n.jsx)("b", { children: e.user.bestRizz.toFixed(1) }),
                              ],
                            }),
                            (0, n.jsxs)("div", {
                              children: [
                                (0, n.jsx)("span", { children: e.city.toUpperCase() }),
                                (0, n.jsxs)("b", { children: [e.cityStats.users, " players"] }),
                                (0, n.jsxs)("small", { children: [e.cityStats.runs, " runs"] }),
                              ],
                            }),
                          ],
                        }),
                        e.user.bestRun?.items.length
                          ? (0, n.jsxs)("section", {
                              className: "leaderboard-money-ledger",
                              children: [
                                (0, n.jsxs)("header", {
                                  children: [
                                    (0, n.jsxs)("div", {
                                      children: [
                                        (0, n.jsx)("span", { children: "YOUR HIGHEST-SAVINGS RUN" }),
                                        (0, n.jsxs)("small", { children: ["SEED ", e.user.bestRun.runId] }),
                                      ],
                                    }),
                                    (0, n.jsx)("b", { children: eX(e.user.bestRun.savings) }),
                                  ],
                                }),
                                (0, n.jsx)("ol", {
                                  children: e.user.bestRun.items.map((e, t) => {
                                    let r;
                                    return (0, n.jsxs)(
                                      "li",
                                      {
                                        children: [
                                          (0, n.jsx)("span", { children: e.term }),
                                          (0, n.jsxs)("p", {
                                            children: [
                                              (0, n.jsx)("b", { children: e.label }),
                                              (0, n.jsxs)("small", { children: ["Balance ", eX(e.balance)] }),
                                            ],
                                          }),
                                          (0, n.jsx)("strong", {
                                            className: e.amount > 0 ? "positive" : "negative",
                                            children: ((r = e.amount), `${r > 0 ? "+" : ""}${eX(r)}`),
                                          }),
                                        ],
                                      },
                                      `${e.term}-${e.label}-${t}`,
                                    );
                                  }),
                                }),
                              ],
                            })
                          : null,
                        (0, n.jsxs)("div", {
                          className: "leaderboard-columns",
                          children: [
                            (0, n.jsx)(ty, {
                              title: "CITIES BY RUNS",
                              rows: e.cities.map((e) => ({
                                label: e.city,
                                detail: "",
                                value: e.runs.toLocaleString(),
                              })),
                            }),
                            (0, n.jsx)(ty, {
                              title: "HIGHEST SAVINGS",
                              rows: e.topSavings.map((e) => ({
                                label: e.player,
                                detail: e.city,
                                value: eX(e.score),
                              })),
                            }),
                            (0, n.jsx)(ty, {
                              title: "HIGHEST TOTAL JOB RIZZ",
                              rows: e.topRizz.map((e) => ({
                                label: e.player,
                                detail: e.city,
                                value: e.score.toFixed(1),
                              })),
                            }),
                          ],
                        }),
                        (0, n.jsxs)("footer", {
                          children: [
                            (0, n.jsxs)("strong", {
                              children: [
                                ((l = Math.floor(
                                  (i = Math.max(0, Math.floor(e.totals.playtimeSeconds / 60))) / 60,
                                )),
                                (s = i % 60),
                                `${l.toLocaleString()} ${1 === l ? "hour" : "hours"} ${s} ${1 === s ? "minute" : "minutes"}`),
                                " ",
                                "that could've been spent applying to real jobs",
                              ],
                            }),
                            (0, n.jsxs)("span", {
                              children: [
                                e.totals.users.toLocaleString(),
                                " players ·",
                                " ",
                                e.totals.runs.toLocaleString(),
                                " runs ·",
                                " ",
                                e.totals.escapedPlayers.toLocaleString(),
                                " escaped the Loo ·",
                                " ",
                                e.totals.coopJobs.toLocaleString(),
                                " co-op jobs",
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  : null,
          ],
        }),
      });
    }
    function ty({ title: e, rows: t }) {
      return (0, n.jsxs)("section", {
        children: [
          (0, n.jsx)("span", { children: e }),
          (0, n.jsx)("ol", {
            children: t
              .slice(0, 8)
              .map((e, t) =>
                (0, n.jsxs)(
                  "li",
                  {
                    children: [
                      (0, n.jsx)("i", { children: t + 1 }),
                      (0, n.jsxs)("p", {
                        children: [
                          (0, n.jsx)("b", { children: e.label }),
                          e.detail ? (0, n.jsx)("small", { children: e.detail }) : null,
                        ],
                      }),
                      (0, n.jsx)("strong", { children: e.value }),
                    ],
                  },
                  `${e.label}-${t}`,
                ),
              ),
          }),
        ],
      });
    }
    e.s(
      [
        "default",
        0,
        function () {
          let t,
            [r, a] = (0, et.useState)(() => ek("campus-preview")),
            [i, l] = (0, et.useState)(!1),
            [s, o] = (0, et.useState)(!1),
            [d, c] = (0, et.useState)(!1),
            [u, m] = (0, et.useState)(0),
            [h, g] = (0, et.useState)(null),
            [p, b] = (0, et.useState)([]),
            [f, y] = (0, et.useState)(!1),
            [x, v] = (0, et.useState)(!1),
            [w, j] = (0, et.useState)(!1),
            E = (0, et.useRef)(null),
            S = (0, et.useRef)(null),
            N = (0, et.useRef)(null),
            A = (0, et.useRef)(null),
            R = (0, et.useRef)(null),
            I = (0, et.useRef)(null),
            T = (0, et.useRef)([]),
            C = (0, et.useRef)(null),
            k = (0, et.useRef)(!1),
            M = (0, et.useRef)(null),
            O = (0, et.useRef)(null),
            z = (0, et.useRef)(null),
            $ = (0, et.useRef)(null),
            P = (0, et.useRef)(null),
            [L, D] = (0, et.useState)(!1),
            [F, G] = (0, et.useState)(null),
            [U, _] = (0, et.useState)(null),
            [W, H] = (0, et.useState)(2e3),
            [B, V] = (0, et.useState)(!1),
            [J, X] = (0, et.useState)(null),
            [Y, q] = (0, et.useState)(!1),
            [K, Q] = (0, et.useState)(null),
            [Z, ee] = (0, et.useState)(null),
            [ev, ew] = (0, et.useState)(!1),
            eE = (0, et.useCallback)(async () => {
              let e = S.current;
              if (!e) return !1;
              let t = A.current;
              (t &&
                (window.removeEventListener("pointerdown", t),
                window.removeEventListener("keydown", t),
                (A.current = null)),
                null !== N.current && (window.cancelAnimationFrame(N.current), (N.current = null)),
                e.pause(),
                (e.currentTime = 0),
                (e.volume = 1));
              try {
                await e.play();
              } catch {
                return !1;
              }
              let n = () => {
                let t = Number.isFinite(e.duration) && e.duration > 0 ? e.duration : 0;
                if ((t > 0 && (e.volume = Math.max(0, 1 - e.currentTime / t)), e.ended || e.paused)) {
                  ((e.volume = 0), (N.current = null));
                  return;
                }
                N.current = window.requestAnimationFrame(n);
              };
              return ((N.current = window.requestAnimationFrame(n)), !0);
            }, []),
            eA = (0, et.useCallback)(async () => {
              let e = window.AudioContext || window.webkitAudioContext;
              if (!e) return null;
              let t = I.current;
              if ((t || (I.current = t = new e()), "suspended" === t.state))
                try {
                  await t.resume();
                } catch {}
              return t;
            }, []),
            eR = (0, et.useCallback)(async (e, t) => {
              let n = await fetch(t),
                r = await n.arrayBuffer();
              return e.decodeAudioData(r.slice(0));
            }, []),
            eO = (0, et.useCallback)(async () => {
              let e = await eA();
              if (e) {
                if (0 === T.current.length)
                  try {
                    T.current = await Promise.all(eS.map((t) => eR(e, t)));
                  } catch {
                    T.current = [];
                  }
                if (!C.current)
                  try {
                    C.current = await eR(e, "/audio/button.mp3");
                  } catch {
                    C.current = null;
                  }
              }
            }, [eR, eA]),
            eD = (0, et.useCallback)((e) => {
              if (!e || k.current) return;
              let t = I.current;
              if (!t) return;
              if ("suspended" === t.state)
                return void t.resume().then(() => {
                  I.current?.state === "running" && eD(e);
                });
              if ("running" !== t.state) return;
              let n = t.createBufferSource();
              ((n.buffer = e), n.connect(t.destination));
              try {
                n.start(0);
              } catch {}
            }, []);
          ((0, et.useEffect)(() => {
            let e = new Audio("/audio/loo-intro.mp3");
            ((e.preload = "auto"), (S.current = e));
            let t = new Audio("/audio/slot.mp3");
            ((t.preload = "auto"), (R.current = t));
            let n = !1;
            eE().then((e) => {
              if (n) return;
              if (e) return void eA().then(() => eO());
              let t = () => {
                (eA().then(() => eO()), eE());
              };
              ((A.current = t),
                window.addEventListener("pointerdown", t, { once: !0 }),
                window.addEventListener("keydown", t, { once: !0 }));
            });
            let r = () => {
              eA().then(() => eO());
            };
            return (
              window.addEventListener("pointerdown", r, { once: !0 }),
              window.addEventListener("keydown", r, { once: !0 }),
              () => {
                ((n = !0),
                  window.removeEventListener("pointerdown", r),
                  window.removeEventListener("keydown", r));
                let a = A.current;
                (a &&
                  (window.removeEventListener("pointerdown", a),
                  window.removeEventListener("keydown", a),
                  (A.current = null)),
                  null !== N.current && (window.cancelAnimationFrame(N.current), (N.current = null)),
                  e.pause(),
                  t.pause(),
                  (S.current = null),
                  (R.current = null),
                  (T.current = []),
                  (C.current = null));
                let i = I.current;
                ((I.current = null), i && i.close().catch(() => void 0));
              }
            );
          }, [eA, eE, eO]),
            (0, et.useEffect)(() => {
              let e = window.setTimeout(() => {
                let e = new URLSearchParams(window.location.search).get("seed"),
                  t = e ? null : window.localStorage.getItem("waterloo-roulette:v8");
                if (t)
                  try {
                    let e = JSON.parse(t);
                    if ("2026.8" === e.contentVersion) {
                      let t = {
                        ...e,
                        program: e.program
                          ? (ea.PROGRAMS.find((t) => t.id === e.program?.id) ?? {
                              ...e.program,
                              rizz: eI(e.program.rizz),
                            })
                          : null,
                        rizz: eI(e.rizz),
                        consecutiveLowTerms: e.consecutiveLowTerms ?? 0,
                        bankNoticeShown: e.bankNoticeShown ?? !1,
                        bankNoticePending: e.bankNoticePending ?? !1,
                        multiTaskRollsRemaining: e.multiTaskRollsRemaining ?? 0,
                        currentWorkEvents: (() => {
                          if (e.currentWorkEvents) return e.currentWorkEvents;
                          let t = e.currentWorkEvent;
                          return t ? [t] : [];
                        })(),
                        scholarshipId: e.scholarshipId ?? null,
                        exchange: e.exchange ?? {
                          applicationRolled: !1,
                          accepted: !1,
                          universityId: null,
                          pending: !1,
                          active: !1,
                        },
                        guaranteedAmazonOffer: e.guaranteedAmazonOffer ?? !1,
                        professorReference: e.professorReference ?? !1,
                        moneyEvents: e.moneyEvents ?? [],
                        admissions: {
                          ...e.admissions,
                          selectedMathProgramIds: e.admissions.selectedMathProgramIds ?? [],
                        },
                        gradSchool: e.gradSchool ?? { selectedIds: [], currentId: null, results: [] },
                        teams: (e.teams ?? []).map((e) => ({
                          ...e,
                          axes: [
                            ...new Set(
                              e.axes.flatMap((e) => (ea.AXES.includes(e) ? [e] : ["systems", "mechanical"])),
                            ),
                          ],
                        })),
                        endingCode: e.endingCode ?? null,
                        jobs: (e.jobs ?? []).map((e) => ({ ...e, job: eM(e.job) })),
                        returnOffers: (e.returnOffers ?? []).map((e) => ({ job: eM(e.job) ?? e.job })),
                        pendingJob: eM(e.pendingJob),
                        currentJob: eM(e.currentJob),
                        recruiting: {
                          ...e.recruiting,
                          interviews: e.recruiting.interviews.map((e) => ({ ...e, job: eM(e.job) ?? e.job })),
                          selectedJob: eM(e.recruiting.selectedJob),
                        },
                      };
                      a("study-extra" === e.stage ? e3({ ...t, stage: "term-event" }) : t);
                    }
                  } catch {
                    window.localStorage.removeItem("waterloo-roulette:v8");
                  }
                else
                  a(
                    ek(
                      e ??
                        Array.from(crypto.getRandomValues(new Uint32Array(2)))
                          .map((e) => e.toString(36))
                          .join("-"),
                    ),
                  );
                (b([eu]), l(!0));
              }, 0);
              return () => window.clearTimeout(e);
            }, []),
            (0, et.useEffect)(() => {
              i && window.localStorage.setItem("waterloo-roulette:v8", JSON.stringify(r));
            }, [i, r]),
            (0, et.useEffect)(() => {
              if (!i) return;
              let e = window.setInterval(() => {
                "visible" === document.visibilityState &&
                  ez()
                    .then((e) => {
                      Q((t) => (t ? { ...t, totals: { ...t.totals, playtimeSeconds: e } } : t));
                    })
                    .catch(() => void 0);
              }, 18e4);
              return () => window.clearInterval(e);
            }, [i]),
            (0, et.useEffect)(
              () => () => {
                (null !== M.current && window.clearTimeout(M.current),
                  null !== O.current && window.clearTimeout(O.current));
              },
              [],
            ),
            (0, et.useEffect)(
              () => () => {
                P.current?.terminate();
              },
              [],
            ),
            (0, et.useEffect)(() => {
              var e, t;
              if (!i || "done" !== r.stage) return;
              let n =
                  ((e = r.status),
                  "yc" === (t = r.endingCode)
                    ? eg
                    : "dead" === e || "run-over" === t
                      ? eh
                      : "graduated" === e
                        ? em
                        : null),
                a = `${r.seed}:${r.status}:${r.endingCode ?? "none"}`;
              n && z.current !== a && ((z.current = a), b((e) => [...e, n]));
            }, [i, r.endingCode, r.seed, r.stage, r.status]),
            (0, et.useEffect)(() => {
              i && "1" === window.sessionStorage.getItem(eN) && v(!0);
            }, [i]),
            (0, et.useEffect)(() => {
              i && "done" === r.stage && (window.sessionStorage.setItem(eN, "1"), v(!0));
            }, [i, r.stage]),
            (0, et.useEffect)(() => {
              i &&
                "done" === r.stage &&
                $.current !== r.seed &&
                (($.current = r.seed),
                e$(r)
                  .then(Q)
                  .catch(() => void 0));
            }, [i, r]));
          let e2 = (0, et.useMemo)(
              () =>
                ((e) => {
                  switch (e.stage) {
                    case "highschool-average":
                      return Array.from({ length: 16 }, (e, t) => {
                        let n = 85 + t,
                          r = (n - 96) / 1.8;
                        return {
                          id: `highschool-${n}`,
                          label: `${n}%`,
                          short: `${n}%`,
                          detail: "Final admission average.",
                          weight: 100 * Math.exp(-0.5 * r * r),
                          payload: n,
                          tone: n >= 98 ? "green" : n >= 95 ? "gold" : "cream",
                        };
                      });
                    case "applications":
                    case "program-select":
                    case "offer-select":
                    case "grad-applications":
                    case "ending-select":
                    case "done":
                      return [];
                    case "admission": {
                      let t = e.admissions.currentProgramId,
                        n = t && t in en.ADMISSION_MEDIANS ? en.ADMISSION_MEDIANS[t] : 95,
                        r = t === e.admissions.backupEngineeringId,
                        a = (0, en.admissionProbability)(e.highSchoolAverage ?? 96, n, r);
                      return [
                        {
                          id: "offer",
                          label: "Offer",
                          short: "OFFER",
                          detail: `${Math.round(100 * a)}% admission chance.`,
                          weight: 100 * a,
                          tone: "green",
                        },
                        {
                          id: "no-offer",
                          label: "No offer",
                          short: "NO OFFER",
                          detail: `${Math.round(100 * a)}% admission chance.`,
                          weight: (1 - a) * 100,
                          tone: "red",
                        },
                      ];
                    }
                    case "sequence":
                      var t, n;
                      let r = e.program;
                      if (!r) return [];
                      if ("math" === r.sequence)
                        return [
                          {
                            id: "SEQ 1",
                            label: "Sequence 1",
                            short: "SEQ 1",
                            detail: "The classic alternate-every-term conveyor belt.",
                            weight: 35,
                            tone: "gold",
                          },
                          {
                            id: "SEQ 2",
                            label: "Sequence 2",
                            short: "SEQ 2",
                            detail: "Two study terms together, then the calendar gets weird.",
                            weight: 30,
                            tone: "cream",
                          },
                          {
                            id: "SEQ 3",
                            label: "Sequence 3",
                            short: "SEQ 3",
                            detail: "An early off term to contemplate the consequences.",
                            weight: 15,
                            tone: "ink",
                          },
                          {
                            id: "SEQ 4",
                            label: "Sequence 4",
                            short: "SEQ 4",
                            detail: "2A before your first co-op. More courses, same panic.",
                            weight: 20,
                            tone: "green",
                          },
                        ];
                      if ("eng4" === r.sequence)
                        return [
                          {
                            id: "STREAM 4",
                            label: "Stream 4",
                            short: "S4",
                            detail: "First co-op in January. Good luck with that résumé.",
                            weight: 1,
                            tone: "red",
                          },
                        ];
                      if ("eng8" === r.sequence)
                        return [
                          {
                            id: "STREAM 8",
                            label: "Stream 8",
                            short: "S8",
                            detail: "Two study terms before your first co-op.",
                            weight: 1,
                            tone: "green",
                          },
                        ];
                      return [
                        {
                          id: "dual-double" === r.sequence ? "STREAM 4D" : "STREAM 4",
                          label: "Stream 4",
                          short: "S4",
                          detail: "You apply for co-op almost immediately.",
                          weight: 50,
                          tone: "red",
                        },
                        {
                          id: "dual-double" === r.sequence ? "STREAM 8" : "STREAM 8S",
                          label: "Stream 8",
                          short: "S8",
                          detail: "You get 1B before WaterlooWorks discovers you.",
                          weight: 50,
                          tone: "green",
                        },
                      ];
                    case "scholarship":
                      return eb.SCHOLARSHIP_OUTCOMES.map((e) => ({
                        id: e.id,
                        label: e.label,
                        short: e.short,
                        detail: e.detail,
                        weight: e.weight,
                        tone: e.tone,
                      }));
                    case "major":
                      return ea.MATH_MAJORS.map((e) => ({
                        id: e.id,
                        label: e.label,
                        short: e.label.replace("Mathematical", "Math").slice(0, 13),
                        detail: "Plan declaration approved by the wheel.",
                        weight: e.weight,
                        tone: "datasci" === e.id ? "green" : "gold",
                      }));
                    case "exchange-application": {
                      let t = (0, ef.exchangeAcceptanceChance)(e.average);
                      return [
                        {
                          id: "exchange",
                          label: "Matched for exchange",
                          short: "MATCHED",
                          detail: `${(100 * t).toFixed(1)}% chance from CAV.`,
                          weight: 100 * t,
                          tone: "green",
                        },
                        {
                          id: "no-exchange",
                          label: "No exchange match",
                          short: "NO MATCH",
                          detail: `${(100 * t).toFixed(1)}% chance was not enough.`,
                          weight: (1 - t) * 100,
                          tone: "red",
                        },
                      ];
                    }
                    case "exchange-university":
                      return ef.EXCHANGE_UNIVERSITIES.map((e) => ({
                        id: e.id,
                        label: e.name,
                        short: e.short,
                        detail: e.country,
                        weight: 1,
                        tone: "gold",
                      }));
                    case "exchange-event":
                      return ef.EXCHANGE_EVENTS.map((e) => ({
                        id: e.id,
                        label: e.label,
                        short: e.short,
                        detail: e.detail,
                        weight: e.weight,
                        tone: e.tone,
                      }));
                    case "study-grade":
                      return Array.from({ length: 101 }, (e, t) => {
                        let n =
                            t < 60
                              ? {
                                  tagline: "Cooked",
                                  detail: "The curve was not a rescue operation.",
                                  tone: "red",
                                }
                              : t < 70
                                ? {
                                    tagline: "Barely survived",
                                    detail: "Credit acquired. Knowledge unclear.",
                                    tone: "cream",
                                  }
                                : t < 80
                                  ? {
                                      tagline: "Respectable",
                                      detail: "Perfectly employable academic camouflage.",
                                      tone: "ink",
                                    }
                                  : t < 90
                                    ? {
                                        tagline: "Academic weapon",
                                        detail: "You corrected the TA once and survived.",
                                        tone: "green",
                                      }
                                    : {
                                        tagline: "Touch grass, bro",
                                        detail: "Office hours now come to you.",
                                        tone: "gold",
                                      },
                          r = (t - 76) / 12;
                        return {
                          id: `average-${t}`,
                          label: `${t}% \xb7 ${n.tagline}`,
                          short: `${t}% \xb7 ${n.tagline}`,
                          detail: n.detail,
                          weight: Math.max(0.02, 100 * Math.exp(-0.5 * r * r)),
                          tone: n.tone,
                          payload: t,
                        };
                      });
                    case "term-event": {
                      let r = eP(e);
                      if (r?.kind === "study") {
                        let r, a, i, l, s, o, d, c;
                        return (
                          (t = [
                            {
                              id: "clean",
                              label: "Nothing reportable",
                              short: "NO INCIDENT",
                              detail: "An ordinary four months.",
                              weight: 36,
                              tone: "cream",
                            },
                            {
                              id: "bad-breakup",
                              label: "Bad breakup",
                              short: "BAD BREAKUP",
                              detail: "Roll for the fallout.",
                              weight: 14,
                              tone: "red",
                            },
                            {
                              id: "roommate",
                              label: "Roommate starts DJing",
                              short: "3AM SET",
                              detail: "Sleep quality collapses.",
                              weight: 7,
                              tone: "red",
                            },
                            {
                              id: "recommendation",
                              label: "Professor offers a reference",
                              short: "REFERENCE",
                              detail: "Doubles masters admit odds. +2 systems/aiData rizz.",
                              weight: 8,
                              tone: "green",
                            },
                            {
                              id: "scholarship",
                              label: "Upper-year scholarship",
                              short: "SCHOLARSHIP",
                              detail: "Academic performance pays out.",
                              weight: Math.max(2, e.average - 76),
                              tone: "gold",
                            },
                            {
                              id: "collab",
                              label: "Caught over-collaborating",
                              short: "POLICY 71",
                              detail: "Lose one integrity point.",
                              weight: 5,
                              tone: "red",
                            },
                            {
                              id: "exam",
                              label: "Caught with unauthorized aid",
                              short: "EXAM INCIDENT",
                              detail: "Lose both integrity points. Expelled.",
                              weight: 2,
                              tone: "red",
                            },
                            {
                              id: "concussion",
                              label: "Had a concussion",
                              short: "CONCUSSION",
                              detail: "Recovery costs momentum and job rizz across every category.",
                              weight: 4,
                              tone: "red",
                            },
                            {
                              id: "failed-course",
                              label: "Failed a required course",
                              short: "FAILED COURSE",
                              detail: "The average and every job-rizz category take a hit.",
                              weight: 4,
                              tone: "red",
                            },
                            {
                              id: "resume-lie",
                              label: "Résumé exaggeration exposed",
                              short: "RESUME EXPOSED",
                              detail: "Every job-rizz category drops sharply.",
                              weight: 2,
                              tone: "red",
                            },
                            {
                              id: "contest",
                              label: "Won a math contest",
                              short: "CONTEST WIN",
                              detail: "Quant and data rizz increase.",
                              weight: 5,
                              tone: "green",
                            },
                            {
                              id: "hack-win",
                              label: "Won a hackathon",
                              short: "HACKATHON WIN",
                              detail: "A strong project lands on the résumé.",
                              weight: 5,
                              tone: "green",
                            },
                            {
                              id: "burnout",
                              label: "Burned out before finals",
                              short: "BURNOUT",
                              detail: "Momentum and every job-rizz category drop.",
                              weight: 8,
                              tone: "red",
                            },
                            {
                              id: "goose",
                              label: "Attacked by a goose",
                              short: "GOOSE",
                              detail: "No stat change.",
                              weight: 9,
                              tone: "gold",
                            },
                            ...((r = e.teams.filter((e) => e.active)),
                            (a = e6(e)),
                            (i = [
                              {
                                id: "hackathon",
                                label: "Hackathon run",
                                short: "HACKATHON",
                                detail: "Sleep is exchanged for a dubious demo.",
                                weight: 15,
                                tone: "gold",
                              },
                              {
                                id: "side-project",
                                label: "Ship a side project",
                                short: "SHIP IT",
                                detail: "Twelve users, including your roommates.",
                                weight: 16,
                                tone: "green",
                              },
                              {
                                id: "leetcode",
                                label: "LeetCode sabbatical",
                                short: "200 MEDIUMS",
                                detail: "Systems rizz rises. Social life delists.",
                                weight: 12,
                                tone: "ink",
                              },
                              {
                                id: "nothing",
                                label: "Did absolutely nothing",
                                short: "BEDROTTING",
                                detail: "Every job-rizz category drops slightly.",
                                weight: 13,
                                tone: "cream",
                              },
                            ]),
                            a.length > 0 &&
                              i.push({
                                id: "join-design-team",
                                label: "Join a design team",
                                short: "JOIN DESIGN TEAM",
                                detail: "Roll for which team takes your free time.",
                                weight: 30,
                                tone: "gold",
                              }),
                            r
                              .filter((e) => e.rank < ea.RANKS.length - 1)
                              .forEach((e) => {
                                let t = ea.RANKS[e.rank + 1];
                                i.push({
                                  id: `promote:${e.name}`,
                                  label: `Promoted in ${e.name}`,
                                  short: `PROMOTED \xb7 ${e.name.replace("Waterloo", "W").slice(0, 11)}`,
                                  detail: `${ea.RANKS[e.rank]} → ${t}.`,
                                  weight: 12,
                                  tone: "gold",
                                });
                              }),
                            i),
                          ]),
                          (n = 0 === e.multiTaskRollsRemaining),
                          (l = t.reduce((e, t) => e + Math.max(0, t.weight), 0)),
                          (s = 5 / 360),
                          (d = 1 - 5 / 360 - (o = n ? 25 / 360 : 0)),
                          (c = []),
                          n &&
                            c.push({
                              id: "multi-task",
                              label: "Multi-task",
                              short: "MULTI-TASK",
                              detail: "Roll two more term events.",
                              weight: (l * o) / d,
                              tone: "gold",
                            }),
                          c.push({
                            id: "run-over",
                            label: "Got run over",
                            short: "GOT RUN OVER",
                            detail: "The run ends immediately.",
                            weight: (l * s) / d,
                            tone: "red",
                          }),
                          [...t, ...c]
                        );
                      }
                      if (r?.kind === "coop") {
                        let t = e.currentJob?.volatility ?? 3,
                          n = e.jobs.length >= 3 && (e.currentJob?.prestige ?? 0) >= 6,
                          r = e.multiTaskRollsRemaining > 0,
                          a = [
                            {
                              id: "ship",
                              label: "Shipped a production feature",
                              short: "SHIPPED",
                              detail: "Role rizz rises. Evaluation odds improve.",
                              weight: 23,
                              tone: "green",
                            },
                            {
                              id: "mentor",
                              label: "Found a great mentor",
                              short: "GOOD MANAGER",
                              detail: "Role rizz rises. Evaluation odds improve slightly.",
                              weight: 12,
                              tone: "green",
                            },
                            {
                              id: "tests",
                              label: "Wrote tests for four months",
                              short: "98% COVERAGE",
                              detail: "Small systems and evaluation boost.",
                              weight: 14,
                              tone: "ink",
                            },
                            {
                              id: "patent",
                              label: "Named on a patent or paper",
                              short: "BIG IMPACT",
                              detail: "+6 role rizz, +1× co-op pay, and a large evaluation boost.",
                              weight: 5,
                              tone: "gold",
                            },
                            {
                              id: "workaholic",
                              label: "Did a lot of overtime",
                              short: "WORKAHOLIC",
                              detail: "Role rizz rises slightly. Overtime adds 1.5× co-op pay on top.",
                              weight: 10,
                              tone: "green",
                            },
                          ];
                        return (
                          r ||
                            a.push(
                              {
                                id: "forgotten",
                                label: "Manager forgot the intern",
                                short: "NO TICKETS",
                                detail: "Evaluation odds drop.",
                                weight: 11,
                                tone: "cream",
                              },
                              {
                                id: "incident",
                                label: "Pushed to prod on Friday",
                                short: "SEV-1",
                                detail: "Evaluation odds drop sharply.",
                                weight: 9,
                                tone: "red",
                              },
                              {
                                id: "performative-multitask",
                                label: "Performative multi-tasking",
                                short: "MULTI-TASK",
                                detail: "Roll twice on only the good work outcomes.",
                                weight: 7,
                                tone: "gold",
                              },
                              {
                                id: "cancelled",
                                label: "Project cancelled in reorg",
                                short: "PROJECT CUT",
                                detail: "Small evaluation penalty.",
                                weight: 9,
                                tone: "cream",
                              },
                              {
                                id: "layoff",
                                label: "Laid off mid-term",
                                short: "LAID OFF",
                                detail: "Pay is cut. Evaluation is barely affected.",
                                weight: Math.max(2, t),
                                tone: "red",
                              },
                              {
                                id: "fired",
                                label: "Got fired",
                                short: "FIRED",
                                detail: "Evaluation odds collapse.",
                                weight: Math.max(1, t / 2),
                                tone: "red",
                              },
                            ),
                          n &&
                            a.push({
                              id: "dropout",
                              label: "Full-time conversion",
                              short: "DROP OUT",
                              detail: "Strong evaluation boost. Accept full-time and leave Waterloo.",
                              weight: 2.5,
                              tone: "gold",
                            }),
                          r ? a : e4(a)
                        );
                      }
                      if (r?.kind === "off")
                        return e4([
                          {
                            id: "sleep",
                            label: "Slept for four months",
                            short: "HIBERNATED",
                            detail: "Momentum restored.",
                            weight: 25,
                            tone: "cream",
                          },
                          {
                            id: "project",
                            label: "Built a serious side project",
                            short: "SHIP SEASON",
                            detail: "Product and systems rizz increase.",
                            weight: 25,
                            tone: "green",
                          },
                          {
                            id: "hack",
                            label: "Won a hackathon",
                            short: "HACKATHON WIN",
                            detail: "Technical rizz increases sharply.",
                            weight: 8,
                            tone: "gold",
                          },
                          {
                            id: "travel",
                            label: "Travelled",
                            short: "OFFLINE",
                            detail: "Momentum restored.",
                            weight: 18,
                            tone: "green",
                          },
                          {
                            id: "doom",
                            label: "Doomscrolled the job market",
                            short: "DOOMSCROLL",
                            detail: "Momentum falls.",
                            weight: 24,
                            tone: "red",
                          },
                        ]);
                      return [];
                    }
                    case "breakup":
                      return [
                        {
                          id: "ruined-life",
                          label: "She ruins your life",
                          short: "LIFE RUINED",
                          detail:
                            "Lose 30% job rizz, one integrity point, and whichever leaves less: half your savings or another $2,000.",
                          weight: 40,
                          tone: "red",
                        },
                        {
                          id: "walk-it-off",
                          label: "Walk it off",
                          short: "WALK IT OFF",
                          detail: "No lasting damage.",
                          weight: 60,
                          tone: "green",
                        },
                      ];
                    case "debt-job":
                      return ep.FORCED_DEBT_JOBS.map((e) => ({
                        id: e.id,
                        label: e.label,
                        short: e.short,
                        detail: `${eY(e.hourlyWage)}. Every job-rizz category drops.`,
                        weight: e.weight,
                        tone: "red",
                      }));
                    case "design-team":
                      return e6(e).map((e) => ({
                        id: `team:${e.name}`,
                        label: e.name,
                        short: e.name.replace("Waterloo", "W").slice(0, 16),
                        detail: "Join as a member.",
                        weight: 1,
                        tone: "gold",
                      }));
                    case "design-team-coop": {
                      let t = e.teams.filter((e) => e.active);
                      return (t.length > 0 ? t : e6(e)).map((e) => ({
                        id: `team:${e.name}`,
                        label: e.name,
                        short: e.name.replace("Waterloo", "W").slice(0, 16),
                        detail:
                          t.length > 0
                            ? "$0 co-op with your design team."
                            : "Join this team and work a $0 co-op.",
                        weight: 1,
                        tone: t.length > 0 ? "green" : "gold",
                      }));
                    }
                    case "recruit-count": {
                      let t = 0.25 + 0.5 * Math.max(1, eW(e)) + 0.06 * eH(e),
                        n = Array.from({ length: 9 }, (e, n) => {
                          let r = Array.from({ length: n }, (e, t) => t + 1).reduce((e, t) => e * t, 1);
                          return Math.max(0.15, ((Math.exp(-t) * Math.pow(t, n)) / r) * 100);
                        });
                      return Array.from({ length: 8 }, (e, t) => {
                        let r = t < 7 ? n[t] : n.slice(7).reduce((e, t) => e + t, 0);
                        return {
                          id: `${t}`,
                          label: `${t} interview${1 === t ? "" : "s"}`,
                          short: `${t} INTERVIEW${1 === t ? "" : "S"}`,
                          detail:
                            0 === t
                              ? "WaterlooWorks has reviewed your vibes."
                              : "Calendar conflicts are about to multiply.",
                          weight: r,
                          payload: t,
                          tone: 0 === t ? "red" : t >= 6 ? "green" : "gold",
                        };
                      });
                    }
                    case "recruit-job": {
                      let t = new Set(e.recruiting.interviews.map((e) => e.job.id)),
                        n = ex.filter((e) => !t.has(e.id)),
                        r = (0, ei.interviewPoolWeights)(eB(e), n);
                      return n.map((t) => ({
                        id: t.id,
                        label: `${t.company} — ${t.role}`,
                        short: t.company.slice(0, 18),
                        detail: `${t.location} \xb7 ${(0, er.prestigeBandFor)(t.prestige)} company \xb7 ${eq(t.selectivity)} \xb7 ${Math.round(eJ(e, t))} job rizz`,
                        weight: r.get(t.id) ?? (0, ei.companyInterviewWeight)(eB(e), t),
                        tone:
                          t.prestige >= 9
                            ? "green"
                            : t.prestige <= 3
                              ? "red"
                              : t.prestige >= 7
                                ? "gold"
                                : "ink",
                      }));
                    }
                    case "interview": {
                      let t = e.recruiting.selectedJob;
                      if (!t) return [];
                      let n = (0, ei.offerProbability)(eB(e), t);
                      return [
                        {
                          id: "offer",
                          label: "Offer",
                          short: "OFFER",
                          detail: `${Math.round(100 * n)}% offer chance from role fit, experience, grades, and interview difficulty.`,
                          weight: 100 * n,
                          tone: "green",
                        },
                        {
                          id: "no-offer",
                          label: "No offer",
                          short: "NO OFFER",
                          detail: `${Math.round(100 * n)}% offer chance was not enough.`,
                          weight: (1 - n) * 100,
                          tone: "red",
                        },
                      ];
                    }
                    case "work-eval": {
                      let t,
                        n = Math.max(
                          -8,
                          Math.min(
                            6,
                            e.currentWorkEvents.reduce((e, t) => e + (eV[t] ?? 0), 0) +
                              Math.max(
                                -1.25,
                                Math.min(
                                  1.5,
                                  ((t = e.currentJob ?? ex[0]), ((0, ei.traitFit)(e.rizz, t) - 20) / 15),
                                ),
                              ),
                          ),
                        );
                      return [
                        {
                          id: "Outstanding",
                          label: "Outstanding",
                          short: "OUTSTANDING",
                          detail: "Reserved for only those few students. Somehow, you.",
                          weight: Math.max(0.4, 3 * Math.exp(0.22 * n)),
                          tone: "green",
                        },
                        {
                          id: "Excellent",
                          label: "Excellent",
                          short: "EXCELLENT",
                          detail: "Your supervisor is delighted. Officially.",
                          weight: Math.max(1.5, 11 * Math.exp(0.16 * n)),
                          tone: "green",
                        },
                        {
                          id: "Very Good",
                          label: "Very Good",
                          short: "VERY GOOD",
                          detail: "Met all and exceeded some expectations.",
                          weight: Math.max(4, 26 * Math.exp(0.08 * n)),
                          tone: "gold",
                        },
                        {
                          id: "Good",
                          label: "Good",
                          short: "GOOD",
                          detail: "Expectations met. Corporate equilibrium achieved.",
                          weight: Math.max(8, 28 - 1.2 * Math.abs(n)),
                          tone: "ink",
                        },
                        {
                          id: "Satisfactory",
                          label: "Satisfactory",
                          short: "SATISFACTORY",
                          detail: "Credit granted. Every job-rizz category drops slightly.",
                          weight: Math.max(1, 14 * Math.exp(-0.15 * n)),
                          tone: "cream",
                        },
                        {
                          id: "Marginal",
                          label: "Marginal",
                          short: "MARGINAL",
                          detail: "The transcript warning cuts every job-rizz category hard.",
                          weight: Math.max(0.4, 5 * Math.exp(-0.23 * n)),
                          tone: "red",
                        },
                        {
                          id: "Unsatisfactory",
                          label: "Unsatisfactory",
                          short: "NCR",
                          detail: "No credit. Every job-rizz category collapses.",
                          weight: Math.max(0.15, 1.5 * Math.exp(-0.32 * n)),
                          tone: "red",
                        },
                      ];
                    }
                    case "yc-roll": {
                      let t = Math.min(0.06, 0.003 + 0.055 * Math.pow(eH(e) / 100, 2));
                      return [
                        {
                          id: "yc",
                          label: "Got into YC",
                          short: "GOT INTO YC",
                          detail: `${(100 * t).toFixed(1)}% chance.`,
                          weight: 100 * t,
                          tone: "gold",
                        },
                        {
                          id: "no-yc",
                          label: "Rejected by YC",
                          short: "NO YC",
                          detail: `${(100 * t).toFixed(1)}% chance.`,
                          weight: (1 - t) * 100,
                          tone: "red",
                        },
                      ];
                    }
                    case "return-offer": {
                      let t = e.jobs[e.jobs.length - 1]?.evaluation ?? "Good",
                        n = (0, ey.returnOfferChance)(t);
                      return [
                        {
                          id: "return",
                          label: "Return offer",
                          short: "RETURN OFFER",
                          detail: `${Math.round(100 * n)}% chance from ${t}.`,
                          weight: 100 * n,
                          tone: "green",
                        },
                        {
                          id: "no-return",
                          label: "No return offer",
                          short: "NO RETURN",
                          detail: `${Math.round(100 * n)}% was not enough.`,
                          weight: (1 - n) * 100,
                          tone: "cream",
                        },
                      ];
                    }
                    case "grad-admission": {
                      let t = (0, ey.gradSchoolById)(e.gradSchool.currentId ?? ""),
                        n = t
                          ? (0, ey.gradAdmissionProbability)(e.average, t.median, e.professorReference)
                          : 0.01;
                      return [
                        {
                          id: "offer",
                          label: "Offer",
                          short: "OFFER",
                          detail: e.professorReference
                            ? "Reference letter on file."
                            : "Admit chance from your CAV.",
                          weight: 100 * n,
                          tone: "green",
                        },
                        {
                          id: "no-offer",
                          label: "No offer",
                          short: "NO OFFER",
                          detail: "Not this cycle.",
                          weight: (1 - n) * 100,
                          tone: "red",
                        },
                      ];
                    }
                    case "unemployed": {
                      let t = [
                        {
                          id: "wea",
                          label: "WE Accelerate",
                          short: "WE ACCELERATE",
                          detail: "A work-integrated learning experience appears.",
                          weight: 28,
                          tone: "gold",
                        },
                        {
                          id: "design-team-coop",
                          label: "Design team co-op",
                          short: "DESIGN TEAM",
                          detail: "$0 pay. Four months of building useful things.",
                          weight: 20,
                          tone: "green",
                        },
                        {
                          id: "ra",
                          label: "University research assistant",
                          short: "CAMPUS RA",
                          detail: "A professor has funding and low expectations.",
                          weight: 22,
                          tone: "green",
                        },
                        {
                          id: "unrelated",
                          label: "Unrelated approved job",
                          short: "SURVIVAL JOB",
                          detail: "Co-op credit, minimal role fit, actual money.",
                          weight: 25,
                          tone: "cream",
                        },
                        {
                          id: "startup",
                          label: "Friend's startup",
                          short: "FOUNDING INTERN",
                          detail: "Compensation arrives in narrative form.",
                          weight: 15,
                          tone: "red",
                        },
                        {
                          id: "nothing",
                          label: "Fully unemployed",
                          short: "NO CREDIT",
                          detail: "Four months of refreshing job boards.",
                          weight: 10,
                          tone: "red",
                        },
                      ];
                      return (0, ed.canUseWeAccelerate)(e.jobs, eW(e)) ? t : t.filter((e) => "wea" !== e.id);
                    }
                  }
                })(r),
              [r],
            ),
            e7 = (0, et.useMemo)(
              () =>
                "recruit-job" === r.stage
                  ? ((e, t, n) => {
                      let r = [...e];
                      for (let e = r.length - 1; e > 0; e -= 1) {
                        let a = Math.floor(eC(t, n, `employer-order:${e}`) * (e + 1));
                        [r[e], r[a]] = [r[a], r[e]];
                      }
                      return r;
                    })(e2, r.seed, r.rngCounter)
                  : e2,
              [e2, r.rngCounter, r.seed, r.stage],
            ),
            to = (0, et.useMemo)(() => e8(r), [r]),
            td = (0, et.useMemo)(
              () =>
                r.admissions.results
                  .filter((e) => "offer" === e.outcome)
                  .map((e) => ea.PROGRAMS.find((t) => t.id === e.programId))
                  .filter((e) => void 0 !== e),
              [r],
            ),
            tc = (0, et.useMemo)(() => new Set(eG(r).map((e) => e.job.id)), [r]),
            ty = (0, et.useMemo)(() => {
              if (eU(r))
                return [
                  {
                    id: "survival-job",
                    title: "Survival job",
                    detail: "I have student debt I have to pay off.",
                    meta: "MCDONALD'S · CREW MEMBER",
                  },
                ];
              let e = r.gradSchool.results
                  .filter((e) => "offer" === e.outcome)
                  .map((e) => {
                    let t = (0, ey.gradSchoolById)(e.schoolId);
                    return {
                      id: `grad:${e.schoolId}`,
                      title: t?.name ?? e.schoolId,
                      detail: "Masters offer",
                      meta: t?.short ?? e.schoolId,
                    };
                  }),
                t = eG(r).map((e) => ({
                  id: `return:${e.job.id}`,
                  title: `${e.job.company} full-time`,
                  detail: e.job.role,
                  meta: `${e.job.location} \xb7 RETURN OFFER \xb7 ${eY(1.5 * e.job.pay)}`,
                }));
              return e.length > 0 || t.length > 0
                ? [
                    ...e,
                    ...t,
                    {
                      id: "yc-roll",
                      title: "I'm feeling lucky",
                      detail: "YC moonshot",
                      meta: "Y COMBINATOR",
                    },
                  ]
                : [
                    {
                      id: "unemployed",
                      title: "Open to work",
                      detail: "The degree is complete. The search is not.",
                      meta: "NO OFFERS · NO RETURNS",
                    },
                  ];
            }, [r]),
            tx =
              ((t = eP(r)?.label),
              {
                "highschool-average": { eyebrow: "START", title: "High-school average" },
                applications: { eyebrow: `${r.highSchoolAverage ?? "—"}%`, title: "Applications" },
                admission: {
                  eyebrow: `${r.highSchoolAverage ?? "—"}% \xb7 ${ea.PROGRAMS.find((e) => e.id === r.admissions.currentProgramId)?.short ?? "UW"}`,
                  title: "Admission result",
                },
                "program-select": { eyebrow: "OFFERS", title: "Choose a program" },
                sequence: { eyebrow: r.program?.short ?? "PROGRAM", title: "Co-op sequence" },
                scholarship: { eyebrow: "ADMISSION", title: "Entrance scholarship" },
                "exchange-application": {
                  eyebrow: `2B \xb7 ${r.average.toFixed(1)}% CAV`,
                  title: "Exchange match",
                },
                "exchange-university": { eyebrow: "EXCHANGE", title: "Host university" },
                "exchange-event": {
                  eyebrow:
                    ef.EXCHANGE_UNIVERSITIES.find((e) => e.id === r.exchange.universityId)?.short ??
                    "EXCHANGE",
                  title: "Exchange event",
                },
                "study-grade": { eyebrow: t ?? "STUDY", title: "Term average" },
                "term-event": {
                  eyebrow:
                    eP(r)?.kind === "coop"
                      ? `${t ?? "CO-OP"} \xb7 ${r.currentJob?.company ?? "WORK"}`
                      : (t ?? "TERM"),
                  title: "Term event",
                },
                breakup: { eyebrow: t ?? "STUDY", title: "Bad breakup" },
                "debt-job": { eyebrow: t ?? "STUDY", title: "Minimum-wage job" },
                "design-team": { eyebrow: t ?? "STUDY", title: "Design team" },
                "design-team-coop": { eyebrow: t ?? "CO-OP", title: "Design team co-op" },
                major: { eyebrow: "MATH", title: "Major" },
                "recruit-count": { eyebrow: "WATERLOOWORKS", title: "Interview count" },
                "recruit-job": {
                  eyebrow: `${r.recruiting.completed + 1} / ${r.recruiting.target}`,
                  title: "Employer",
                },
                interview: {
                  eyebrow: r.recruiting.selectedJob?.company ?? "INTERVIEW",
                  title: "Interview result",
                },
                "offer-select": { eyebrow: `${e8(r).length} OFFERS`, title: "Choose an offer" },
                "work-eval": { eyebrow: "CO-OP", title: "Evaluation" },
                "return-offer": { eyebrow: r.currentJob?.company ?? "CO-OP", title: "Return offer" },
                "yc-roll": {
                  eyebrow:
                    "academic-expulsion" === r.ycContinuation
                      ? "KICKED OUT"
                      : "graduation" === r.ycContinuation
                        ? "GRADUATION"
                        : "AFTER TERM",
                  title: "Y Combinator",
                },
                unemployed: { eyebrow: t ?? "CO-OP", title: "Work-term outcome" },
                "grad-applications": { eyebrow: "GRADUATION", title: "Masters applications" },
                "grad-admission": {
                  eyebrow: (0, ey.gradSchoolById)(r.gradSchool.currentId ?? "")?.short ?? "MASTERS",
                  title: "Admission result",
                },
                "ending-select": { eyebrow: "GRADUATION", title: "Choose your next step" },
                done: { eyebrow: "COMPLETE", title: r.ending ?? "Run complete" },
              }[r.stage]),
            tv = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            tw = tv ? 40 : "recruit-job" === r.stage ? 1800 : ej.has(r.stage) ? 520 : 2200,
            tj = tv ? 120 : 1500,
            tE = (0, et.useCallback)(() => {
              let e = R.current;
              e && !k.current && (e.pause(), (e.currentTime = 0), e.play().catch(() => void 0));
            }, []),
            tS = (0, et.useCallback)(() => {
              let e = T.current;
              0 === e.length ? eO() : eD(e[Math.floor(Math.random() * e.length)]);
            }, [eD, eO]),
            tN = (0, et.useCallback)(() => {
              C.current ? eD(C.current) : eO();
            }, [eD, eO]);
          (0, et.useEffect)(() => {
            let e = (e) => {
              let t = e.target;
              t instanceof Element && t.closest("button") && (eA().then(() => eO()), tN());
            };
            return (
              document.addEventListener("pointerdown", e, !0),
              () => {
                document.removeEventListener("pointerdown", e, !0);
              }
            );
          }, [eA, tN, eO]);
          let tA = (0, et.useCallback)(() => {
            if (s || p.length > 0 || r.bankNoticePending || 0 === e2.length || "done" === r.stage) return;
            let e = ((e, t) => {
                let n = t * e.reduce((e, t) => e + Math.max(0, t.weight), 0);
                for (let t = 0; t < e.length; t += 1) if ((n -= Math.max(0, e[t].weight)) <= 0) return t;
                return e.length - 1;
              })(e2, eC(r.seed, r.rngCounter)),
              t = e2[e],
              n = "recruit-job" === r.stage ? e7.findIndex((e) => e.id === t.id) : e,
              i = n >= 0 ? n : e;
            if (((E.current = t), o(!0), c(!0), ej.has(r.stage)))
              (tE(), g((e) => ({ stage: r.stage, target: 6 * e7.length + i, run: (e?.run ?? 0) + 1 })));
            else {
              var l, d;
              let e,
                t,
                n,
                a,
                s = "recruit-job" === r.stage || "exchange-university" === r.stage,
                o =
                  ((l = eo(e7, s)[i]),
                  (d = eC(r.seed, r.rngCounter, `wheel-landing:${r.stage}:${i}`)),
                  (e = Math.min(2, 0.12 * l.size)),
                  (t = Math.max(0, l.size - 2 * e)),
                  (n = Math.max(0, Math.min(1, d))),
                  l.start + e + t * n);
              m(360 * Math.ceil((u + (s ? 180 : 1332) - (a = (360 - o) % 360)) / 360) + a);
            }
            ((M.current = window.setTimeout(() => {
              (c(!1), (M.current = null));
            }, tw)),
              (O.current = window.setTimeout(() => {
                let e = E.current;
                (e &&
                  a((t) =>
                    ((e, t) => {
                      let n = { ...e, rngCounter: e.rngCounter + 1, lastResult: null },
                        r = t.tone ?? "ink";
                      switch (e.stage) {
                        case "highschool-average": {
                          let e = Number(t.payload);
                          return eK(
                            (n = { ...n, highSchoolAverage: e, stage: "applications" }),
                            `${e}% high-school average`,
                            t.detail,
                            r,
                          );
                        }
                        case "admission": {
                          let a = e.admissions.currentProgramId;
                          if (!a) return n;
                          let i = ea.PROGRAMS.find((e) => e.id === a),
                            l = a in en.ADMISSION_MEDIANS ? en.ADMISSION_MEDIANS[a] : 95,
                            s = a === e.admissions.backupEngineeringId,
                            o = (0, en.admissionProbability)(e.highSchoolAverage ?? 96, l, s),
                            d = a === e.admissions.mainEngineeringId ? "main" : s ? "backup" : "selected",
                            c = [
                              ...e.admissions.results,
                              { programId: a, outcome: t.id, probability: o, source: d },
                            ],
                            u = e.admissions.selectedMathProgramIds,
                            m = (0, en.nextAdmissionProgramId)({
                              currentProgramId: a,
                              outcome: t.id,
                              mainEngineeringId: e.admissions.mainEngineeringId,
                              backupEngineeringId: e.admissions.backupEngineeringId,
                              selectedMathProgramIds: u,
                            }),
                            h = "admission";
                          return (
                            m ||
                              (c.some(
                                (e) =>
                                  en.SELECTABLE_MATH_APPLICATION_IDS.includes(e.programId) &&
                                  "offer" === e.outcome,
                              ) ||
                                (c = [
                                  ...c,
                                  {
                                    programId: "geomatics",
                                    outcome: "offer",
                                    probability: 1,
                                    source: "fallback",
                                  },
                                ]),
                              (h = "program-select"),
                              (m = null)),
                            eK(
                              (n = {
                                ...n,
                                stage: h,
                                admissions: { ...n.admissions, currentProgramId: m, results: c },
                              }),
                              `${i?.short ?? a}: ${t.label}`,
                              t.detail,
                              r,
                            )
                          );
                        }
                        case "applications":
                        case "program-select":
                        case "offer-select":
                        case "grad-applications":
                        case "ending-select":
                        case "done":
                          return n;
                        case "sequence": {
                          let e = ea.SEQUENCES[t.id] ?? ea.SEQUENCES["SEQ 1"],
                            a = "STREAM 4D" === t.id ? "STREAM 4" : t.id;
                          return eK(
                            (n = { ...n, sequenceName: a, timeline: e, stage: "scholarship" }),
                            t.label,
                            t.detail,
                            r,
                          );
                        }
                        case "scholarship": {
                          let e = (0, eb.scholarshipOutcome)(t.id),
                            a = e.savings,
                            i = e.allAxisRizz;
                          return eK(
                            (n = eF(
                              n,
                              (n = eQ({
                                ...n,
                                savings: n.savings + a,
                                rizz: i > 0 ? eT(n.rizz, [...ea.AXES], i) : n.rizz,
                                scholarshipId: e.id,
                              })),
                              e.label,
                              "BEGIN",
                            )),
                            t.label,
                            a ? `${t.detail} ${eX(a)} added to savings.` : t.detail,
                            r,
                          );
                        }
                        case "exchange-application": {
                          let e = "exchange" === t.id;
                          return (
                            (n = { ...n, exchange: { ...n.exchange, applicationRolled: !0, accepted: e } }),
                            eK(
                              (n = e ? { ...n, stage: "exchange-university" } : e5(n, "study")),
                              t.label,
                              t.detail,
                              r,
                            )
                          );
                        }
                        case "exchange-university": {
                          let e =
                            ef.EXCHANGE_UNIVERSITIES.find((e) => e.id === t.id) ??
                            ef.EXCHANGE_UNIVERSITIES[0];
                          return eK(
                            (n = e5(
                              (n = {
                                ...n,
                                exchange: { ...n.exchange, accepted: !0, universityId: e.id, pending: !0 },
                              }),
                              "study",
                            )),
                            e.name,
                            e.country,
                            r,
                          );
                        }
                        case "exchange-event": {
                          let e =
                              ef.EXCHANGE_EVENTS.find((e) => e.id === t.id) ??
                              ef.EXCHANGE_EVENTS[ef.EXCHANGE_EVENTS.length - 1],
                            a = n;
                          return (
                            (n = {
                              ...n,
                              exchange: { ...n.exchange, active: !1 },
                              savings: n.savings + (e.savings ?? 0),
                              momentum: n.momentum + (e.momentum ?? 0),
                              guaranteedAmazonOffer: n.guaranteedAmazonOffer || !!e.guaranteesAmazon,
                            }),
                            e.robbed && (n = { ...n, savings: (0, ef.savingsAfterRobbery)(n.savings) }),
                            (n = {
                              ...(n = eF(a, n, e.label)),
                              rizz: eT(n.rizz, [...ea.AXES], ef.EXCHANGE_TERM_BASELINE_RIZZ),
                            }),
                            e.allAxisRizz && (n = { ...n, rizz: eT(n.rizz, [...ea.AXES], e.allAxisRizz) }),
                            e.axes && e.axisRizz && (n = { ...n, rizz: eT(n.rizz, [...e.axes], e.axisRizz) }),
                            eK(
                              (n = e.endsRun
                                ? {
                                    ...n,
                                    status: "withdrawn",
                                    stage: "done",
                                    ending: "Got lost forever",
                                    endingCode: "lost-forever",
                                  }
                                : e3(n)),
                              e.label,
                              e.detail,
                              r,
                            )
                          );
                        }
                        case "study-grade": {
                          let a,
                            i = n,
                            l = Math.max(0, Math.min(100, Number(t.payload) + e.momentum)),
                            s = (e.average * e.studyTerms + l) / (e.studyTerms + 1),
                            o = ((a = e.consecutiveLowTerms), l < 60 ? Math.max(0, a) + 1 : 0),
                            d = e.savings - ep.TUITION_PER_STUDY_TERM,
                            c = d < ep.BANK_DEBT_LIMIT && !e.bankNoticeShown,
                            u = e.exchange.pending;
                          return (
                            (n = eF(
                              i,
                              (n = {
                                ...n,
                                average: s,
                                studyTerms: e.studyTerms + 1,
                                consecutiveLowTerms: o,
                                momentum: Math.round(0.25 * e.momentum),
                                rizz: eT(
                                  n.rizz,
                                  [...ea.AXES],
                                  l >= 90 ? 2 : l >= 85 ? 1.5 : l >= 75 ? 1 : l >= 65 ? 0.5 : 0.2,
                                ),
                                savings: d,
                                stage: u
                                  ? "exchange-event"
                                  : d < ep.BANK_DEBT_LIMIT
                                    ? "debt-job"
                                    : "term-event",
                                bankNoticeShown: e.bankNoticeShown || c,
                                bankNoticePending: c,
                                exchange: { ...e.exchange, pending: !u && e.exchange.pending, active: u },
                              }),
                              "Tuition - OSAP",
                            )),
                            o >= 2 &&
                              (n = {
                                ...n,
                                status: "expelled",
                                stage: "yc-roll",
                                ycContinuation: "academic-expulsion",
                                bankNoticePending: !1,
                              }),
                            eK(
                              n,
                              `${Math.round(l)}% term average`,
                              `${t.detail} ${eX(ep.TUITION_PER_STUDY_TERM)} tuition paid.`,
                              r,
                            )
                          );
                        }
                        case "term-event": {
                          let a = eP(e),
                            i = t.label;
                          if ("run-over" === t.id)
                            return eK(
                              (n = {
                                ...n,
                                status: "dead",
                                stage: "done",
                                ending: "sometimes life happens...",
                                endingCode: "run-over",
                              }),
                              i,
                              t.detail,
                              r,
                            );
                          if (a?.kind === "study") {
                            if ("multi-task" === t.id)
                              return eK(
                                (n = { ...n, stage: "term-event", multiTaskRollsRemaining: 2 }),
                                i,
                                t.detail,
                                r,
                              );
                            if (
                              (e.multiTaskRollsRemaining > 0 &&
                                (n = { ...n, multiTaskRollsRemaining: e.multiTaskRollsRemaining - 1 }),
                              "bad-breakup" === t.id)
                            )
                              return eK((n = { ...n, stage: "breakup" }), i, t.detail, r);
                            let a = n,
                              l = ep.STUDY_EVENT_SAVINGS[t.id] ?? 0;
                            if (
                              (0 !== l && (n = { ...n, savings: n.savings + l }),
                              (n = eF(a, n, t.label)),
                              "roommate" === t.id && (n = { ...n, momentum: n.momentum - 3 }),
                              "burnout" === t.id &&
                                (n = { ...n, momentum: n.momentum - 5, rizz: eT(n.rizz, [...ea.AXES], -2) }),
                              "concussion" === t.id &&
                                (n = { ...n, momentum: n.momentum - 8, rizz: eT(n.rizz, [...ea.AXES], -5) }),
                              "failed-course" === t.id &&
                                (n = {
                                  ...n,
                                  average: Math.max(0, n.average - 4),
                                  rizz: eT(n.rizz, [...ea.AXES], -4),
                                }),
                              "resume-lie" === t.id &&
                                (n = {
                                  ...n,
                                  integrity: es(n.integrity, 1),
                                  rizz: eT(n.rizz, [...ea.AXES], -9),
                                }),
                              "recommendation" === t.id &&
                                (n = {
                                  ...n,
                                  professorReference: !0,
                                  rizz: eT(n.rizz, ["systems", "aiData"], 2),
                                }),
                              "scholarship" === t.id)
                            ) {
                              let e = n.average >= 90 ? 2500 : n.average >= 85 ? 1500 : 750;
                              ((n = eF(
                                n,
                                (n = { ...n, savings: n.savings + e, rizz: eT(n.rizz, [...ea.AXES], 0.4) }),
                                "Upper-year scholarship",
                              )),
                                (i = `${t.label} \xb7 ${eX(e)}`));
                            }
                            if (
                              ("collab" === t.id &&
                                (n = {
                                  ...n,
                                  integrity: es(n.integrity, 1),
                                  average: Math.max(0, n.average - 2),
                                  rizz: eT(n.rizz, [...ea.AXES], -3),
                                }),
                              "exam" === t.id &&
                                (n = {
                                  ...n,
                                  integrity: es(n.integrity, 2),
                                  average: Math.max(0, n.average - 6),
                                  rizz: eT(n.rizz, [...ea.AXES], -7),
                                }),
                              "contest" === t.id && (n = { ...n, rizz: eT(n.rizz, ["quant", "aiData"], 3) }),
                              "hack-win" === t.id &&
                                (n = { ...n, rizz: eT(n.rizz, ["product", "systems", "aiData"], 5) }),
                              "join-design-team" === t.id)
                            )
                              return eK((n = { ...n, stage: "design-team" }), i, t.detail, r);
                            if (t.id.startsWith("promote:")) {
                              let e = t.id.slice(8),
                                r = n.teams.map((t) =>
                                  t.active && t.name === e
                                    ? { ...t, rank: Math.min(ea.RANKS.length - 1, t.rank + 1) }
                                    : t,
                                ),
                                a = r.find((t) => t.active && t.name === e);
                              n = {
                                ...n,
                                teams: r,
                                rizz: a ? eT(n.rizz, a.axes, 3 + a.rank) : n.rizz,
                                momentum: n.momentum - 1,
                              };
                            } else if ("hackathon" === t.id) {
                              let e = eC(n.seed, n.rngCounter, "hack-result");
                              n = eF(
                                n,
                                (n = {
                                  ...n,
                                  savings: n.savings + 1e3 * (e > 0.94),
                                  rizz: eT(
                                    n.rizz,
                                    ["product", "systems", "aiData"],
                                    e > 0.94 ? 8 : e > 0.7 ? 4 : 2,
                                  ),
                                  momentum: n.momentum - 1,
                                }),
                                "Hackathon prize",
                              );
                            } else
                              "side-project" === t.id
                                ? (n = { ...n, rizz: eT(n.rizz, ["product", "systems"], 4) })
                                : "leetcode" === t.id
                                  ? (n = {
                                      ...n,
                                      rizz: eT(n.rizz, ["systems", "quant"], 3),
                                      momentum: n.momentum - 1,
                                    })
                                  : "nothing" === t.id && (n = { ...n, rizz: eT(n.rizz, [...ea.AXES], -1) });
                            return eK(
                              (n =
                                n.integrity <= 0
                                  ? {
                                      ...n,
                                      status: "expelled",
                                      stage: "done",
                                      ending: el,
                                      endingCode: "integrity-expulsion",
                                    }
                                  : n.multiTaskRollsRemaining > 0
                                    ? { ...n, stage: "term-event" }
                                    : e3(n)),
                              i,
                              t.detail,
                              r,
                            );
                          }
                          if (a?.kind === "coop") {
                            if ("performative-multitask" === t.id)
                              return eK(
                                (n = {
                                  ...n,
                                  stage: "term-event",
                                  multiTaskRollsRemaining: 2,
                                  currentWorkEvents: [],
                                }),
                                i,
                                t.detail,
                                r,
                              );
                            let a = 0,
                              l = e.currentJob?.axes ?? ["systems"];
                            ("ship" === t.id && (a = 3),
                              "mentor" === t.id && (a = 2),
                              "tests" === t.id && ((a = 1), (l = ["systems"])),
                              "patent" === t.id && (a = 6),
                              "workaholic" === t.id && (a = 2));
                            let s = e.multiTaskRollsRemaining > 0,
                              o = s ? e.multiTaskRollsRemaining - 1 : 0,
                              d = s ? [...e.currentWorkEvents, t.id] : [t.id];
                            return eK(
                              (n = {
                                ...n,
                                rizz: eT(n.rizz, l, a),
                                currentWorkEvents: d,
                                multiTaskRollsRemaining: o,
                                stage: o > 0 ? "term-event" : "work-eval",
                              }),
                              i,
                              t.detail,
                              r,
                            );
                          }
                          if (a?.kind === "off")
                            return (
                              (n = eF(
                                n,
                                (n = { ...n, savings: n.savings + (ep.OFF_TERM_EVENT_SAVINGS[t.id] ?? 0) }),
                                t.label,
                              )),
                              "sleep" === t.id && (n = { ...n, momentum: 4 }),
                              "project" === t.id &&
                                (n = { ...n, rizz: eT(n.rizz, ["product", "systems"], 5) }),
                              "hack" === t.id &&
                                (n = { ...n, rizz: eT(n.rizz, ["product", "systems", "aiData"], 7) }),
                              "travel" === t.id && (n = { ...n, momentum: 3 }),
                              "doom" === t.id && (n = { ...n, momentum: -2 }),
                              eK((n = e5(n, "non-study")), i, t.detail, r)
                            );
                          return n;
                        }
                        case "breakup":
                          if ("ruined-life" === t.id) {
                            let e;
                            n = eF(
                              n,
                              (n = {
                                ...n,
                                rizz:
                                  ((e = n.rizz),
                                  Object.fromEntries(ea.AXES.map((t) => [t, Math.max(0, 0.7 * e[t])]))),
                                savings: (0, ep.savingsAfterBadBreakup)(n.savings),
                                integrity: es(n.integrity, 1),
                              }),
                              t.label,
                            );
                          }
                          return eK(
                            (n =
                              n.integrity <= 0
                                ? {
                                    ...n,
                                    status: "expelled",
                                    stage: "done",
                                    ending: el,
                                    endingCode: "integrity-expulsion",
                                  }
                                : n.multiTaskRollsRemaining > 0
                                  ? { ...n, stage: "term-event" }
                                  : e3(n)),
                            t.label,
                            t.detail,
                            r,
                          );
                        case "debt-job": {
                          let e = ep.FORCED_DEBT_JOBS.find((e) => e.id === t.id) ?? ep.FORCED_DEBT_JOBS[0],
                            a = (0, ep.workTermSavings)(e.hourlyWage);
                          return eK(
                            (n = e3(
                              (n = eF(
                                n,
                                (n = { ...n, savings: n.savings + a, rizz: eT(n.rizz, [...ea.AXES], -2) }),
                                `Worked at ${e.label}`,
                              )),
                            )),
                            `Worked at ${e.label}`,
                            `${eX(a)} added to savings.`,
                            r,
                          );
                        }
                        case "design-team": {
                          let e = t.id.startsWith("team:") ? t.id.slice(5) : "",
                            a = ea.TEAMS.find((t) => t.name === e);
                          if (!a || n.teams.some((e) => e.name === a.name))
                            return n.multiTaskRollsRemaining > 0 ? { ...n, stage: "term-event" } : e3(n);
                          return eK(
                            (n =
                              (n = {
                                ...n,
                                teams: [...n.teams, { name: a.name, axes: a.axes, rank: 0, active: !0 }],
                                rizz: eT(n.rizz, a.axes, 3),
                                momentum: n.momentum - 2 * (n.teams.filter((e) => e.active).length > 0),
                              }).multiTaskRollsRemaining > 0
                                ? { ...n, stage: "term-event" }
                                : e3(n)),
                            `Joined ${a.name}`,
                            `${ea.RANKS[0]} rank acquired.`,
                            r,
                          );
                        }
                        case "design-team-coop": {
                          let e = t.id.startsWith("team:") ? t.id.slice(5) : "",
                            a = ea.TEAMS.find((t) => t.name === e);
                          if (!a) return e5(n, "non-study");
                          let i = n.teams.some((e) => e.name === a.name),
                            l = i
                              ? n.teams.map((e) => (e.name === a.name ? { ...e, active: !0 } : e))
                              : [...n.teams, { name: a.name, axes: [...a.axes], rank: 0, active: !0 }];
                          return eK(
                            (n = e5(
                              (n = {
                                ...n,
                                teams: l,
                                rizz: eT(
                                  eT(n.rizz, [...ea.AXES], 1),
                                  [...a.axes],
                                  ed.DESIGN_TEAM_COOP_RIZZ_GAIN - 1,
                                ),
                                jobs: [
                                  ...n.jobs,
                                  {
                                    term: eP(n)?.label ?? "C",
                                    job: null,
                                    evaluation: `${ed.DESIGN_TEAM_COOP_EVALUATION} \xb7 ${a.name}`,
                                  },
                                ],
                              }),
                              "non-study",
                            )),
                            `${a.name} co-op`,
                            `$0 added to savings.${i ? "" : " Joined as a member."}`,
                            r,
                          );
                        }
                        case "major": {
                          let e = ea.MATH_MAJORS.find((e) => e.id === t.id) ?? ea.MATH_MAJORS[0];
                          return (
                            (n = { ...n, major: e.label, rizz: eT(n.rizz, e.delta) }),
                            eK(
                              (n = eL(n)?.kind === "coop" ? { ...n, stage: "recruit-count" } : eZ(n)),
                              e.label,
                              "Plan declared. The radar chart has been recalculated.",
                              r,
                            )
                          );
                        }
                        case "recruit-count": {
                          let e = Number(t.payload),
                            a = eG(n).length > 0 || n.guaranteedAmazonOffer;
                          return (
                            (n = {
                              ...n,
                              stage: 0 === e ? (a ? "offer-select" : "unemployed") : "recruit-job",
                              recruiting: { ...n.recruiting, target: e, completed: 0, selectedJob: null },
                            }),
                            0 !== e || a || (n = eZ({ ...n, pendingJob: null })),
                            eK(n, t.label, t.detail, r)
                          );
                        }
                        case "recruit-job": {
                          let e = ex.find((e) => e.id === t.id) ?? ex[ex.length - 1];
                          return eK(
                            (n = {
                              ...n,
                              stage: "interview",
                              recruiting: { ...n.recruiting, selectedJob: e },
                            }),
                            `${e.company} interview`,
                            `${e.role} \xb7 ${e.location} \xb7 ${(0, er.prestigeBandFor)(e.prestige)} company \xb7 ${eq(e.selectivity)} \xb7 ${Math.round(eJ(n, e))} job rizz`,
                            r,
                          );
                        }
                        case "interview": {
                          let e = n.recruiting.selectedJob;
                          if (!e) return eZ({ ...n, pendingJob: null });
                          let a = n.recruiting.completed + 1,
                            i = [...n.recruiting.interviews, { job: e, outcome: t.id }],
                            l =
                              i.filter((e) => "offer" === e.outcome).length > 0 ||
                              eG(n).length > 0 ||
                              n.guaranteedAmazonOffer;
                          return (
                            (n = {
                              ...n,
                              rizz: eT(n.rizz, e.axes, "offer" === t.id ? 0.75 : 0.2),
                              stage:
                                a >= n.recruiting.target
                                  ? l
                                    ? "offer-select"
                                    : "unemployed"
                                  : "recruit-job",
                              recruiting: { ...n.recruiting, completed: a, interviews: i, selectedJob: null },
                            }),
                            a >= n.recruiting.target && !l && (n = eZ({ ...n, pendingJob: null })),
                            eK(n, `${e.company}: ${t.label}`, t.detail, r)
                          );
                        }
                        case "work-eval": {
                          var a;
                          let e,
                            i,
                            l,
                            s = t.id,
                            o =
                              "Outstanding" === s
                                ? 6
                                : "Excellent" === s
                                  ? 4
                                  : "Very Good" === s
                                    ? 3
                                    : +("Good" === s),
                            d =
                              "Satisfactory" === s
                                ? -2
                                : "Marginal" === s
                                  ? -7
                                  : "Unsatisfactory" === s
                                    ? -12
                                    : 0,
                            c = n.currentJob,
                            u = n.currentWorkEvents,
                            m = c
                              ? ((a = c.pay),
                                (e = u.includes("fired") ? 0.35 : u.includes("layoff") ? 0.55 : 1),
                                (l = i = (0, ep.workTermSavings)(a, e)),
                                u.includes("workaholic") && (l += 1.5 * i),
                                u.includes("patent") && (l += i),
                                l)
                              : 0,
                            h = c
                              ? eT(n.rizz, [...(0, ei.specialtyCoopAxes)(c)], ei.SPECIALTY_COOP_GAIN)
                              : n.rizz,
                            g = c ? eT(h, c.axes, o) : h,
                            p = d < 0 ? eT(g, [...ea.AXES], d) : g;
                          return eK(
                            ((n = eF(
                              n,
                              (n = {
                                ...n,
                                rizz: p,
                                savings: n.savings + m,
                                jobs: [...n.jobs, { term: eP(n)?.label ?? "CO-OP", job: c, evaluation: s }],
                              }),
                              c?.company ?? "Co-op pay",
                            )),
                            (n = u.includes("dropout")
                              ? {
                                  ...n,
                                  status: "dropout",
                                  stage: "done",
                                  ending: `Dropped out for full-time at ${n.currentJob?.company ?? "the employer"}`,
                                  endingCode: "full-time",
                                  currentJob: null,
                                }
                              : c && (0, ey.returnOfferChance)(s) > 0
                                ? { ...n, stage: "return-offer" }
                                : e5({ ...n, currentJob: null }, "non-study"))),
                            `${s} performance`,
                            `${t.detail} ${eX(m)} added to savings.`,
                            r,
                          );
                        }
                        case "return-offer": {
                          let e,
                            a = n.currentJob;
                          return (
                            "return" === t.id &&
                              a &&
                              (n = {
                                ...n,
                                returnOffers:
                                  ((e = eG(n)), [...e.filter((e) => e.job.id !== a.id), { job: a }]),
                              }),
                            eK((n = e5({ ...n, currentJob: null }, "non-study")), t.label, t.detail, r)
                          );
                        }
                        case "yc-roll": {
                          if ("yc" === t.id)
                            return eK(
                              (n = eF(
                                n,
                                (n = {
                                  ...n,
                                  ycContinuation: null,
                                  status: "dropout",
                                  stage: "done",
                                  ending: "Got into YC",
                                  endingCode: "yc",
                                  savings: n.savings + ep.YC_SEED_FUNDING,
                                }),
                                "YC seed funding",
                              )),
                              t.label,
                              `${eX(ep.YC_SEED_FUNDING)} in seed funding. Moved to San Francisco.`,
                              r,
                            );
                          let a = e.ycContinuation ?? "non-study";
                          if (((n = { ...n, ycContinuation: null }), "academic-expulsion" === a))
                            return eK(
                              (n = {
                                ...n,
                                status: "expelled",
                                stage: "done",
                                ending: "maybe getting into uni was sheer luck",
                                endingCode: "academic-expulsion",
                              }),
                              t.label,
                              "The run ends.",
                              r,
                            );
                          if ("graduation" === a)
                            return eK(
                              (n = {
                                ...n,
                                status: "graduated",
                                stage: "done",
                                ending: "Open to work",
                                endingCode: "unemployed",
                              }),
                              t.label,
                              "No YC. Back on the market.",
                              r,
                            );
                          return eK((n = "study" === a ? e1(n) : e0(n)), t.label, "The degree continues.", r);
                        }
                        case "grad-admission": {
                          let a = e.gradSchool.currentId;
                          if (!a) return n;
                          let i = (0, ey.gradSchoolById)(a),
                            l = i
                              ? (0, ey.gradAdmissionProbability)(e.average, i.median, e.professorReference)
                              : 0.01,
                            s = [...e.gradSchool.results, { schoolId: a, outcome: t.id, probability: l }],
                            o = e.gradSchool.selectedIds,
                            d = o.indexOf(a),
                            c = o[d + 1] ?? null;
                          return eK(
                            (n = {
                              ...n,
                              stage: c ? "grad-admission" : "ending-select",
                              gradSchool: { ...n.gradSchool, currentId: c, results: s },
                            }),
                            `${i?.short ?? a}: ${t.label}`,
                            t.detail,
                            r,
                          );
                        }
                        case "unemployed":
                          if (
                            ((n = eF(
                              n,
                              (n = { ...n, savings: n.savings + (ep.UNEMPLOYED_TERM_SAVINGS[t.id] ?? 0) }),
                              t.label,
                            )),
                            "wea" === t.id &&
                              (n = {
                                ...n,
                                rizz: eT(n.rizz, [...ea.AXES], 0.5),
                                jobs: [
                                  ...n.jobs,
                                  {
                                    term: eP(n)?.label ?? "C",
                                    job: null,
                                    evaluation: ed.WE_ACCELERATE_EVALUATION,
                                  },
                                ],
                              }),
                            "design-team-coop" === t.id)
                          )
                            return eK(
                              (n = { ...n, stage: "design-team-coop" }),
                              t.label,
                              "Spin for the design team.",
                              r,
                            );
                          return (
                            "ra" === t.id &&
                              (n = {
                                ...n,
                                rizz: eT(n.rizz, ["aiData", "systems"], 2),
                                jobs: [
                                  ...n.jobs,
                                  { term: eP(n)?.label ?? "C", job: null, evaluation: "Research term" },
                                ],
                              }),
                            "unrelated" === t.id &&
                              (n = {
                                ...n,
                                rizz: eT(n.rizz, ["product", "systems"], 0.5),
                                jobs: [
                                  ...n.jobs,
                                  { term: eP(n)?.label ?? "C", job: null, evaluation: "Credit" },
                                ],
                              }),
                            "startup" === t.id &&
                              (n = {
                                ...n,
                                rizz: eT(n.rizz, ["product"], 1),
                                jobs: [
                                  ...n.jobs,
                                  { term: eP(n)?.label ?? "C", job: null, evaluation: "Marginal" },
                                ],
                              }),
                            "nothing" === t.id && (n = { ...n, rizz: eT(n.rizz, ["product"], 0.1) }),
                            eK((n = e5(n, "non-study")), t.label, t.detail, r)
                          );
                      }
                    })(t, e),
                  ),
                  (E.current = null),
                  o(!1),
                  (O.current = null));
              }, tw + tj)));
          }, [tw, p.length, e2, e7, tE, tj, u, s, r.bankNoticePending, r.rngCounter, r.seed, r.stage]);
          ((0, et.useEffect)(() => {
            if (
              "term-event" !== r.stage ||
              r.multiTaskRollsRemaining <= 0 ||
              s ||
              p.length > 0 ||
              r.bankNoticePending
            )
              return;
            let e = window.setTimeout(tA, 350);
            return () => window.clearTimeout(e);
          }, [p.length, tA, s, r.bankNoticePending, r.multiTaskRollsRemaining, r.stage]),
            (0, et.useEffect)(() => {
              let e = (e) => {
                "Space" !== e.code ||
                  e.target instanceof HTMLInputElement ||
                  e.target instanceof HTMLButtonElement ||
                  (e.preventDefault(), tA());
              };
              return (window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e));
            }));
          let tR = () => {
              eE();
              let e = Array.from(crypto.getRandomValues(new Uint32Array(2)))
                .map((e) => e.toString(36))
                .join("-");
              (window.history.replaceState({}, "", window.location.pathname),
                null !== M.current && window.clearTimeout(M.current),
                null !== O.current && window.clearTimeout(O.current),
                (M.current = null),
                (O.current = null),
                (E.current = null),
                o(!1),
                c(!1),
                m(0),
                g(null),
                (z.current = null),
                b([eu]),
                a(ek(e)));
            },
            tI = async () => {
              let e = `${window.location.origin}${window.location.pathname}`;
              (await navigator.clipboard.writeText(e),
                a((e) => ({
                  ...e,
                  lastResult: {
                    title: "Game link copied",
                    detail: "The generic game link is ready to share. Each visitor gets a fresh run.",
                    tone: "green",
                  },
                })));
            },
            tT = () => {
              (q(!0),
                ew(!0),
                ee(null),
                e$(r)
                  .then((e) => {
                    (Q(e), ew(!1));
                  })
                  .catch((e) => {
                    (ee(e instanceof Error ? e.message : "Leaderboard unavailable."), ew(!1));
                  }));
            };
          return i
            ? (0, n.jsxs)("main", {
                className: "game-shell",
                children: [
                  (0, n.jsxs)("header", {
                    className: "topbar",
                    children: [
                      (0, n.jsx)("div", {
                        className: "brand-block",
                        children: (0, n.jsx)("h1", { children: ec }),
                      }),
                      (0, n.jsxs)("div", {
                        className: "top-actions",
                        children: [
                          (0, n.jsxs)("div", {
                            className: "top-meta-links",
                            children: [
                              (0, n.jsxs)("button", {
                                type: "button",
                                className: `top-meta-link${x ? "" : " locked"}`,
                                title: x ? "Leaderboard" : "Complete a run to unlock Leaderboard",
                                onClick: () => {
                                  x ? tT() : j(!0);
                                },
                                children: [x ? null : (0, n.jsx)(e9, {}), "Leaderboard"],
                              }),
                              (0, n.jsxs)("button", {
                                type: "button",
                                className: `top-meta-link${x ? "" : " locked"}`,
                                title: x ? "Outcomes" : "Complete a run to unlock Outcomes",
                                onClick: () => {
                                  x ? D(!0) : j(!0);
                                },
                                children: [x ? null : (0, n.jsx)(e9, {}), "Outcomes"],
                              }),
                            ],
                          }),
                          (0, n.jsx)("button", { type: "button", onClick: tI, children: "COPY" }),
                          (0, n.jsx)("button", { type: "button", onClick: tR, children: "RESTART" }),
                          (0, n.jsx)("button", {
                            type: "button",
                            className: f ? "active" : void 0,
                            "aria-label": f ? "Unmute game audio" : "Mute game audio",
                            "aria-pressed": f,
                            onClick: () => {
                              let e = !f;
                              ((k.current = e),
                                [S.current, R.current].forEach((t) => {
                                  t && (t.muted = e);
                                }),
                                y(e));
                            },
                            children: f ? "UNMUTE" : "MUTE",
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, n.jsx)(te, { state: r }),
                  "done" === r.stage
                    ? (0, n.jsx)(tm, {
                        state: r,
                        onRestart: tR,
                        onViewStatistics: () => D(!0),
                        onViewLeaderboard: tT,
                      })
                    : (0, n.jsxs)("div", {
                        className: "game-grid",
                        children: [
                          (0, n.jsxs)("section", {
                            className: "roulette-panel",
                            children: [
                              (0, n.jsx)("div", {
                                className: "prompt-block",
                                children: (0, n.jsxs)("div", {
                                  children: [
                                    (0, n.jsx)("span", { children: tx.eyebrow }),
                                    (0, n.jsx)("h2", { children: tx.title }),
                                  ],
                                }),
                              }),
                              "applications" === r.stage
                                ? (0, n.jsx)(tl, {
                                    mainEngineeringId: r.admissions.mainEngineeringId,
                                    backupEngineeringId: r.admissions.backupEngineeringId,
                                    selectedMathProgramIds: r.admissions.selectedMathProgramIds,
                                    onChange: (e, t) => {
                                      a((n) => {
                                        if ("applications" !== n.stage) return n;
                                        let r = n.admissions,
                                          a =
                                            "math" === e
                                              ? r.selectedMathProgramIds.includes(t)
                                                ? r.selectedMathProgramIds.filter((e) => e !== t)
                                                : (0, en.applicationCount)(
                                                      r.mainEngineeringId,
                                                      r.selectedMathProgramIds,
                                                    ) < en.MAX_WATERLOO_APPLICATIONS
                                                  ? [...r.selectedMathProgramIds, t]
                                                  : r.selectedMathProgramIds
                                              : r.selectedMathProgramIds,
                                          i =
                                            "main" === e
                                              ? r.mainEngineeringId === t
                                                ? null
                                                : (0, en.applicationCount)(
                                                      r.mainEngineeringId,
                                                      r.selectedMathProgramIds,
                                                    ) < en.MAX_WATERLOO_APPLICATIONS || r.mainEngineeringId
                                                  ? t
                                                  : r.mainEngineeringId
                                              : r.mainEngineeringId,
                                          l = i
                                            ? "backup" === e
                                              ? r.backupEngineeringId === t
                                                ? null
                                                : t
                                              : t === r.backupEngineeringId
                                                ? null
                                                : r.backupEngineeringId
                                            : null;
                                        return {
                                          ...n,
                                          admissions: {
                                            ...r,
                                            mainEngineeringId: i,
                                            backupEngineeringId: l,
                                            selectedMathProgramIds: a,
                                          },
                                        };
                                      });
                                    },
                                    onSubmit: () => {
                                      a((e) =>
                                        "applications" === e.stage &&
                                        (0, en.isValidApplicationSelection)(
                                          e.admissions.mainEngineeringId,
                                          e.admissions.backupEngineeringId,
                                          e.admissions.selectedMathProgramIds,
                                        )
                                          ? {
                                              ...e,
                                              stage: "admission",
                                              lastResult: null,
                                              admissions: {
                                                ...e.admissions,
                                                currentProgramId:
                                                  e.admissions.mainEngineeringId ??
                                                  e.admissions.selectedMathProgramIds[0] ??
                                                  null,
                                                results: [],
                                              },
                                            }
                                          : e,
                                      );
                                    },
                                  })
                                : "grad-applications" === r.stage
                                  ? (0, n.jsx)(ta, {
                                      selectedIds: r.gradSchool.selectedIds,
                                      onToggle: (e) => {
                                        a((t) => {
                                          if ("grad-applications" !== t.stage) return t;
                                          let n = t.gradSchool.selectedIds,
                                            r = n.includes(e)
                                              ? n.filter((t) => t !== e)
                                              : n.length < ey.MAX_GRAD_APPLICATIONS
                                                ? [...n, e]
                                                : n;
                                          return { ...t, gradSchool: { ...t.gradSchool, selectedIds: r } };
                                        });
                                      },
                                      onSubmit: () => {
                                        a((e) =>
                                          "grad-applications" === e.stage &&
                                          (0, ey.isValidGradApplicationSelection)(e.gradSchool.selectedIds)
                                            ? {
                                                ...e,
                                                stage: "grad-admission",
                                                lastResult: null,
                                                gradSchool: {
                                                  ...e.gradSchool,
                                                  currentId: e.gradSchool.selectedIds[0] ?? null,
                                                  results: [],
                                                },
                                              }
                                            : e,
                                        );
                                      },
                                    })
                                  : "program-select" === r.stage
                                    ? (0, n.jsx)(ts, {
                                        programs: td,
                                        results: r.admissions.results,
                                        onSelect: (e) => {
                                          if (s) return;
                                          let t = td.find((t) => t.id === e);
                                          t &&
                                            (a((e) =>
                                              "program-select" !== e.stage
                                                ? e
                                                : eK(
                                                    { ...e, program: t, rizz: eI(t.rizz), stage: "sequence" },
                                                    `Accepted ${t.name}`,
                                                    "Program selected.",
                                                    "green",
                                                  ),
                                            ),
                                            b((e) => {
                                              let n;
                                              return [
                                                ...e,
                                                ((n = t.name),
                                                {
                                                  id: "program",
                                                  title: "THE ACCEPTANCE ARC",
                                                  lines: [
                                                    `Against all logic, Waterloo actually let me into ${n}.`,
                                                    "I can already feel my personality collapsing into a co-op sequence and a radar chart.",
                                                    "If this degree cannot save me from joblessness, nothing in this world can.",
                                                  ],
                                                  continueLabel: "CONTINUE",
                                                }),
                                              ];
                                            }));
                                        },
                                      })
                                    : "offer-select" === r.stage
                                      ? (0, n.jsx)(tr, {
                                          jobs: to,
                                          returnOfferIds: tc,
                                          onSelect: (e) => {
                                            s ||
                                              a((t) => {
                                                if ("offer-select" !== t.stage) return t;
                                                let n = e8(t).find((t) => t.id === e);
                                                return n
                                                  ? eK(
                                                      eZ({
                                                        ...t,
                                                        pendingJob: n,
                                                        rizz: eT(t.rizz, n.axes, 0.5),
                                                        returnOffers: e_(eG(t), n.id),
                                                        guaranteedAmazonOffer: !1,
                                                      }),
                                                      `Accepted ${n.company}`,
                                                      `${n.role} \xb7 ${n.location} \xb7 ${eY(n.pay)}.`,
                                                      "green",
                                                    )
                                                  : t;
                                              });
                                          },
                                        })
                                      : "ending-select" === r.stage
                                        ? (0, n.jsx)(ti, {
                                            choices: ty,
                                            onSelect: (e) => {
                                              s ||
                                                a((t) => {
                                                  if ("ending-select" !== t.stage) return t;
                                                  if ("yc-roll" === e)
                                                    return {
                                                      ...t,
                                                      stage: "yc-roll",
                                                      ycContinuation: "graduation",
                                                      lastResult: null,
                                                    };
                                                  if ("unemployed" === e)
                                                    return eK(
                                                      {
                                                        ...t,
                                                        status: "graduated",
                                                        stage: "done",
                                                        ending: "Open to work",
                                                        endingCode: "unemployed",
                                                      },
                                                      "Open to work",
                                                      "The degree is complete. The search is not.",
                                                      "red",
                                                    );
                                                  if ("survival-job" === e)
                                                    return eK(
                                                      {
                                                        ...t,
                                                        status: "graduated",
                                                        stage: "done",
                                                        ending: "Survival job",
                                                        endingCode: "survival-job",
                                                      },
                                                      "Survival job",
                                                      "I have student debt I have to pay off.",
                                                      "red",
                                                    );
                                                  if (e.startsWith("grad:")) {
                                                    let n = e.slice(5),
                                                      r = (0, ey.gradSchoolById)(n);
                                                    return eK(
                                                      {
                                                        ...t,
                                                        status: "graduated",
                                                        stage: "done",
                                                        ending: r ? `Masters at ${r.name}` : "Masters offer",
                                                        endingCode: e,
                                                      },
                                                      r?.name ?? "Masters",
                                                      "You accept the admit.",
                                                      "green",
                                                    );
                                                  }
                                                  if (e.startsWith("return:")) {
                                                    let n = e.slice(7),
                                                      r = eG(t).find((e) => e.job.id === n);
                                                    return r
                                                      ? eK(
                                                          {
                                                            ...t,
                                                            status: "graduated",
                                                            stage: "done",
                                                            ending: `Return offer at ${r.job.company}`,
                                                            endingCode: e,
                                                            returnOffers: e_(eG(t), n),
                                                          },
                                                          `${r.job.company} full-time`,
                                                          `${r.job.role} \xb7 ${r.job.location}.`,
                                                          "green",
                                                        )
                                                      : t;
                                                  }
                                                  return t;
                                                });
                                            },
                                          })
                                        : ej.has(r.stage)
                                          ? (0, n.jsx)(tn, {
                                              options: e7,
                                              targetIndex: h?.stage === r.stage ? h.target : null,
                                              run: h?.run ?? 0,
                                              spinning: d,
                                              busy: s,
                                              duration: tw,
                                              onSpin: tA,
                                            })
                                          : (0, n.jsx)(tt, {
                                              options: e7,
                                              rotation: u,
                                              spinning: d,
                                              busy: s,
                                              companyMode:
                                                "recruit-job" === r.stage ||
                                                "exchange-university" === r.stage,
                                              duration: tw,
                                              onSpin: tA,
                                              onBoundaryCrossing: tS,
                                            }),
                              (0, n.jsx)("div", {
                                className: `result-strip ${r.lastResult?.tone ?? "cream"}`,
                                "aria-live": "polite",
                                children: r.lastResult
                                  ? (0, n.jsx)("b", { children: r.lastResult.title })
                                  : (0, n.jsx)("b", { children: "Click above to spin" }),
                              }),
                            ],
                          }),
                          (0, n.jsx)(tu, { state: r }),
                        ],
                      }),
                  p[0] ? (0, n.jsx)(th, { scene: p[0], onContinue: () => b((e) => e.slice(1)) }) : null,
                  r.bankNoticePending
                    ? (0, n.jsx)(tg, { onContinue: () => a((e) => ({ ...e, bankNoticePending: !1 })) })
                    : null,
                  w ? (0, n.jsx)(tp, { onContinue: () => j(!1) }) : null,
                  L
                    ? (0, n.jsx)(tb, {
                        report: F,
                        error: U,
                        runs: W,
                        running: B,
                        progress: J,
                        onRunsChange: H,
                        onRun: () => {
                          (P.current?.terminate(),
                            V(!0),
                            X(W > 1e3 ? { completed: 0, total: W } : null),
                            G(null),
                            _(null));
                          let t = e.r(52990)(Worker, { type: "module" });
                          ((P.current = t),
                            (t.onmessage = (e) => {
                              let n = e.data;
                              if ("error" in n) {
                                (_(n.error),
                                  V(!1),
                                  X(null),
                                  t.terminate(),
                                  P.current === t && (P.current = null));
                                return;
                              }
                              "type" in n
                                ? X({ completed: n.completed, total: n.total })
                                : (G(n),
                                  V(!1),
                                  X(null),
                                  t.terminate(),
                                  P.current === t && (P.current = null));
                            }),
                            (t.onerror = () => {
                              (_("Simulation failed."),
                                V(!1),
                                X(null),
                                t.terminate(),
                                P.current === t && (P.current = null));
                            }),
                            t.postMessage({ runs: W }));
                        },
                        onClose: () => {
                          (P.current?.terminate(), (P.current = null), V(!1), X(null), D(!1));
                        },
                      })
                    : null,
                  Y ? (0, n.jsx)(tf, { report: K, error: Z, loading: ev, onClose: () => q(!1) }) : null,
                ],
              })
            : (0, n.jsx)("main", { className: "loading", children: "ENTERING ANOTHER WORLD…" });
        },
      ],
      53851,
    );
  },
]);
