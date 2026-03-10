/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function ($, Drupal, document, MathJax) {
  "use strict";
  Drupal.behaviors.mathjax = {
    attach: function (context, settings) {
      $(document).ajaxComplete(function () {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      });
      if (settings.mathjax.config_type === 0)
        $("body").addClass("tex2jax_ignore");
    },
  };
})(jQuery, Drupal, document, MathJax);
/* @license MIT https://github.com/michalsnik/aos/blob/master/LICENSE */
(function ($, _, Drupal, drupalSettings) {
  "use strict";
  Drupal.behaviors.scrollEffectsInit = {
    attach: function (context, settings) {
      AOS.init();
    },
  };
})(window.jQuery, window._, window.Drupal, window.drupalSettings);
/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function ($, Drupal) {
  Drupal.behaviors.betterExposedFilters = {
    attach: function (context) {
      $(".bef-tree input[type=checkbox], .bef-checkboxes input[type=checkbox]")
        .change(function () {
          _bef_highlight(this, context);
        })
        .filter(":checked")
        .closest(".form-item", context)
        .addClass("highlight");
    },
  };
  function _bef_highlight(elem, context) {
    $elem = $(elem, context);
    $elem.attr("checked")
      ? $elem.closest(".form-item", context).addClass("highlight")
      : $elem.closest(".form-item", context).removeClass("highlight");
  }
})(jQuery, Drupal);
Drupal.debounce = function (func, wait, immediate) {
  let timeout;
  let result;
  return function (...args) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};
(function ($, Drupal, once) {
  Drupal.behaviors.betterExposedFiltersAutoSubmit = {
    attach: function (context) {
      var selectors =
        "form[data-bef-auto-submit-full-form], [data-bef-auto-submit-full-form] form, [data-bef-auto-submit]";
      $(selectors, context)
        .addBack(selectors)
        .each(function (i, e) {
          var $form = $(e);
          var autoSubmitDelay = $form.data("bef-auto-submit-delay") || 500;
          $(once("bef-auto-submit", $form))
            .on("change", triggerSubmit)
            .on("keyup", Drupal.debounce(triggerSubmit, autoSubmitDelay));
        });
      function triggerSubmit(e) {
        var ignoredKeyCodes = [
          16, 17, 18, 20, 33, 34, 35, 36, 37, 38, 39, 40, 9, 13, 27,
        ];
        var $target = $(e.target);
        var $submit = $target
          .closest("form")
          .find("[data-bef-auto-submit-click]");
        if ($target.is("[data-bef-auto-submit-exclude], :submit")) return true;
        if (
          $target.is(":text:not(.hasDatepicker), textarea") &&
          $.inArray(e.keyCode, ignoredKeyCodes) === -1
        )
          $submit.click();
        else {
          if (e.type === "change") $submit.click();
        }
      }
    },
  };
})(jQuery, Drupal, once);
(function ($, once) {
  Drupal.behaviors.betterExposedFiltersSelectAllNone = {
    attach: function (context) {
      var selected = $(
        ".form-checkboxes.bef-select-all-none:not(.bef-processed)"
      );
      if (selected.length) {
        var selAll = Drupal.t("Select All");
        var selNone = Drupal.t("Select None");
        var link = $(
          '<a class="bef-toggle bef-toggle--select-all" href="#">' +
            selAll +
            "</a>"
        );
        link.click(function (event) {
          event.preventDefault();
          event.stopPropagation();
          if (selAll === $(this).text())
            $(this)
              .html(selNone)
              .removeClass("bef-toggle--select-all")
              .addClass("bef-toggle--deselect-all")
              .siblings(".bef-select-all-none, .bef-tree")
              .find("input:checkbox")
              .each(function () {
                $(this).prop("checked", true);
              })
              .end()
              .find("input[type=checkbox]:first")
              .change();
          else
            $(this)
              .html(selAll)
              .removeClass("bef-toggle--deselect-all")
              .addClass("bef-toggle--select-all")
              .siblings(".bef-select-all-none, .bef-tree")
              .find("input:checkbox")
              .each(function () {
                $(this).prop("checked", false);
              })
              .end()
              .find("input[type=checkbox]:first")
              .change();
        });
        selected.addClass("bef-processed").each(function (index) {
          var newLink = link.clone(true);
          newLink.insertBefore($(this));
          $("input:checkbox", this).click(function () {
            if ($(this).prop("checked") === true) newLink.text(selNone);
            else {
              if ($(this).prop("checked") === false) newLink.text(selAll);
            }
          });
          if (
            $("input:checkbox:checked", this).length ===
            $("input:checkbox", this).length
          )
            newLink
              .text(selNone)
              .removeClass("bef-toggle--select-all")
              .addClass("bef-toggle--deselect-all");
        });
      }
    },
  };
  Drupal.behaviors.betterExposedFiltersAllNoneNested = {
    attach: function (context, settings) {
      $(once("bef-all-none-nested", ".bef-select-all-none-nested ul li")).each(
        function () {
          var $this = $(this);
          $this.find("input:checkbox:first").change(function () {
            $(this)
              .closest("li")
              .find("ul li input:checkbox")
              .prop("checked", this.checked);
          });
          $this.find("ul input:checkbox").change(function () {
            var $this = $(this);
            var uncheckedSiblings = $this
              .closest("li")
              .siblings("li")
              .find("> div > input:checkbox:not(:checked)").length;
            if (uncheckedSiblings || !this.checked)
              $this
                .parents("ul")
                .siblings("div")
                .find("input:checkbox")
                .prop("checked", false);
            if (this.checked && !uncheckedSiblings)
              $(this)
                .closest("ul")
                .closest("li")
                .find("input:checkbox:first")
                .prop("checked", true)
                .change();
          });
        }
      );
    },
  };
})(jQuery, once);
/* @license MIT https://github.com/select2/select2/blob/master/LICENSE.md */
/*! Select2 4.0.13 | https://github.com/select2/select2/blob/master/LICENSE.md */
!(function (n) {
  "function" == typeof define && define.amd
    ? define(["jquery"], n)
    : "object" == typeof module && module.exports
    ? (module.exports = function (e, t) {
        return (
          void 0 === t &&
            (t =
              "undefined" != typeof window
                ? require("jquery")
                : require("jquery")(e)),
          n(t),
          t
        );
      })
    : n(jQuery);
})(function (u) {
  var e = (function () {
      if (u && u.fn && u.fn.select2 && u.fn.select2.amd)
        var e = u.fn.select2.amd;
      var t, n, r, h, o, s, f, g, m, v, y, _, i, a, b;
      function w(e, t) {
        return i.call(e, t);
      }
      function l(e, t) {
        var n,
          r,
          i,
          o,
          s,
          a,
          l,
          c,
          u,
          d,
          p,
          h = t && t.split("/"),
          f = y.map,
          g = (f && f["*"]) || {};
        if (e) {
          for (
            s = (e = e.split("/")).length - 1,
              y.nodeIdCompat && b.test(e[s]) && (e[s] = e[s].replace(b, "")),
              "." === e[0].charAt(0) &&
                h &&
                (e = h.slice(0, h.length - 1).concat(e)),
              u = 0;
            u < e.length;
            u++
          )
            if ("." === (p = e[u])) e.splice(u, 1), --u;
            else if (".." === p) {
              if (0 === u || (1 === u && ".." === e[2]) || ".." === e[u - 1])
                continue;
              0 < u && (e.splice(u - 1, 2), (u -= 2));
            }
          e = e.join("/");
        }
        if ((h || g) && f) {
          for (u = (n = e.split("/")).length; 0 < u; --u) {
            if (((r = n.slice(0, u).join("/")), h))
              for (d = h.length; 0 < d; --d)
                if ((i = (i = f[h.slice(0, d).join("/")]) && i[r])) {
                  (o = i), (a = u);
                  break;
                }
            if (o) break;
            !l && g && g[r] && ((l = g[r]), (c = u));
          }
          !o && l && ((o = l), (a = c)),
            o && (n.splice(0, a, o), (e = n.join("/")));
        }
        return e;
      }
      function A(t, n) {
        return function () {
          var e = a.call(arguments, 0);
          return (
            "string" != typeof e[0] && 1 === e.length && e.push(null),
            s.apply(h, e.concat([t, n]))
          );
        };
      }
      function x(t) {
        return function (e) {
          m[t] = e;
        };
      }
      function D(e) {
        if (w(v, e)) {
          var t = v[e];
          delete v[e], (_[e] = !0), o.apply(h, t);
        }
        if (!w(m, e) && !w(_, e)) throw new Error("No " + e);
        return m[e];
      }
      function c(e) {
        var t,
          n = e ? e.indexOf("!") : -1;
        return (
          -1 < n &&
            ((t = e.substring(0, n)), (e = e.substring(n + 1, e.length))),
          [t, e]
        );
      }
      function S(e) {
        return e ? c(e) : [];
      }
      return (
        (e && e.requirejs) ||
          (e ? (n = e) : (e = {}),
          (m = {}),
          (v = {}),
          (y = {}),
          (_ = {}),
          (i = Object.prototype.hasOwnProperty),
          (a = [].slice),
          (b = /\.js$/),
          (f = function (e, t) {
            var n,
              r,
              i = c(e),
              o = i[0],
              s = t[1];
            return (
              (e = i[1]),
              o && (n = D((o = l(o, s)))),
              o
                ? (e =
                    n && n.normalize
                      ? n.normalize(
                          e,
                          ((r = s),
                          function (e) {
                            return l(e, r);
                          })
                        )
                      : l(e, s))
                : ((o = (i = c((e = l(e, s))))[0]),
                  (e = i[1]),
                  o && (n = D(o))),
              { f: o ? o + "!" + e : e, n: e, pr: o, p: n }
            );
          }),
          (g = {
            require: function (e) {
              return A(e);
            },
            exports: function (e) {
              var t = m[e];
              return void 0 !== t ? t : (m[e] = {});
            },
            module: function (e) {
              return {
                id: e,
                uri: "",
                exports: m[e],
                config:
                  ((t = e),
                  function () {
                    return (y && y.config && y.config[t]) || {};
                  }),
              };
              var t;
            },
          }),
          (o = function (e, t, n, r) {
            var i,
              o,
              s,
              a,
              l,
              c,
              u,
              d = [],
              p = typeof n;
            if (((c = S((r = r || e))), "undefined" == p || "function" == p)) {
              for (
                t =
                  !t.length && n.length ? ["require", "exports", "module"] : t,
                  l = 0;
                l < t.length;
                l += 1
              )
                if ("require" === (o = (a = f(t[l], c)).f)) d[l] = g.require(e);
                else if ("exports" === o) (d[l] = g.exports(e)), (u = !0);
                else if ("module" === o) i = d[l] = g.module(e);
                else if (w(m, o) || w(v, o) || w(_, o)) d[l] = D(o);
                else {
                  if (!a.p) throw new Error(e + " missing " + o);
                  a.p.load(a.n, A(r, !0), x(o), {}), (d[l] = m[o]);
                }
              (s = n ? n.apply(m[e], d) : void 0),
                e &&
                  (i && i.exports !== h && i.exports !== m[e]
                    ? (m[e] = i.exports)
                    : (s === h && u) || (m[e] = s));
            } else e && (m[e] = n);
          }),
          (t =
            n =
            s =
              function (e, t, n, r, i) {
                if ("string" == typeof e)
                  return g[e] ? g[e](t) : D(f(e, S(t)).f);
                if (!e.splice) {
                  if (((y = e).deps && s(y.deps, y.callback), !t)) return;
                  t.splice ? ((e = t), (t = n), (n = null)) : (e = h);
                }
                return (
                  (t = t || function () {}),
                  "function" == typeof n && ((n = r), (r = i)),
                  r
                    ? o(h, e, t, n)
                    : setTimeout(function () {
                        o(h, e, t, n);
                      }, 4),
                  s
                );
              }),
          (s.config = function (e) {
            return s(e);
          }),
          (t._defined = m),
          ((r = function (e, t, n) {
            if ("string" != typeof e)
              throw new Error(
                "See almond README: incorrect module build, no module name"
              );
            t.splice || ((n = t), (t = [])),
              w(m, e) || w(v, e) || (v[e] = [e, t, n]);
          }).amd = { jQuery: !0 }),
          (e.requirejs = t),
          (e.require = n),
          (e.define = r)),
        e.define("almond", function () {}),
        e.define("jquery", [], function () {
          var e = u || $;
          return (
            null == e &&
              console &&
              console.error &&
              console.error(
                "Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."
              ),
            e
          );
        }),
        e.define("select2/utils", ["jquery"], function (o) {
          var i = {};
          function u(e) {
            var t = e.prototype,
              n = [];
            for (var r in t) {
              "function" == typeof t[r] && "constructor" !== r && n.push(r);
            }
            return n;
          }
          (i.Extend = function (e, t) {
            var n = {}.hasOwnProperty;
            function r() {
              this.constructor = e;
            }
            for (var i in t) n.call(t, i) && (e[i] = t[i]);
            return (
              (r.prototype = t.prototype),
              (e.prototype = new r()),
              (e.__super__ = t.prototype),
              e
            );
          }),
            (i.Decorate = function (r, i) {
              var e = u(i),
                t = u(r);
              function o() {
                var e = Array.prototype.unshift,
                  t = i.prototype.constructor.length,
                  n = r.prototype.constructor;
                0 < t &&
                  (e.call(arguments, r.prototype.constructor),
                  (n = i.prototype.constructor)),
                  n.apply(this, arguments);
              }
              (i.displayName = r.displayName),
                (o.prototype = new (function () {
                  this.constructor = o;
                })());
              for (var n = 0; n < t.length; n++) {
                var s = t[n];
                o.prototype[s] = r.prototype[s];
              }
              function a(e) {
                var t = function () {};
                e in o.prototype && (t = o.prototype[e]);
                var n = i.prototype[e];
                return function () {
                  return (
                    Array.prototype.unshift.call(arguments, t),
                    n.apply(this, arguments)
                  );
                };
              }
              for (var l = 0; l < e.length; l++) {
                var c = e[l];
                o.prototype[c] = a(c);
              }
              return o;
            });
          function e() {
            this.listeners = {};
          }
          (e.prototype.on = function (e, t) {
            (this.listeners = this.listeners || {}),
              e in this.listeners
                ? this.listeners[e].push(t)
                : (this.listeners[e] = [t]);
          }),
            (e.prototype.trigger = function (e) {
              var t = Array.prototype.slice,
                n = t.call(arguments, 1);
              (this.listeners = this.listeners || {}),
                null == n && (n = []),
                0 === n.length && n.push({}),
                (n[0]._type = e) in this.listeners &&
                  this.invoke(this.listeners[e], t.call(arguments, 1)),
                "*" in this.listeners &&
                  this.invoke(this.listeners["*"], arguments);
            }),
            (e.prototype.invoke = function (e, t) {
              for (var n = 0, r = e.length; n < r; n++) e[n].apply(this, t);
            }),
            (i.Observable = e),
            (i.generateChars = function (e) {
              for (var t = "", n = 0; n < e; n++) {
                t += Math.floor(36 * Math.random()).toString(36);
              }
              return t;
            }),
            (i.bind = function (e, t) {
              return function () {
                e.apply(t, arguments);
              };
            }),
            (i._convertData = function (e) {
              for (var t in e) {
                var n = t.split("-"),
                  r = e;
                if (1 !== n.length) {
                  for (var i = 0; i < n.length; i++) {
                    var o = n[i];
                    (o = o.substring(0, 1).toLowerCase() + o.substring(1)) in
                      r || (r[o] = {}),
                      i == n.length - 1 && (r[o] = e[t]),
                      (r = r[o]);
                  }
                  delete e[t];
                }
              }
              return e;
            }),
            (i.hasScroll = function (e, t) {
              var n = o(t),
                r = t.style.overflowX,
                i = t.style.overflowY;
              return (
                (r !== i || ("hidden" !== i && "visible" !== i)) &&
                ("scroll" === r ||
                  "scroll" === i ||
                  n.innerHeight() < t.scrollHeight ||
                  n.innerWidth() < t.scrollWidth)
              );
            }),
            (i.escapeMarkup = function (e) {
              var t = {
                "\\": "&#92;",
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#47;",
              };
              return "string" != typeof e
                ? e
                : String(e).replace(/[&<>"'\/\\]/g, function (e) {
                    return t[e];
                  });
            }),
            (i.appendMany = function (e, t) {
              if ("1.7" === o.fn.jquery.substr(0, 3)) {
                var n = o();
                o.map(t, function (e) {
                  n = n.add(e);
                }),
                  (t = n);
              }
              e.append(t);
            }),
            (i.__cache = {});
          var n = 0;
          return (
            (i.GetUniqueElementId = function (e) {
              var t = e.getAttribute("data-select2-id");
              return (
                null == t &&
                  (e.id
                    ? ((t = e.id), e.setAttribute("data-select2-id", t))
                    : (e.setAttribute("data-select2-id", ++n),
                      (t = n.toString()))),
                t
              );
            }),
            (i.StoreData = function (e, t, n) {
              var r = i.GetUniqueElementId(e);
              i.__cache[r] || (i.__cache[r] = {}), (i.__cache[r][t] = n);
            }),
            (i.GetData = function (e, t) {
              var n = i.GetUniqueElementId(e);
              return t
                ? i.__cache[n] && null != i.__cache[n][t]
                  ? i.__cache[n][t]
                  : o(e).data(t)
                : i.__cache[n];
            }),
            (i.RemoveData = function (e) {
              var t = i.GetUniqueElementId(e);
              null != i.__cache[t] && delete i.__cache[t],
                e.removeAttribute("data-select2-id");
            }),
            i
          );
        }),
        e.define("select2/results", ["jquery", "./utils"], function (h, f) {
          function r(e, t, n) {
            (this.$element = e),
              (this.data = n),
              (this.options = t),
              r.__super__.constructor.call(this);
          }
          return (
            f.Extend(r, f.Observable),
            (r.prototype.render = function () {
              var e = h(
                '<ul class="select2-results__options" role="listbox"></ul>'
              );
              return (
                this.options.get("multiple") &&
                  e.attr("aria-multiselectable", "true"),
                (this.$results = e)
              );
            }),
            (r.prototype.clear = function () {
              this.$results.empty();
            }),
            (r.prototype.displayMessage = function (e) {
              var t = this.options.get("escapeMarkup");
              this.clear(), this.hideLoading();
              var n = h(
                  '<li role="alert" aria-live="assertive" class="select2-results__option"></li>'
                ),
                r = this.options.get("translations").get(e.message);
              n.append(t(r(e.args))),
                (n[0].className += " select2-results__message"),
                this.$results.append(n);
            }),
            (r.prototype.hideMessages = function () {
              this.$results.find(".select2-results__message").remove();
            }),
            (r.prototype.append = function (e) {
              this.hideLoading();
              var t = [];
              if (null != e.results && 0 !== e.results.length) {
                e.results = this.sort(e.results);
                for (var n = 0; n < e.results.length; n++) {
                  var r = e.results[n],
                    i = this.option(r);
                  t.push(i);
                }
                this.$results.append(t);
              } else
                0 === this.$results.children().length &&
                  this.trigger("results:message", { message: "noResults" });
            }),
            (r.prototype.position = function (e, t) {
              t.find(".select2-results").append(e);
            }),
            (r.prototype.sort = function (e) {
              return this.options.get("sorter")(e);
            }),
            (r.prototype.highlightFirstItem = function () {
              var e = this.$results.find(
                  ".select2-results__option[aria-selected]"
                ),
                t = e.filter("[aria-selected=true]");
              0 < t.length
                ? t.first().trigger("mouseenter")
                : e.first().trigger("mouseenter"),
                this.ensureHighlightVisible();
            }),
            (r.prototype.setClasses = function () {
              var t = this;
              this.data.current(function (e) {
                var r = h.map(e, function (e) {
                  return e.id.toString();
                });
                t.$results
                  .find(".select2-results__option[aria-selected]")
                  .each(function () {
                    var e = h(this),
                      t = f.GetData(this, "data"),
                      n = "" + t.id;
                    (null != t.element && t.element.selected) ||
                    (null == t.element && -1 < h.inArray(n, r))
                      ? e.attr("aria-selected", "true")
                      : e.attr("aria-selected", "false");
                  });
              });
            }),
            (r.prototype.showLoading = function (e) {
              this.hideLoading();
              var t = {
                  disabled: !0,
                  loading: !0,
                  text: this.options.get("translations").get("searching")(e),
                },
                n = this.option(t);
              (n.className += " loading-results"), this.$results.prepend(n);
            }),
            (r.prototype.hideLoading = function () {
              this.$results.find(".loading-results").remove();
            }),
            (r.prototype.option = function (e) {
              var t = document.createElement("li");
              t.className = "select2-results__option";
              var n = { role: "option", "aria-selected": "false" },
                r =
                  window.Element.prototype.matches ||
                  window.Element.prototype.msMatchesSelector ||
                  window.Element.prototype.webkitMatchesSelector;
              for (var i in (((null != e.element &&
                r.call(e.element, ":disabled")) ||
                (null == e.element && e.disabled)) &&
                (delete n["aria-selected"], (n["aria-disabled"] = "true")),
              null == e.id && delete n["aria-selected"],
              null != e._resultId && (t.id = e._resultId),
              e.title && (t.title = e.title),
              e.children &&
                ((n.role = "group"),
                (n["aria-label"] = e.text),
                delete n["aria-selected"]),
              n)) {
                var o = n[i];
                t.setAttribute(i, o);
              }
              if (e.children) {
                var s = h(t),
                  a = document.createElement("strong");
                a.className = "select2-results__group";
                h(a);
                this.template(e, a);
                for (var l = [], c = 0; c < e.children.length; c++) {
                  var u = e.children[c],
                    d = this.option(u);
                  l.push(d);
                }
                var p = h("<ul></ul>", {
                  class:
                    "select2-results__options select2-results__options--nested",
                });
                p.append(l), s.append(a), s.append(p);
              } else this.template(e, t);
              return f.StoreData(t, "data", e), t;
            }),
            (r.prototype.bind = function (t, e) {
              var l = this,
                n = t.id + "-results";
              this.$results.attr("id", n),
                t.on("results:all", function (e) {
                  l.clear(),
                    l.append(e.data),
                    t.isOpen() && (l.setClasses(), l.highlightFirstItem());
                }),
                t.on("results:append", function (e) {
                  l.append(e.data), t.isOpen() && l.setClasses();
                }),
                t.on("query", function (e) {
                  l.hideMessages(), l.showLoading(e);
                }),
                t.on("select", function () {
                  t.isOpen() &&
                    (l.setClasses(),
                    l.options.get("scrollAfterSelect") &&
                      l.highlightFirstItem());
                }),
                t.on("unselect", function () {
                  t.isOpen() &&
                    (l.setClasses(),
                    l.options.get("scrollAfterSelect") &&
                      l.highlightFirstItem());
                }),
                t.on("open", function () {
                  l.$results.attr("aria-expanded", "true"),
                    l.$results.attr("aria-hidden", "false"),
                    l.setClasses(),
                    l.ensureHighlightVisible();
                }),
                t.on("close", function () {
                  l.$results.attr("aria-expanded", "false"),
                    l.$results.attr("aria-hidden", "true"),
                    l.$results.removeAttr("aria-activedescendant");
                }),
                t.on("results:toggle", function () {
                  var e = l.getHighlightedResults();
                  0 !== e.length && e.trigger("mouseup");
                }),
                t.on("results:select", function () {
                  var e = l.getHighlightedResults();
                  if (0 !== e.length) {
                    var t = f.GetData(e[0], "data");
                    "true" == e.attr("aria-selected")
                      ? l.trigger("close", {})
                      : l.trigger("select", { data: t });
                  }
                }),
                t.on("results:previous", function () {
                  var e = l.getHighlightedResults(),
                    t = l.$results.find("[aria-selected]"),
                    n = t.index(e);
                  if (!(n <= 0)) {
                    var r = n - 1;
                    0 === e.length && (r = 0);
                    var i = t.eq(r);
                    i.trigger("mouseenter");
                    var o = l.$results.offset().top,
                      s = i.offset().top,
                      a = l.$results.scrollTop() + (s - o);
                    0 === r
                      ? l.$results.scrollTop(0)
                      : s - o < 0 && l.$results.scrollTop(a);
                  }
                }),
                t.on("results:next", function () {
                  var e = l.getHighlightedResults(),
                    t = l.$results.find("[aria-selected]"),
                    n = t.index(e) + 1;
                  if (!(n >= t.length)) {
                    var r = t.eq(n);
                    r.trigger("mouseenter");
                    var i =
                        l.$results.offset().top + l.$results.outerHeight(!1),
                      o = r.offset().top + r.outerHeight(!1),
                      s = l.$results.scrollTop() + o - i;
                    0 === n
                      ? l.$results.scrollTop(0)
                      : i < o && l.$results.scrollTop(s);
                  }
                }),
                t.on("results:focus", function (e) {
                  e.element.addClass("select2-results__option--highlighted");
                }),
                t.on("results:message", function (e) {
                  l.displayMessage(e);
                }),
                h.fn.mousewheel &&
                  this.$results.on("mousewheel", function (e) {
                    var t = l.$results.scrollTop(),
                      n = l.$results.get(0).scrollHeight - t + e.deltaY,
                      r = 0 < e.deltaY && t - e.deltaY <= 0,
                      i = e.deltaY < 0 && n <= l.$results.height();
                    r
                      ? (l.$results.scrollTop(0),
                        e.preventDefault(),
                        e.stopPropagation())
                      : i &&
                        (l.$results.scrollTop(
                          l.$results.get(0).scrollHeight - l.$results.height()
                        ),
                        e.preventDefault(),
                        e.stopPropagation());
                  }),
                this.$results.on(
                  "mouseup",
                  ".select2-results__option[aria-selected]",
                  function (e) {
                    var t = h(this),
                      n = f.GetData(this, "data");
                    "true" !== t.attr("aria-selected")
                      ? l.trigger("select", { originalEvent: e, data: n })
                      : l.options.get("multiple")
                      ? l.trigger("unselect", { originalEvent: e, data: n })
                      : l.trigger("close", {});
                  }
                ),
                this.$results.on(
                  "mouseenter",
                  ".select2-results__option[aria-selected]",
                  function (e) {
                    var t = f.GetData(this, "data");
                    l
                      .getHighlightedResults()
                      .removeClass("select2-results__option--highlighted"),
                      l.trigger("results:focus", { data: t, element: h(this) });
                  }
                );
            }),
            (r.prototype.getHighlightedResults = function () {
              return this.$results.find(
                ".select2-results__option--highlighted"
              );
            }),
            (r.prototype.destroy = function () {
              this.$results.remove();
            }),
            (r.prototype.ensureHighlightVisible = function () {
              var e = this.getHighlightedResults();
              if (0 !== e.length) {
                var t = this.$results.find("[aria-selected]").index(e),
                  n = this.$results.offset().top,
                  r = e.offset().top,
                  i = this.$results.scrollTop() + (r - n),
                  o = r - n;
                (i -= 2 * e.outerHeight(!1)),
                  t <= 2
                    ? this.$results.scrollTop(0)
                    : (o > this.$results.outerHeight() || o < 0) &&
                      this.$results.scrollTop(i);
              }
            }),
            (r.prototype.template = function (e, t) {
              var n = this.options.get("templateResult"),
                r = this.options.get("escapeMarkup"),
                i = n(e, t);
              null == i
                ? (t.style.display = "none")
                : "string" == typeof i
                ? (t.innerHTML = r(i))
                : h(t).append(i);
            }),
            r
          );
        }),
        e.define("select2/keys", [], function () {
          return {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46,
          };
        }),
        e.define(
          "select2/selection/base",
          ["jquery", "../utils", "../keys"],
          function (n, r, i) {
            function o(e, t) {
              (this.$element = e),
                (this.options = t),
                o.__super__.constructor.call(this);
            }
            return (
              r.Extend(o, r.Observable),
              (o.prototype.render = function () {
                var e = n(
                  '<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>'
                );
                return (
                  (this._tabindex = 0),
                  null != r.GetData(this.$element[0], "old-tabindex")
                    ? (this._tabindex = r.GetData(
                        this.$element[0],
                        "old-tabindex"
                      ))
                    : null != this.$element.attr("tabindex") &&
                      (this._tabindex = this.$element.attr("tabindex")),
                  e.attr("title", this.$element.attr("title")),
                  e.attr("tabindex", this._tabindex),
                  e.attr("aria-disabled", "false"),
                  (this.$selection = e)
                );
              }),
              (o.prototype.bind = function (e, t) {
                var n = this,
                  r = e.id + "-results";
                (this.container = e),
                  this.$selection.on("focus", function (e) {
                    n.trigger("focus", e);
                  }),
                  this.$selection.on("blur", function (e) {
                    n._handleBlur(e);
                  }),
                  this.$selection.on("keydown", function (e) {
                    n.trigger("keypress", e),
                      e.which === i.SPACE && e.preventDefault();
                  }),
                  e.on("results:focus", function (e) {
                    n.$selection.attr(
                      "aria-activedescendant",
                      e.data._resultId
                    );
                  }),
                  e.on("selection:update", function (e) {
                    n.update(e.data);
                  }),
                  e.on("open", function () {
                    n.$selection.attr("aria-expanded", "true"),
                      n.$selection.attr("aria-owns", r),
                      n._attachCloseHandler(e);
                  }),
                  e.on("close", function () {
                    n.$selection.attr("aria-expanded", "false"),
                      n.$selection.removeAttr("aria-activedescendant"),
                      n.$selection.removeAttr("aria-owns"),
                      n.$selection.trigger("focus"),
                      n._detachCloseHandler(e);
                  }),
                  e.on("enable", function () {
                    n.$selection.attr("tabindex", n._tabindex),
                      n.$selection.attr("aria-disabled", "false");
                  }),
                  e.on("disable", function () {
                    n.$selection.attr("tabindex", "-1"),
                      n.$selection.attr("aria-disabled", "true");
                  });
              }),
              (o.prototype._handleBlur = function (e) {
                var t = this;
                window.setTimeout(function () {
                  document.activeElement == t.$selection[0] ||
                    n.contains(t.$selection[0], document.activeElement) ||
                    t.trigger("blur", e);
                }, 1);
              }),
              (o.prototype._attachCloseHandler = function (e) {
                n(document.body).on("mousedown.select2." + e.id, function (e) {
                  var t = n(e.target).closest(".select2");
                  n(".select2.select2-container--open").each(function () {
                    this != t[0] && r.GetData(this, "element").select2("close");
                  });
                });
              }),
              (o.prototype._detachCloseHandler = function (e) {
                n(document.body).off("mousedown.select2." + e.id);
              }),
              (o.prototype.position = function (e, t) {
                t.find(".selection").append(e);
              }),
              (o.prototype.destroy = function () {
                this._detachCloseHandler(this.container);
              }),
              (o.prototype.update = function (e) {
                throw new Error(
                  "The `update` method must be defined in child classes."
                );
              }),
              (o.prototype.isEnabled = function () {
                return !this.isDisabled();
              }),
              (o.prototype.isDisabled = function () {
                return this.options.get("disabled");
              }),
              o
            );
          }
        ),
        e.define(
          "select2/selection/single",
          ["jquery", "./base", "../utils", "../keys"],
          function (e, t, n, r) {
            function i() {
              i.__super__.constructor.apply(this, arguments);
            }
            return (
              n.Extend(i, t),
              (i.prototype.render = function () {
                var e = i.__super__.render.call(this);
                return (
                  e.addClass("select2-selection--single"),
                  e.html(
                    '<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'
                  ),
                  e
                );
              }),
              (i.prototype.bind = function (t, e) {
                var n = this;
                i.__super__.bind.apply(this, arguments);
                var r = t.id + "-container";
                this.$selection
                  .find(".select2-selection__rendered")
                  .attr("id", r)
                  .attr("role", "textbox")
                  .attr("aria-readonly", "true"),
                  this.$selection.attr("aria-labelledby", r),
                  this.$selection.on("mousedown", function (e) {
                    1 === e.which && n.trigger("toggle", { originalEvent: e });
                  }),
                  this.$selection.on("focus", function (e) {}),
                  this.$selection.on("blur", function (e) {}),
                  t.on("focus", function (e) {
                    t.isOpen() || n.$selection.trigger("focus");
                  });
              }),
              (i.prototype.clear = function () {
                var e = this.$selection.find(".select2-selection__rendered");
                e.empty(), e.removeAttr("title");
              }),
              (i.prototype.display = function (e, t) {
                var n = this.options.get("templateSelection");
                return this.options.get("escapeMarkup")(n(e, t));
              }),
              (i.prototype.selectionContainer = function () {
                return e("<span></span>");
              }),
              (i.prototype.update = function (e) {
                if (0 !== e.length) {
                  var t = e[0],
                    n = this.$selection.find(".select2-selection__rendered"),
                    r = this.display(t, n);
                  n.empty().append(r);
                  var i = t.title || t.text;
                  i ? n.attr("title", i) : n.removeAttr("title");
                } else this.clear();
              }),
              i
            );
          }
        ),
        e.define(
          "select2/selection/multiple",
          ["jquery", "./base", "../utils"],
          function (i, e, l) {
            function n(e, t) {
              n.__super__.constructor.apply(this, arguments);
            }
            return (
              l.Extend(n, e),
              (n.prototype.render = function () {
                var e = n.__super__.render.call(this);
                return (
                  e.addClass("select2-selection--multiple"),
                  e.html('<ul class="select2-selection__rendered"></ul>'),
                  e
                );
              }),
              (n.prototype.bind = function (e, t) {
                var r = this;
                n.__super__.bind.apply(this, arguments),
                  this.$selection.on("click", function (e) {
                    r.trigger("toggle", { originalEvent: e });
                  }),
                  this.$selection.on(
                    "click",
                    ".select2-selection__choice__remove",
                    function (e) {
                      if (!r.isDisabled()) {
                        var t = i(this).parent(),
                          n = l.GetData(t[0], "data");
                        r.trigger("unselect", { originalEvent: e, data: n });
                      }
                    }
                  );
              }),
              (n.prototype.clear = function () {
                var e = this.$selection.find(".select2-selection__rendered");
                e.empty(), e.removeAttr("title");
              }),
              (n.prototype.display = function (e, t) {
                var n = this.options.get("templateSelection");
                return this.options.get("escapeMarkup")(n(e, t));
              }),
              (n.prototype.selectionContainer = function () {
                return i(
                  '<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>'
                );
              }),
              (n.prototype.update = function (e) {
                if ((this.clear(), 0 !== e.length)) {
                  for (var t = [], n = 0; n < e.length; n++) {
                    var r = e[n],
                      i = this.selectionContainer(),
                      o = this.display(r, i);
                    i.append(o);
                    var s = r.title || r.text;
                    s && i.attr("title", s),
                      l.StoreData(i[0], "data", r),
                      t.push(i);
                  }
                  var a = this.$selection.find(".select2-selection__rendered");
                  l.appendMany(a, t);
                }
              }),
              n
            );
          }
        ),
        e.define("select2/selection/placeholder", ["../utils"], function (e) {
          function t(e, t, n) {
            (this.placeholder = this.normalizePlaceholder(
              n.get("placeholder")
            )),
              e.call(this, t, n);
          }
          return (
            (t.prototype.normalizePlaceholder = function (e, t) {
              return "string" == typeof t && (t = { id: "", text: t }), t;
            }),
            (t.prototype.createPlaceholder = function (e, t) {
              var n = this.selectionContainer();
              return (
                n.html(this.display(t)),
                n
                  .addClass("select2-selection__placeholder")
                  .removeClass("select2-selection__choice"),
                n
              );
            }),
            (t.prototype.update = function (e, t) {
              var n = 1 == t.length && t[0].id != this.placeholder.id;
              if (1 < t.length || n) return e.call(this, t);
              this.clear();
              var r = this.createPlaceholder(this.placeholder);
              this.$selection.find(".select2-selection__rendered").append(r);
            }),
            t
          );
        }),
        e.define(
          "select2/selection/allowClear",
          ["jquery", "../keys", "../utils"],
          function (i, r, a) {
            function e() {}
            return (
              (e.prototype.bind = function (e, t, n) {
                var r = this;
                e.call(this, t, n),
                  null == this.placeholder &&
                    this.options.get("debug") &&
                    window.console &&
                    console.error &&
                    console.error(
                      "Select2: The `allowClear` option should be used in combination with the `placeholder` option."
                    ),
                  this.$selection.on(
                    "mousedown",
                    ".select2-selection__clear",
                    function (e) {
                      r._handleClear(e);
                    }
                  ),
                  t.on("keypress", function (e) {
                    r._handleKeyboardClear(e, t);
                  });
              }),
              (e.prototype._handleClear = function (e, t) {
                if (!this.isDisabled()) {
                  var n = this.$selection.find(".select2-selection__clear");
                  if (0 !== n.length) {
                    t.stopPropagation();
                    var r = a.GetData(n[0], "data"),
                      i = this.$element.val();
                    this.$element.val(this.placeholder.id);
                    var o = { data: r };
                    if ((this.trigger("clear", o), o.prevented))
                      this.$element.val(i);
                    else {
                      for (var s = 0; s < r.length; s++)
                        if (
                          ((o = { data: r[s] }),
                          this.trigger("unselect", o),
                          o.prevented)
                        )
                          return void this.$element.val(i);
                      this.$element.trigger("input").trigger("change"),
                        this.trigger("toggle", {});
                    }
                  }
                }
              }),
              (e.prototype._handleKeyboardClear = function (e, t, n) {
                n.isOpen() ||
                  (t.which != r.DELETE && t.which != r.BACKSPACE) ||
                  this._handleClear(t);
              }),
              (e.prototype.update = function (e, t) {
                if (
                  (e.call(this, t),
                  !(
                    0 <
                      this.$selection.find(".select2-selection__placeholder")
                        .length || 0 === t.length
                  ))
                ) {
                  var n = this.options
                      .get("translations")
                      .get("removeAllItems"),
                    r = i(
                      '<span class="select2-selection__clear" title="' +
                        n() +
                        '">&times;</span>'
                    );
                  a.StoreData(r[0], "data", t),
                    this.$selection
                      .find(".select2-selection__rendered")
                      .prepend(r);
                }
              }),
              e
            );
          }
        ),
        e.define(
          "select2/selection/search",
          ["jquery", "../utils", "../keys"],
          function (r, a, l) {
            function e(e, t, n) {
              e.call(this, t, n);
            }
            return (
              (e.prototype.render = function (e) {
                var t = r(
                  '<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></li>'
                );
                (this.$searchContainer = t), (this.$search = t.find("input"));
                var n = e.call(this);
                return this._transferTabIndex(), n;
              }),
              (e.prototype.bind = function (e, t, n) {
                var r = this,
                  i = t.id + "-results";
                e.call(this, t, n),
                  t.on("open", function () {
                    r.$search.attr("aria-controls", i),
                      r.$search.trigger("focus");
                  }),
                  t.on("close", function () {
                    r.$search.val(""),
                      r.$search.removeAttr("aria-controls"),
                      r.$search.removeAttr("aria-activedescendant"),
                      r.$search.trigger("focus");
                  }),
                  t.on("enable", function () {
                    r.$search.prop("disabled", !1), r._transferTabIndex();
                  }),
                  t.on("disable", function () {
                    r.$search.prop("disabled", !0);
                  }),
                  t.on("focus", function (e) {
                    r.$search.trigger("focus");
                  }),
                  t.on("results:focus", function (e) {
                    e.data._resultId
                      ? r.$search.attr(
                          "aria-activedescendant",
                          e.data._resultId
                        )
                      : r.$search.removeAttr("aria-activedescendant");
                  }),
                  this.$selection.on(
                    "focusin",
                    ".select2-search--inline",
                    function (e) {
                      r.trigger("focus", e);
                    }
                  ),
                  this.$selection.on(
                    "focusout",
                    ".select2-search--inline",
                    function (e) {
                      r._handleBlur(e);
                    }
                  ),
                  this.$selection.on(
                    "keydown",
                    ".select2-search--inline",
                    function (e) {
                      if (
                        (e.stopPropagation(),
                        r.trigger("keypress", e),
                        (r._keyUpPrevented = e.isDefaultPrevented()),
                        e.which === l.BACKSPACE && "" === r.$search.val())
                      ) {
                        var t = r.$searchContainer.prev(
                          ".select2-selection__choice"
                        );
                        if (0 < t.length) {
                          var n = a.GetData(t[0], "data");
                          r.searchRemoveChoice(n), e.preventDefault();
                        }
                      }
                    }
                  ),
                  this.$selection.on(
                    "click",
                    ".select2-search--inline",
                    function (e) {
                      r.$search.val() && e.stopPropagation();
                    }
                  );
                var o = document.documentMode,
                  s = o && o <= 11;
                this.$selection.on(
                  "input.searchcheck",
                  ".select2-search--inline",
                  function (e) {
                    s
                      ? r.$selection.off("input.search input.searchcheck")
                      : r.$selection.off("keyup.search");
                  }
                ),
                  this.$selection.on(
                    "keyup.search input.search",
                    ".select2-search--inline",
                    function (e) {
                      if (s && "input" === e.type)
                        r.$selection.off("input.search input.searchcheck");
                      else {
                        var t = e.which;
                        t != l.SHIFT &&
                          t != l.CTRL &&
                          t != l.ALT &&
                          t != l.TAB &&
                          r.handleSearch(e);
                      }
                    }
                  );
              }),
              (e.prototype._transferTabIndex = function (e) {
                this.$search.attr("tabindex", this.$selection.attr("tabindex")),
                  this.$selection.attr("tabindex", "-1");
              }),
              (e.prototype.createPlaceholder = function (e, t) {
                this.$search.attr("placeholder", t.text);
              }),
              (e.prototype.update = function (e, t) {
                var n = this.$search[0] == document.activeElement;
                this.$search.attr("placeholder", ""),
                  e.call(this, t),
                  this.$selection
                    .find(".select2-selection__rendered")
                    .append(this.$searchContainer),
                  this.resizeSearch(),
                  n && this.$search.trigger("focus");
              }),
              (e.prototype.handleSearch = function () {
                if ((this.resizeSearch(), !this._keyUpPrevented)) {
                  var e = this.$search.val();
                  this.trigger("query", { term: e });
                }
                this._keyUpPrevented = !1;
              }),
              (e.prototype.searchRemoveChoice = function (e, t) {
                this.trigger("unselect", { data: t }),
                  this.$search.val(t.text),
                  this.handleSearch();
              }),
              (e.prototype.resizeSearch = function () {
                this.$search.css("width", "25px");
                var e = "";
                "" !== this.$search.attr("placeholder")
                  ? (e = this.$selection
                      .find(".select2-selection__rendered")
                      .width())
                  : (e = 0.75 * (this.$search.val().length + 1) + "em");
                this.$search.css("width", e);
              }),
              e
            );
          }
        ),
        e.define("select2/selection/eventRelay", ["jquery"], function (s) {
          function e() {}
          return (
            (e.prototype.bind = function (e, t, n) {
              var r = this,
                i = [
                  "open",
                  "opening",
                  "close",
                  "closing",
                  "select",
                  "selecting",
                  "unselect",
                  "unselecting",
                  "clear",
                  "clearing",
                ],
                o = [
                  "opening",
                  "closing",
                  "selecting",
                  "unselecting",
                  "clearing",
                ];
              e.call(this, t, n),
                t.on("*", function (e, t) {
                  if (-1 !== s.inArray(e, i)) {
                    t = t || {};
                    var n = s.Event("select2:" + e, { params: t });
                    r.$element.trigger(n),
                      -1 !== s.inArray(e, o) &&
                        (t.prevented = n.isDefaultPrevented());
                  }
                });
            }),
            e
          );
        }),
        e.define("select2/translation", ["jquery", "require"], function (t, n) {
          function r(e) {
            this.dict = e || {};
          }
          return (
            (r.prototype.all = function () {
              return this.dict;
            }),
            (r.prototype.get = function (e) {
              return this.dict[e];
            }),
            (r.prototype.extend = function (e) {
              this.dict = t.extend({}, e.all(), this.dict);
            }),
            (r._cache = {}),
            (r.loadPath = function (e) {
              if (!(e in r._cache)) {
                var t = n(e);
                r._cache[e] = t;
              }
              return new r(r._cache[e]);
            }),
            r
          );
        }),
        e.define("select2/diacritics", [], function () {
          return {
            "Ⓐ": "A",
          };
        }),
        e.define("select2/data/base", ["../utils"], function (r) {
          function n(e, t) {
            n.__super__.constructor.call(this);
          }
          return (
            r.Extend(n, r.Observable),
            (n.prototype.current = function (e) {
              throw new Error(
                "The `current` method must be defined in child classes."
              );
            }),
            (n.prototype.query = function (e, t) {
              throw new Error(
                "The `query` method must be defined in child classes."
              );
            }),
            (n.prototype.bind = function (e, t) {}),
            (n.prototype.destroy = function () {}),
            (n.prototype.generateResultId = function (e, t) {
              var n = e.id + "-result-";
              return (
                (n += r.generateChars(4)),
                null != t.id
                  ? (n += "-" + t.id.toString())
                  : (n += "-" + r.generateChars(4)),
                n
              );
            }),
            n
          );
        }),
        e.define(
          "select2/data/select",
          ["./base", "../utils", "jquery"],
          function (e, a, l) {
            function n(e, t) {
              (this.$element = e),
                (this.options = t),
                n.__super__.constructor.call(this);
            }
            return (
              a.Extend(n, e),
              (n.prototype.current = function (e) {
                var n = [],
                  r = this;
                this.$element.find(":selected").each(function () {
                  var e = l(this),
                    t = r.item(e);
                  n.push(t);
                }),
                  e(n);
              }),
              (n.prototype.select = function (i) {
                var o = this;
                if (((i.selected = !0), l(i.element).is("option")))
                  return (
                    (i.element.selected = !0),
                    void this.$element.trigger("input").trigger("change")
                  );
                if (this.$element.prop("multiple"))
                  this.current(function (e) {
                    var t = [];
                    (i = [i]).push.apply(i, e);
                    for (var n = 0; n < i.length; n++) {
                      var r = i[n].id;
                      -1 === l.inArray(r, t) && t.push(r);
                    }
                    o.$element.val(t),
                      o.$element.trigger("input").trigger("change");
                  });
                else {
                  var e = i.id;
                  this.$element.val(e),
                    this.$element.trigger("input").trigger("change");
                }
              }),
              (n.prototype.unselect = function (i) {
                var o = this;
                if (this.$element.prop("multiple")) {
                  if (((i.selected = !1), l(i.element).is("option")))
                    return (
                      (i.element.selected = !1),
                      void this.$element.trigger("input").trigger("change")
                    );
                  this.current(function (e) {
                    for (var t = [], n = 0; n < e.length; n++) {
                      var r = e[n].id;
                      r !== i.id && -1 === l.inArray(r, t) && t.push(r);
                    }
                    o.$element.val(t),
                      o.$element.trigger("input").trigger("change");
                  });
                }
              }),
              (n.prototype.bind = function (e, t) {
                var n = this;
                (this.container = e).on("select", function (e) {
                  n.select(e.data);
                }),
                  e.on("unselect", function (e) {
                    n.unselect(e.data);
                  });
              }),
              (n.prototype.destroy = function () {
                this.$element.find("*").each(function () {
                  a.RemoveData(this);
                });
              }),
              (n.prototype.query = function (r, e) {
                var i = [],
                  o = this;
                this.$element.children().each(function () {
                  var e = l(this);
                  if (e.is("option") || e.is("optgroup")) {
                    var t = o.item(e),
                      n = o.matches(r, t);
                    null !== n && i.push(n);
                  }
                }),
                  e({ results: i });
              }),
              (n.prototype.addOptions = function (e) {
                a.appendMany(this.$element, e);
              }),
              (n.prototype.option = function (e) {
                var t;
                e.children
                  ? ((t = document.createElement("optgroup")).label = e.text)
                  : void 0 !==
                    (t = document.createElement("option")).textContent
                  ? (t.textContent = e.text)
                  : (t.innerText = e.text),
                  void 0 !== e.id && (t.value = e.id),
                  e.disabled && (t.disabled = !0),
                  e.selected && (t.selected = !0),
                  e.title && (t.title = e.title);
                var n = l(t),
                  r = this._normalizeItem(e);
                return (r.element = t), a.StoreData(t, "data", r), n;
              }),
              (n.prototype.item = function (e) {
                var t = {};
                if (null != (t = a.GetData(e[0], "data"))) return t;
                if (e.is("option"))
                  t = {
                    id: e.val(),
                    text: e.text(),
                    disabled: e.prop("disabled"),
                    selected: e.prop("selected"),
                    title: e.prop("title"),
                  };
                else if (e.is("optgroup")) {
                  t = {
                    text: e.prop("label"),
                    children: [],
                    title: e.prop("title"),
                  };
                  for (
                    var n = e.children("option"), r = [], i = 0;
                    i < n.length;
                    i++
                  ) {
                    var o = l(n[i]),
                      s = this.item(o);
                    r.push(s);
                  }
                  t.children = r;
                }
                return (
                  ((t = this._normalizeItem(t)).element = e[0]),
                  a.StoreData(e[0], "data", t),
                  t
                );
              }),
              (n.prototype._normalizeItem = function (e) {
                e !== Object(e) && (e = { id: e, text: e });
                return (
                  null != (e = l.extend({}, { text: "" }, e)).id &&
                    (e.id = e.id.toString()),
                  null != e.text && (e.text = e.text.toString()),
                  null == e._resultId &&
                    e.id &&
                    null != this.container &&
                    (e._resultId = this.generateResultId(this.container, e)),
                  l.extend({}, { selected: !1, disabled: !1 }, e)
                );
              }),
              (n.prototype.matches = function (e, t) {
                return this.options.get("matcher")(e, t);
              }),
              n
            );
          }
        ),
        e.define(
          "select2/data/array",
          ["./select", "../utils", "jquery"],
          function (e, f, g) {
            function r(e, t) {
              (this._dataToConvert = t.get("data") || []),
                r.__super__.constructor.call(this, e, t);
            }
            return (
              f.Extend(r, e),
              (r.prototype.bind = function (e, t) {
                r.__super__.bind.call(this, e, t),
                  this.addOptions(this.convertToOptions(this._dataToConvert));
              }),
              (r.prototype.select = function (n) {
                var e = this.$element.find("option").filter(function (e, t) {
                  return t.value == n.id.toString();
                });
                0 === e.length && ((e = this.option(n)), this.addOptions(e)),
                  r.__super__.select.call(this, n);
              }),
              (r.prototype.convertToOptions = function (e) {
                var t = this,
                  n = this.$element.find("option"),
                  r = n
                    .map(function () {
                      return t.item(g(this)).id;
                    })
                    .get(),
                  i = [];
                function o(e) {
                  return function () {
                    return g(this).val() == e.id;
                  };
                }
                for (var s = 0; s < e.length; s++) {
                  var a = this._normalizeItem(e[s]);
                  if (0 <= g.inArray(a.id, r)) {
                    var l = n.filter(o(a)),
                      c = this.item(l),
                      u = g.extend(!0, {}, a, c),
                      d = this.option(u);
                    l.replaceWith(d);
                  } else {
                    var p = this.option(a);
                    if (a.children) {
                      var h = this.convertToOptions(a.children);
                      f.appendMany(p, h);
                    }
                    i.push(p);
                  }
                }
                return i;
              }),
              r
            );
          }
        ),
        e.define(
          "select2/data/ajax",
          ["./array", "../utils", "jquery"],
          function (e, t, o) {
            function n(e, t) {
              (this.ajaxOptions = this._applyDefaults(t.get("ajax"))),
                null != this.ajaxOptions.processResults &&
                  (this.processResults = this.ajaxOptions.processResults),
                n.__super__.constructor.call(this, e, t);
            }
            return (
              t.Extend(n, e),
              (n.prototype._applyDefaults = function (e) {
                var t = {
                  data: function (e) {
                    return o.extend({}, e, { q: e.term });
                  },
                  transport: function (e, t, n) {
                    var r = o.ajax(e);
                    return r.then(t), r.fail(n), r;
                  },
                };
                return o.extend({}, t, e, !0);
              }),
              (n.prototype.processResults = function (e) {
                return e;
              }),
              (n.prototype.query = function (n, r) {
                var i = this;
                null != this._request &&
                  (o.isFunction(this._request.abort) && this._request.abort(),
                  (this._request = null));
                var t = o.extend({ type: "GET" }, this.ajaxOptions);
                function e() {
                  var e = t.transport(
                    t,
                    function (e) {
                      var t = i.processResults(e, n);
                      i.options.get("debug") &&
                        window.console &&
                        console.error &&
                        ((t && t.results && o.isArray(t.results)) ||
                          console.error(
                            "Select2: The AJAX results did not return an array in the `results` key of the response."
                          )),
                        r(t);
                    },
                    function () {
                      ("status" in e && (0 === e.status || "0" === e.status)) ||
                        i.trigger("results:message", {
                          message: "errorLoading",
                        });
                    }
                  );
                  i._request = e;
                }
                "function" == typeof t.url &&
                  (t.url = t.url.call(this.$element, n)),
                  "function" == typeof t.data &&
                    (t.data = t.data.call(this.$element, n)),
                  this.ajaxOptions.delay && null != n.term
                    ? (this._queryTimeout &&
                        window.clearTimeout(this._queryTimeout),
                      (this._queryTimeout = window.setTimeout(
                        e,
                        this.ajaxOptions.delay
                      )))
                    : e();
              }),
              n
            );
          }
        ),
        e.define("select2/data/tags", ["jquery"], function (u) {
          function e(e, t, n) {
            var r = n.get("tags"),
              i = n.get("createTag");
            void 0 !== i && (this.createTag = i);
            var o = n.get("insertTag");
            if (
              (void 0 !== o && (this.insertTag = o),
              e.call(this, t, n),
              u.isArray(r))
            )
              for (var s = 0; s < r.length; s++) {
                var a = r[s],
                  l = this._normalizeItem(a),
                  c = this.option(l);
                this.$element.append(c);
              }
          }
          return (
            (e.prototype.query = function (e, c, u) {
              var d = this;
              this._removeOldTags(),
                null != c.term && null == c.page
                  ? e.call(this, c, function e(t, n) {
                      for (var r = t.results, i = 0; i < r.length; i++) {
                        var o = r[i],
                          s =
                            null != o.children &&
                            !e({ results: o.children }, !0);
                        if (
                          (o.text || "").toUpperCase() ===
                            (c.term || "").toUpperCase() ||
                          s
                        )
                          return !n && ((t.data = r), void u(t));
                      }
                      if (n) return !0;
                      var a = d.createTag(c);
                      if (null != a) {
                        var l = d.option(a);
                        l.attr("data-select2-tag", !0),
                          d.addOptions([l]),
                          d.insertTag(r, a);
                      }
                      (t.results = r), u(t);
                    })
                  : e.call(this, c, u);
            }),
            (e.prototype.createTag = function (e, t) {
              var n = u.trim(t.term);
              return "" === n ? null : { id: n, text: n };
            }),
            (e.prototype.insertTag = function (e, t, n) {
              t.unshift(n);
            }),
            (e.prototype._removeOldTags = function (e) {
              this.$element.find("option[data-select2-tag]").each(function () {
                this.selected || u(this).remove();
              });
            }),
            e
          );
        }),
        e.define("select2/data/tokenizer", ["jquery"], function (d) {
          function e(e, t, n) {
            var r = n.get("tokenizer");
            void 0 !== r && (this.tokenizer = r), e.call(this, t, n);
          }
          return (
            (e.prototype.bind = function (e, t, n) {
              e.call(this, t, n),
                (this.$search =
                  t.dropdown.$search ||
                  t.selection.$search ||
                  n.find(".select2-search__field"));
            }),
            (e.prototype.query = function (e, t, n) {
              var i = this;
              t.term = t.term || "";
              var r = this.tokenizer(t, this.options, function (e) {
                var t,
                  n = i._normalizeItem(e);
                if (
                  !i.$element.find("option").filter(function () {
                    return d(this).val() === n.id;
                  }).length
                ) {
                  var r = i.option(n);
                  r.attr("data-select2-tag", !0),
                    i._removeOldTags(),
                    i.addOptions([r]);
                }
                (t = n), i.trigger("select", { data: t });
              });
              r.term !== t.term &&
                (this.$search.length &&
                  (this.$search.val(r.term), this.$search.trigger("focus")),
                (t.term = r.term)),
                e.call(this, t, n);
            }),
            (e.prototype.tokenizer = function (e, t, n, r) {
              for (
                var i = n.get("tokenSeparators") || [],
                  o = t.term,
                  s = 0,
                  a =
                    this.createTag ||
                    function (e) {
                      return { id: e.term, text: e.term };
                    };
                s < o.length;

              ) {
                var l = o[s];
                if (-1 !== d.inArray(l, i)) {
                  var c = o.substr(0, s),
                    u = a(d.extend({}, t, { term: c }));
                  null != u
                    ? (r(u), (o = o.substr(s + 1) || ""), (s = 0))
                    : s++;
                } else s++;
              }
              return { term: o };
            }),
            e
          );
        }),
        e.define("select2/data/minimumInputLength", [], function () {
          function e(e, t, n) {
            (this.minimumInputLength = n.get("minimumInputLength")),
              e.call(this, t, n);
          }
          return (
            (e.prototype.query = function (e, t, n) {
              (t.term = t.term || ""),
                t.term.length < this.minimumInputLength
                  ? this.trigger("results:message", {
                      message: "inputTooShort",
                      args: {
                        minimum: this.minimumInputLength,
                        input: t.term,
                        params: t,
                      },
                    })
                  : e.call(this, t, n);
            }),
            e
          );
        }),
        e.define("select2/data/maximumInputLength", [], function () {
          function e(e, t, n) {
            (this.maximumInputLength = n.get("maximumInputLength")),
              e.call(this, t, n);
          }
          return (
            (e.prototype.query = function (e, t, n) {
              (t.term = t.term || ""),
                0 < this.maximumInputLength &&
                t.term.length > this.maximumInputLength
                  ? this.trigger("results:message", {
                      message: "inputTooLong",
                      args: {
                        maximum: this.maximumInputLength,
                        input: t.term,
                        params: t,
                      },
                    })
                  : e.call(this, t, n);
            }),
            e
          );
        }),
        e.define("select2/data/maximumSelectionLength", [], function () {
          function e(e, t, n) {
            (this.maximumSelectionLength = n.get("maximumSelectionLength")),
              e.call(this, t, n);
          }
          return (
            (e.prototype.bind = function (e, t, n) {
              var r = this;
              e.call(this, t, n),
                t.on("select", function () {
                  r._checkIfMaximumSelected();
                });
            }),
            (e.prototype.query = function (e, t, n) {
              var r = this;
              this._checkIfMaximumSelected(function () {
                e.call(r, t, n);
              });
            }),
            (e.prototype._checkIfMaximumSelected = function (e, n) {
              var r = this;
              this.current(function (e) {
                var t = null != e ? e.length : 0;
                0 < r.maximumSelectionLength && t >= r.maximumSelectionLength
                  ? r.trigger("results:message", {
                      message: "maximumSelected",
                      args: { maximum: r.maximumSelectionLength },
                    })
                  : n && n();
              });
            }),
            e
          );
        }),
        e.define("select2/dropdown", ["jquery", "./utils"], function (t, e) {
          function n(e, t) {
            (this.$element = e),
              (this.options = t),
              n.__super__.constructor.call(this);
          }
          return (
            e.Extend(n, e.Observable),
            (n.prototype.render = function () {
              var e = t(
                '<span class="select2-dropdown"><span class="select2-results"></span></span>'
              );
              return (
                e.attr("dir", this.options.get("dir")), (this.$dropdown = e)
              );
            }),
            (n.prototype.bind = function () {}),
            (n.prototype.position = function (e, t) {}),
            (n.prototype.destroy = function () {
              this.$dropdown.remove();
            }),
            n
          );
        }),
        e.define(
          "select2/dropdown/search",
          ["jquery", "../utils"],
          function (o, e) {
            function t() {}
            return (
              (t.prototype.render = function (e) {
                var t = e.call(this),
                  n = o(
                    '<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>'
                  );
                return (
                  (this.$searchContainer = n),
                  (this.$search = n.find("input")),
                  t.prepend(n),
                  t
                );
              }),
              (t.prototype.bind = function (e, t, n) {
                var r = this,
                  i = t.id + "-results";
                e.call(this, t, n),
                  this.$search.on("keydown", function (e) {
                    r.trigger("keypress", e),
                      (r._keyUpPrevented = e.isDefaultPrevented());
                  }),
                  this.$search.on("input", function (e) {
                    o(this).off("keyup");
                  }),
                  this.$search.on("keyup input", function (e) {
                    r.handleSearch(e);
                  }),
                  t.on("open", function () {
                    r.$search.attr("tabindex", 0),
                      r.$search.attr("aria-controls", i),
                      r.$search.trigger("focus"),
                      window.setTimeout(function () {
                        r.$search.trigger("focus");
                      }, 0);
                  }),
                  t.on("close", function () {
                    r.$search.attr("tabindex", -1),
                      r.$search.removeAttr("aria-controls"),
                      r.$search.removeAttr("aria-activedescendant"),
                      r.$search.val(""),
                      r.$search.trigger("blur");
                  }),
                  t.on("focus", function () {
                    t.isOpen() || r.$search.trigger("focus");
                  }),
                  t.on("results:all", function (e) {
                    (null != e.query.term && "" !== e.query.term) ||
                      (r.showSearch(e)
                        ? r.$searchContainer.removeClass("select2-search--hide")
                        : r.$searchContainer.addClass("select2-search--hide"));
                  }),
                  t.on("results:focus", function (e) {
                    e.data._resultId
                      ? r.$search.attr(
                          "aria-activedescendant",
                          e.data._resultId
                        )
                      : r.$search.removeAttr("aria-activedescendant");
                  });
              }),
              (t.prototype.handleSearch = function (e) {
                if (!this._keyUpPrevented) {
                  var t = this.$search.val();
                  this.trigger("query", { term: t });
                }
                this._keyUpPrevented = !1;
              }),
              (t.prototype.showSearch = function (e, t) {
                return !0;
              }),
              t
            );
          }
        ),
        e.define("select2/dropdown/hidePlaceholder", [], function () {
          function e(e, t, n, r) {
            (this.placeholder = this.normalizePlaceholder(
              n.get("placeholder")
            )),
              e.call(this, t, n, r);
          }
          return (
            (e.prototype.append = function (e, t) {
              (t.results = this.removePlaceholder(t.results)), e.call(this, t);
            }),
            (e.prototype.normalizePlaceholder = function (e, t) {
              return "string" == typeof t && (t = { id: "", text: t }), t;
            }),
            (e.prototype.removePlaceholder = function (e, t) {
              for (var n = t.slice(0), r = t.length - 1; 0 <= r; r--) {
                var i = t[r];
                this.placeholder.id === i.id && n.splice(r, 1);
              }
              return n;
            }),
            e
          );
        }),
        e.define("select2/dropdown/infiniteScroll", ["jquery"], function (n) {
          function e(e, t, n, r) {
            (this.lastParams = {}),
              e.call(this, t, n, r),
              (this.$loadingMore = this.createLoadingMore()),
              (this.loading = !1);
          }
          return (
            (e.prototype.append = function (e, t) {
              this.$loadingMore.remove(),
                (this.loading = !1),
                e.call(this, t),
                this.showLoadingMore(t) &&
                  (this.$results.append(this.$loadingMore),
                  this.loadMoreIfNeeded());
            }),
            (e.prototype.bind = function (e, t, n) {
              var r = this;
              e.call(this, t, n),
                t.on("query", function (e) {
                  (r.lastParams = e), (r.loading = !0);
                }),
                t.on("query:append", function (e) {
                  (r.lastParams = e), (r.loading = !0);
                }),
                this.$results.on("scroll", this.loadMoreIfNeeded.bind(this));
            }),
            (e.prototype.loadMoreIfNeeded = function () {
              var e = n.contains(
                document.documentElement,
                this.$loadingMore[0]
              );
              if (!this.loading && e) {
                var t =
                  this.$results.offset().top + this.$results.outerHeight(!1);
                this.$loadingMore.offset().top +
                  this.$loadingMore.outerHeight(!1) <=
                  t + 50 && this.loadMore();
              }
            }),
            (e.prototype.loadMore = function () {
              this.loading = !0;
              var e = n.extend({}, { page: 1 }, this.lastParams);
              e.page++, this.trigger("query:append", e);
            }),
            (e.prototype.showLoadingMore = function (e, t) {
              return t.pagination && t.pagination.more;
            }),
            (e.prototype.createLoadingMore = function () {
              var e = n(
                  '<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>'
                ),
                t = this.options.get("translations").get("loadingMore");
              return e.html(t(this.lastParams)), e;
            }),
            e
          );
        }),
        e.define(
          "select2/dropdown/attachBody",
          ["jquery", "../utils"],
          function (f, a) {
            function e(e, t, n) {
              (this.$dropdownParent = f(
                n.get("dropdownParent") || document.body
              )),
                e.call(this, t, n);
            }
            return (
              (e.prototype.bind = function (e, t, n) {
                var r = this;
                e.call(this, t, n),
                  t.on("open", function () {
                    r._showDropdown(),
                      r._attachPositioningHandler(t),
                      r._bindContainerResultHandlers(t);
                  }),
                  t.on("close", function () {
                    r._hideDropdown(), r._detachPositioningHandler(t);
                  }),
                  this.$dropdownContainer.on("mousedown", function (e) {
                    e.stopPropagation();
                  });
              }),
              (e.prototype.destroy = function (e) {
                e.call(this), this.$dropdownContainer.remove();
              }),
              (e.prototype.position = function (e, t, n) {
                t.attr("class", n.attr("class")),
                  t.removeClass("select2"),
                  t.addClass("select2-container--open"),
                  t.css({ position: "absolute", top: -999999 }),
                  (this.$container = n);
              }),
              (e.prototype.render = function (e) {
                var t = f("<span></span>"),
                  n = e.call(this);
                return t.append(n), (this.$dropdownContainer = t);
              }),
              (e.prototype._hideDropdown = function (e) {
                this.$dropdownContainer.detach();
              }),
              (e.prototype._bindContainerResultHandlers = function (e, t) {
                if (!this._containerResultsHandlersBound) {
                  var n = this;
                  t.on("results:all", function () {
                    n._positionDropdown(), n._resizeDropdown();
                  }),
                    t.on("results:append", function () {
                      n._positionDropdown(), n._resizeDropdown();
                    }),
                    t.on("results:message", function () {
                      n._positionDropdown(), n._resizeDropdown();
                    }),
                    t.on("select", function () {
                      n._positionDropdown(), n._resizeDropdown();
                    }),
                    t.on("unselect", function () {
                      n._positionDropdown(), n._resizeDropdown();
                    }),
                    (this._containerResultsHandlersBound = !0);
                }
              }),
              (e.prototype._attachPositioningHandler = function (e, t) {
                var n = this,
                  r = "scroll.select2." + t.id,
                  i = "resize.select2." + t.id,
                  o = "orientationchange.select2." + t.id,
                  s = this.$container.parents().filter(a.hasScroll);
                s.each(function () {
                  a.StoreData(this, "select2-scroll-position", {
                    x: f(this).scrollLeft(),
                    y: f(this).scrollTop(),
                  });
                }),
                  s.on(r, function (e) {
                    var t = a.GetData(this, "select2-scroll-position");
                    f(this).scrollTop(t.y);
                  }),
                  f(window).on(r + " " + i + " " + o, function (e) {
                    n._positionDropdown(), n._resizeDropdown();
                  });
              }),
              (e.prototype._detachPositioningHandler = function (e, t) {
                var n = "scroll.select2." + t.id,
                  r = "resize.select2." + t.id,
                  i = "orientationchange.select2." + t.id;
                this.$container.parents().filter(a.hasScroll).off(n),
                  f(window).off(n + " " + r + " " + i);
              }),
              (e.prototype._positionDropdown = function () {
                var e = f(window),
                  t = this.$dropdown.hasClass("select2-dropdown--above"),
                  n = this.$dropdown.hasClass("select2-dropdown--below"),
                  r = null,
                  i = this.$container.offset();
                i.bottom = i.top + this.$container.outerHeight(!1);
                var o = { height: this.$container.outerHeight(!1) };
                (o.top = i.top), (o.bottom = i.top + o.height);
                var s = this.$dropdown.outerHeight(!1),
                  a = e.scrollTop(),
                  l = e.scrollTop() + e.height(),
                  c = a < i.top - s,
                  u = l > i.bottom + s,
                  d = { left: i.left, top: o.bottom },
                  p = this.$dropdownParent;
                "static" === p.css("position") && (p = p.offsetParent());
                var h = { top: 0, left: 0 };
                (f.contains(document.body, p[0]) || p[0].isConnected) &&
                  (h = p.offset()),
                  (d.top -= h.top),
                  (d.left -= h.left),
                  t || n || (r = "below"),
                  u || !c || t ? !c && u && t && (r = "below") : (r = "above"),
                  ("above" == r || (t && "below" !== r)) &&
                    (d.top = o.top - h.top - s),
                  null != r &&
                    (this.$dropdown
                      .removeClass(
                        "select2-dropdown--below select2-dropdown--above"
                      )
                      .addClass("select2-dropdown--" + r),
                    this.$container
                      .removeClass(
                        "select2-container--below select2-container--above"
                      )
                      .addClass("select2-container--" + r)),
                  this.$dropdownContainer.css(d);
              }),
              (e.prototype._resizeDropdown = function () {
                var e = { width: this.$container.outerWidth(!1) + "px" };
                this.options.get("dropdownAutoWidth") &&
                  ((e.minWidth = e.width),
                  (e.position = "relative"),
                  (e.width = "auto")),
                  this.$dropdown.css(e);
              }),
              (e.prototype._showDropdown = function (e) {
                this.$dropdownContainer.appendTo(this.$dropdownParent),
                  this._positionDropdown(),
                  this._resizeDropdown();
              }),
              e
            );
          }
        ),
        e.define("select2/dropdown/minimumResultsForSearch", [], function () {
          function e(e, t, n, r) {
            (this.minimumResultsForSearch = n.get("minimumResultsForSearch")),
              this.minimumResultsForSearch < 0 &&
                (this.minimumResultsForSearch = 1 / 0),
              e.call(this, t, n, r);
          }
          return (
            (e.prototype.showSearch = function (e, t) {
              return (
                !(
                  (function e(t) {
                    for (var n = 0, r = 0; r < t.length; r++) {
                      var i = t[r];
                      i.children ? (n += e(i.children)) : n++;
                    }
                    return n;
                  })(t.data.results) < this.minimumResultsForSearch
                ) && e.call(this, t)
              );
            }),
            e
          );
        }),
        e.define("select2/dropdown/selectOnClose", ["../utils"], function (o) {
          function e() {}
          return (
            (e.prototype.bind = function (e, t, n) {
              var r = this;
              e.call(this, t, n),
                t.on("close", function (e) {
                  r._handleSelectOnClose(e);
                });
            }),
            (e.prototype._handleSelectOnClose = function (e, t) {
              if (t && null != t.originalSelect2Event) {
                var n = t.originalSelect2Event;
                if ("select" === n._type || "unselect" === n._type) return;
              }
              var r = this.getHighlightedResults();
              if (!(r.length < 1)) {
                var i = o.GetData(r[0], "data");
                (null != i.element && i.element.selected) ||
                  (null == i.element && i.selected) ||
                  this.trigger("select", { data: i });
              }
            }),
            e
          );
        }),
        e.define("select2/dropdown/closeOnSelect", [], function () {
          function e() {}
          return (
            (e.prototype.bind = function (e, t, n) {
              var r = this;
              e.call(this, t, n),
                t.on("select", function (e) {
                  r._selectTriggered(e);
                }),
                t.on("unselect", function (e) {
                  r._selectTriggered(e);
                });
            }),
            (e.prototype._selectTriggered = function (e, t) {
              var n = t.originalEvent;
              (n && (n.ctrlKey || n.metaKey)) ||
                this.trigger("close", {
                  originalEvent: n,
                  originalSelect2Event: t,
                });
            }),
            e
          );
        }),
        e.define("select2/i18n/en", [], function () {
          return {
            errorLoading: function () {
              return "The results could not be loaded.";
            },
            inputTooLong: function (e) {
              var t = e.input.length - e.maximum,
                n = "Please delete " + t + " character";
              return 1 != t && (n += "s"), n;
            },
            inputTooShort: function (e) {
              return (
                "Please enter " +
                (e.minimum - e.input.length) +
                " or more characters"
              );
            },
            loadingMore: function () {
              return "Loading more resultsÃ¢â‚¬Â¦";
            },
            maximumSelected: function (e) {
              var t = "You can only select " + e.maximum + " item";
              return 1 != e.maximum && (t += "s"), t;
            },
            noResults: function () {
              return "No results found";
            },
            searching: function () {
              return "SearchingÃ¢â‚¬Â¦";
            },
            removeAllItems: function () {
              return "Remove all items";
            },
          };
        }),
        e.define(
          "select2/defaults",
          [
            "jquery",
            "require",
            "./results",
            "./selection/single",
            "./selection/multiple",
            "./selection/placeholder",
            "./selection/allowClear",
            "./selection/search",
            "./selection/eventRelay",
            "./utils",
            "./translation",
            "./diacritics",
            "./data/select",
            "./data/array",
            "./data/ajax",
            "./data/tags",
            "./data/tokenizer",
            "./data/minimumInputLength",
            "./data/maximumInputLength",
            "./data/maximumSelectionLength",
            "./dropdown",
            "./dropdown/search",
            "./dropdown/hidePlaceholder",
            "./dropdown/infiniteScroll",
            "./dropdown/attachBody",
            "./dropdown/minimumResultsForSearch",
            "./dropdown/selectOnClose",
            "./dropdown/closeOnSelect",
            "./i18n/en",
          ],
          function (
            c,
            u,
            d,
            p,
            h,
            f,
            g,
            m,
            v,
            y,
            s,
            t,
            _,
            $,
            b,
            w,
            A,
            x,
            D,
            S,
            E,
            C,
            O,
            T,
            q,
            L,
            I,
            j,
            e
          ) {
            function n() {
              this.reset();
            }
            return (
              (n.prototype.apply = function (e) {
                if (
                  null == (e = c.extend(!0, {}, this.defaults, e)).dataAdapter
                ) {
                  if (
                    (null != e.ajax
                      ? (e.dataAdapter = b)
                      : null != e.data
                      ? (e.dataAdapter = $)
                      : (e.dataAdapter = _),
                    0 < e.minimumInputLength &&
                      (e.dataAdapter = y.Decorate(e.dataAdapter, x)),
                    0 < e.maximumInputLength &&
                      (e.dataAdapter = y.Decorate(e.dataAdapter, D)),
                    0 < e.maximumSelectionLength &&
                      (e.dataAdapter = y.Decorate(e.dataAdapter, S)),
                    e.tags && (e.dataAdapter = y.Decorate(e.dataAdapter, w)),
                    (null == e.tokenSeparators && null == e.tokenizer) ||
                      (e.dataAdapter = y.Decorate(e.dataAdapter, A)),
                    null != e.query)
                  ) {
                    var t = u(e.amdBase + "compat/query");
                    e.dataAdapter = y.Decorate(e.dataAdapter, t);
                  }
                  if (null != e.initSelection) {
                    var n = u(e.amdBase + "compat/initSelection");
                    e.dataAdapter = y.Decorate(e.dataAdapter, n);
                  }
                }
                if (
                  (null == e.resultsAdapter &&
                    ((e.resultsAdapter = d),
                    null != e.ajax &&
                      (e.resultsAdapter = y.Decorate(e.resultsAdapter, T)),
                    null != e.placeholder &&
                      (e.resultsAdapter = y.Decorate(e.resultsAdapter, O)),
                    e.selectOnClose &&
                      (e.resultsAdapter = y.Decorate(e.resultsAdapter, I))),
                  null == e.dropdownAdapter)
                ) {
                  if (e.multiple) e.dropdownAdapter = E;
                  else {
                    var r = y.Decorate(E, C);
                    e.dropdownAdapter = r;
                  }
                  if (
                    (0 !== e.minimumResultsForSearch &&
                      (e.dropdownAdapter = y.Decorate(e.dropdownAdapter, L)),
                    e.closeOnSelect &&
                      (e.dropdownAdapter = y.Decorate(e.dropdownAdapter, j)),
                    null != e.dropdownCssClass ||
                      null != e.dropdownCss ||
                      null != e.adaptDropdownCssClass)
                  ) {
                    var i = u(e.amdBase + "compat/dropdownCss");
                    e.dropdownAdapter = y.Decorate(e.dropdownAdapter, i);
                  }
                  e.dropdownAdapter = y.Decorate(e.dropdownAdapter, q);
                }
                if (null == e.selectionAdapter) {
                  if (
                    (e.multiple
                      ? (e.selectionAdapter = h)
                      : (e.selectionAdapter = p),
                    null != e.placeholder &&
                      (e.selectionAdapter = y.Decorate(e.selectionAdapter, f)),
                    e.allowClear &&
                      (e.selectionAdapter = y.Decorate(e.selectionAdapter, g)),
                    e.multiple &&
                      (e.selectionAdapter = y.Decorate(e.selectionAdapter, m)),
                    null != e.containerCssClass ||
                      null != e.containerCss ||
                      null != e.adaptContainerCssClass)
                  ) {
                    var o = u(e.amdBase + "compat/containerCss");
                    e.selectionAdapter = y.Decorate(e.selectionAdapter, o);
                  }
                  e.selectionAdapter = y.Decorate(e.selectionAdapter, v);
                }
                (e.language = this._resolveLanguage(e.language)),
                  e.language.push("en");
                for (var s = [], a = 0; a < e.language.length; a++) {
                  var l = e.language[a];
                  -1 === s.indexOf(l) && s.push(l);
                }
                return (
                  (e.language = s),
                  (e.translations = this._processTranslations(
                    e.language,
                    e.debug
                  )),
                  e
                );
              }),
              (n.prototype.reset = function () {
                function a(e) {
                  return e.replace(/[^\u0000-\u007E]/g, function (e) {
                    return t[e] || e;
                  });
                }
                this.defaults = {
                  amdBase: "./",
                  amdLanguageBase: "./i18n/",
                  closeOnSelect: !0,
                  debug: !1,
                  dropdownAutoWidth: !1,
                  escapeMarkup: y.escapeMarkup,
                  language: {},
                  matcher: function e(t, n) {
                    if ("" === c.trim(t.term)) return n;
                    if (n.children && 0 < n.children.length) {
                      for (
                        var r = c.extend(!0, {}, n), i = n.children.length - 1;
                        0 <= i;
                        i--
                      )
                        null == e(t, n.children[i]) && r.children.splice(i, 1);
                      return 0 < r.children.length ? r : e(t, r);
                    }
                    var o = a(n.text).toUpperCase(),
                      s = a(t.term).toUpperCase();
                    return -1 < o.indexOf(s) ? n : null;
                  },
                  minimumInputLength: 0,
                  maximumInputLength: 0,
                  maximumSelectionLength: 0,
                  minimumResultsForSearch: 0,
                  selectOnClose: !1,
                  scrollAfterSelect: !1,
                  sorter: function (e) {
                    return e;
                  },
                  templateResult: function (e) {
                    return e.text;
                  },
                  templateSelection: function (e) {
                    return e.text;
                  },
                  theme: "default",
                  width: "resolve",
                };
              }),
              (n.prototype.applyFromElement = function (e, t) {
                var n = e.language,
                  r = this.defaults.language,
                  i = t.prop("lang"),
                  o = t.closest("[lang]").prop("lang"),
                  s = Array.prototype.concat.call(
                    this._resolveLanguage(i),
                    this._resolveLanguage(n),
                    this._resolveLanguage(r),
                    this._resolveLanguage(o)
                  );
                return (e.language = s), e;
              }),
              (n.prototype._resolveLanguage = function (e) {
                if (!e) return [];
                if (c.isEmptyObject(e)) return [];
                if (c.isPlainObject(e)) return [e];
                var t;
                t = c.isArray(e) ? e : [e];
                for (var n = [], r = 0; r < t.length; r++)
                  if (
                    (n.push(t[r]),
                    "string" == typeof t[r] && 0 < t[r].indexOf("-"))
                  ) {
                    var i = t[r].split("-")[0];
                    n.push(i);
                  }
                return n;
              }),
              (n.prototype._processTranslations = function (e, t) {
                for (var n = new s(), r = 0; r < e.length; r++) {
                  var i = new s(),
                    o = e[r];
                  if ("string" == typeof o)
                    try {
                      i = s.loadPath(o);
                    } catch (e) {
                      try {
                        (o = this.defaults.amdLanguageBase + o),
                          (i = s.loadPath(o));
                      } catch (e) {
                        t &&
                          window.console &&
                          console.warn &&
                          console.warn(
                            'Select2: The language file for "' +
                              o +
                              '" could not be automatically loaded. A fallback will be used instead.'
                          );
                      }
                    }
                  else i = c.isPlainObject(o) ? new s(o) : o;
                  n.extend(i);
                }
                return n;
              }),
              (n.prototype.set = function (e, t) {
                var n = {};
                n[c.camelCase(e)] = t;
                var r = y._convertData(n);
                c.extend(!0, this.defaults, r);
              }),
              new n()
            );
          }
        ),
        e.define(
          "select2/options",
          ["require", "jquery", "./defaults", "./utils"],
          function (r, d, i, p) {
            function e(e, t) {
              if (
                ((this.options = e),
                null != t && this.fromElement(t),
                null != t &&
                  (this.options = i.applyFromElement(this.options, t)),
                (this.options = i.apply(this.options)),
                t && t.is("input"))
              ) {
                var n = r(this.get("amdBase") + "compat/inputData");
                this.options.dataAdapter = p.Decorate(
                  this.options.dataAdapter,
                  n
                );
              }
            }
            return (
              (e.prototype.fromElement = function (e) {
                var t = ["select2"];
                null == this.options.multiple &&
                  (this.options.multiple = e.prop("multiple")),
                  null == this.options.disabled &&
                    (this.options.disabled = e.prop("disabled")),
                  null == this.options.dir &&
                    (e.prop("dir")
                      ? (this.options.dir = e.prop("dir"))
                      : e.closest("[dir]").prop("dir")
                      ? (this.options.dir = e.closest("[dir]").prop("dir"))
                      : (this.options.dir = "ltr")),
                  e.prop("disabled", this.options.disabled),
                  e.prop("multiple", this.options.multiple),
                  p.GetData(e[0], "select2Tags") &&
                    (this.options.debug &&
                      window.console &&
                      console.warn &&
                      console.warn(
                        'Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'
                      ),
                    p.StoreData(e[0], "data", p.GetData(e[0], "select2Tags")),
                    p.StoreData(e[0], "tags", !0)),
                  p.GetData(e[0], "ajaxUrl") &&
                    (this.options.debug &&
                      window.console &&
                      console.warn &&
                      console.warn(
                        "Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."
                      ),
                    e.attr("ajax--url", p.GetData(e[0], "ajaxUrl")),
                    p.StoreData(e[0], "ajax-Url", p.GetData(e[0], "ajaxUrl")));
                var n = {};
                function r(e, t) {
                  return t.toUpperCase();
                }
                for (var i = 0; i < e[0].attributes.length; i++) {
                  var o = e[0].attributes[i].name,
                    s = "data-";
                  if (o.substr(0, s.length) == s) {
                    var a = o.substring(s.length),
                      l = p.GetData(e[0], a);
                    n[a.replace(/-([a-z])/g, r)] = l;
                  }
                }
                d.fn.jquery &&
                  "1." == d.fn.jquery.substr(0, 2) &&
                  e[0].dataset &&
                  (n = d.extend(!0, {}, e[0].dataset, n));
                var c = d.extend(!0, {}, p.GetData(e[0]), n);
                for (var u in (c = p._convertData(c)))
                  -1 < d.inArray(u, t) ||
                    (d.isPlainObject(this.options[u])
                      ? d.extend(this.options[u], c[u])
                      : (this.options[u] = c[u]));
                return this;
              }),
              (e.prototype.get = function (e) {
                return this.options[e];
              }),
              (e.prototype.set = function (e, t) {
                this.options[e] = t;
              }),
              e
            );
          }
        ),
        e.define(
          "select2/core",
          ["jquery", "./options", "./utils", "./keys"],
          function (o, c, u, r) {
            var d = function (e, t) {
              null != u.GetData(e[0], "select2") &&
                u.GetData(e[0], "select2").destroy(),
                (this.$element = e),
                (this.id = this._generateId(e)),
                (t = t || {}),
                (this.options = new c(t, e)),
                d.__super__.constructor.call(this);
              var n = e.attr("tabindex") || 0;
              u.StoreData(e[0], "old-tabindex", n), e.attr("tabindex", "-1");
              var r = this.options.get("dataAdapter");
              this.dataAdapter = new r(e, this.options);
              var i = this.render();
              this._placeContainer(i);
              var o = this.options.get("selectionAdapter");
              (this.selection = new o(e, this.options)),
                (this.$selection = this.selection.render()),
                this.selection.position(this.$selection, i);
              var s = this.options.get("dropdownAdapter");
              (this.dropdown = new s(e, this.options)),
                (this.$dropdown = this.dropdown.render()),
                this.dropdown.position(this.$dropdown, i);
              var a = this.options.get("resultsAdapter");
              (this.results = new a(e, this.options, this.dataAdapter)),
                (this.$results = this.results.render()),
                this.results.position(this.$results, this.$dropdown);
              var l = this;
              this._bindAdapters(),
                this._registerDomEvents(),
                this._registerDataEvents(),
                this._registerSelectionEvents(),
                this._registerDropdownEvents(),
                this._registerResultsEvents(),
                this._registerEvents(),
                this.dataAdapter.current(function (e) {
                  l.trigger("selection:update", { data: e });
                }),
                e.addClass("select2-hidden-accessible"),
                e.attr("aria-hidden", "true"),
                this._syncAttributes(),
                u.StoreData(e[0], "select2", this),
                e.data("select2", this);
            };
            return (
              u.Extend(d, u.Observable),
              (d.prototype._generateId = function (e) {
                return (
                  "select2-" +
                  (null != e.attr("id")
                    ? e.attr("id")
                    : null != e.attr("name")
                    ? e.attr("name") + "-" + u.generateChars(2)
                    : u.generateChars(4)
                  ).replace(/(:|\.|\[|\]|,)/g, "")
                );
              }),
              (d.prototype._placeContainer = function (e) {
                e.insertAfter(this.$element);
                var t = this._resolveWidth(
                  this.$element,
                  this.options.get("width")
                );
                null != t && e.css("width", t);
              }),
              (d.prototype._resolveWidth = function (e, t) {
                var n =
                  /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                if ("resolve" == t) {
                  var r = this._resolveWidth(e, "style");
                  return null != r ? r : this._resolveWidth(e, "element");
                }
                if ("element" == t) {
                  var i = e.outerWidth(!1);
                  return i <= 0 ? "auto" : i + "px";
                }
                if ("style" != t)
                  return "computedstyle" != t
                    ? t
                    : window.getComputedStyle(e[0]).width;
                var o = e.attr("style");
                if ("string" != typeof o) return null;
                for (var s = o.split(";"), a = 0, l = s.length; a < l; a += 1) {
                  var c = s[a].replace(/\s/g, "").match(n);
                  if (null !== c && 1 <= c.length) return c[1];
                }
                return null;
              }),
              (d.prototype._bindAdapters = function () {
                this.dataAdapter.bind(this, this.$container),
                  this.selection.bind(this, this.$container),
                  this.dropdown.bind(this, this.$container),
                  this.results.bind(this, this.$container);
              }),
              (d.prototype._registerDomEvents = function () {
                var t = this;
                this.$element.on("change.select2", function () {
                  t.dataAdapter.current(function (e) {
                    t.trigger("selection:update", { data: e });
                  });
                }),
                  this.$element.on("focus.select2", function (e) {
                    t.trigger("focus", e);
                  }),
                  (this._syncA = u.bind(this._syncAttributes, this)),
                  (this._syncS = u.bind(this._syncSubtree, this)),
                  this.$element[0].attachEvent &&
                    this.$element[0].attachEvent(
                      "onpropertychange",
                      this._syncA
                    );
                var e =
                  window.MutationObserver ||
                  window.WebKitMutationObserver ||
                  window.MozMutationObserver;
                null != e
                  ? ((this._observer = new e(function (e) {
                      t._syncA(), t._syncS(null, e);
                    })),
                    this._observer.observe(this.$element[0], {
                      attributes: !0,
                      childList: !0,
                      subtree: !1,
                    }))
                  : this.$element[0].addEventListener &&
                    (this.$element[0].addEventListener(
                      "DOMAttrModified",
                      t._syncA,
                      !1
                    ),
                    this.$element[0].addEventListener(
                      "DOMNodeInserted",
                      t._syncS,
                      !1
                    ),
                    this.$element[0].addEventListener(
                      "DOMNodeRemoved",
                      t._syncS,
                      !1
                    ));
              }),
              (d.prototype._registerDataEvents = function () {
                var n = this;
                this.dataAdapter.on("*", function (e, t) {
                  n.trigger(e, t);
                });
              }),
              (d.prototype._registerSelectionEvents = function () {
                var n = this,
                  r = ["toggle", "focus"];
                this.selection.on("toggle", function () {
                  n.toggleDropdown();
                }),
                  this.selection.on("focus", function (e) {
                    n.focus(e);
                  }),
                  this.selection.on("*", function (e, t) {
                    -1 === o.inArray(e, r) && n.trigger(e, t);
                  });
              }),
              (d.prototype._registerDropdownEvents = function () {
                var n = this;
                this.dropdown.on("*", function (e, t) {
                  n.trigger(e, t);
                });
              }),
              (d.prototype._registerResultsEvents = function () {
                var n = this;
                this.results.on("*", function (e, t) {
                  n.trigger(e, t);
                });
              }),
              (d.prototype._registerEvents = function () {
                var n = this;
                this.on("open", function () {
                  n.$container.addClass("select2-container--open");
                }),
                  this.on("close", function () {
                    n.$container.removeClass("select2-container--open");
                  }),
                  this.on("enable", function () {
                    n.$container.removeClass("select2-container--disabled");
                  }),
                  this.on("disable", function () {
                    n.$container.addClass("select2-container--disabled");
                  }),
                  this.on("blur", function () {
                    n.$container.removeClass("select2-container--focus");
                  }),
                  this.on("query", function (t) {
                    n.isOpen() || n.trigger("open", {}),
                      this.dataAdapter.query(t, function (e) {
                        n.trigger("results:all", { data: e, query: t });
                      });
                  }),
                  this.on("query:append", function (t) {
                    this.dataAdapter.query(t, function (e) {
                      n.trigger("results:append", { data: e, query: t });
                    });
                  }),
                  this.on("keypress", function (e) {
                    var t = e.which;
                    n.isOpen()
                      ? t === r.ESC || t === r.TAB || (t === r.UP && e.altKey)
                        ? (n.close(e), e.preventDefault())
                        : t === r.ENTER
                        ? (n.trigger("results:select", {}), e.preventDefault())
                        : t === r.SPACE && e.ctrlKey
                        ? (n.trigger("results:toggle", {}), e.preventDefault())
                        : t === r.UP
                        ? (n.trigger("results:previous", {}),
                          e.preventDefault())
                        : t === r.DOWN &&
                          (n.trigger("results:next", {}), e.preventDefault())
                      : (t === r.ENTER ||
                          t === r.SPACE ||
                          (t === r.DOWN && e.altKey)) &&
                        (n.open(), e.preventDefault());
                  });
              }),
              (d.prototype._syncAttributes = function () {
                this.options.set("disabled", this.$element.prop("disabled")),
                  this.isDisabled()
                    ? (this.isOpen() && this.close(),
                      this.trigger("disable", {}))
                    : this.trigger("enable", {});
              }),
              (d.prototype._isChangeMutation = function (e, t) {
                var n = !1,
                  r = this;
                if (
                  !e ||
                  !e.target ||
                  "OPTION" === e.target.nodeName ||
                  "OPTGROUP" === e.target.nodeName
                ) {
                  if (t)
                    if (t.addedNodes && 0 < t.addedNodes.length)
                      for (var i = 0; i < t.addedNodes.length; i++) {
                        t.addedNodes[i].selected && (n = !0);
                      }
                    else
                      t.removedNodes && 0 < t.removedNodes.length
                        ? (n = !0)
                        : o.isArray(t) &&
                          o.each(t, function (e, t) {
                            if (r._isChangeMutation(e, t)) return !(n = !0);
                          });
                  else n = !0;
                  return n;
                }
              }),
              (d.prototype._syncSubtree = function (e, t) {
                var n = this._isChangeMutation(e, t),
                  r = this;
                n &&
                  this.dataAdapter.current(function (e) {
                    r.trigger("selection:update", { data: e });
                  });
              }),
              (d.prototype.trigger = function (e, t) {
                var n = d.__super__.trigger,
                  r = {
                    open: "opening",
                    close: "closing",
                    select: "selecting",
                    unselect: "unselecting",
                    clear: "clearing",
                  };
                if ((void 0 === t && (t = {}), e in r)) {
                  var i = r[e],
                    o = { prevented: !1, name: e, args: t };
                  if ((n.call(this, i, o), o.prevented))
                    return void (t.prevented = !0);
                }
                n.call(this, e, t);
              }),
              (d.prototype.toggleDropdown = function () {
                this.isDisabled() ||
                  (this.isOpen() ? this.close() : this.open());
              }),
              (d.prototype.open = function () {
                this.isOpen() || this.isDisabled() || this.trigger("query", {});
              }),
              (d.prototype.close = function (e) {
                this.isOpen() && this.trigger("close", { originalEvent: e });
              }),
              (d.prototype.isEnabled = function () {
                return !this.isDisabled();
              }),
              (d.prototype.isDisabled = function () {
                return this.options.get("disabled");
              }),
              (d.prototype.isOpen = function () {
                return this.$container.hasClass("select2-container--open");
              }),
              (d.prototype.hasFocus = function () {
                return this.$container.hasClass("select2-container--focus");
              }),
              (d.prototype.focus = function (e) {
                this.hasFocus() ||
                  (this.$container.addClass("select2-container--focus"),
                  this.trigger("focus", {}));
              }),
              (d.prototype.enable = function (e) {
                this.options.get("debug") &&
                  window.console &&
                  console.warn &&
                  console.warn(
                    'Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'
                  ),
                  (null != e && 0 !== e.length) || (e = [!0]);
                var t = !e[0];
                this.$element.prop("disabled", t);
              }),
              (d.prototype.data = function () {
                this.options.get("debug") &&
                  0 < arguments.length &&
                  window.console &&
                  console.warn &&
                  console.warn(
                    'Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.'
                  );
                var t = [];
                return (
                  this.dataAdapter.current(function (e) {
                    t = e;
                  }),
                  t
                );
              }),
              (d.prototype.val = function (e) {
                if (
                  (this.options.get("debug") &&
                    window.console &&
                    console.warn &&
                    console.warn(
                      'Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'
                    ),
                  null == e || 0 === e.length)
                )
                  return this.$element.val();
                var t = e[0];
                o.isArray(t) &&
                  (t = o.map(t, function (e) {
                    return e.toString();
                  })),
                  this.$element.val(t).trigger("input").trigger("change");
              }),
              (d.prototype.destroy = function () {
                this.$container.remove(),
                  this.$element[0].detachEvent &&
                    this.$element[0].detachEvent(
                      "onpropertychange",
                      this._syncA
                    ),
                  null != this._observer
                    ? (this._observer.disconnect(), (this._observer = null))
                    : this.$element[0].removeEventListener &&
                      (this.$element[0].removeEventListener(
                        "DOMAttrModified",
                        this._syncA,
                        !1
                      ),
                      this.$element[0].removeEventListener(
                        "DOMNodeInserted",
                        this._syncS,
                        !1
                      ),
                      this.$element[0].removeEventListener(
                        "DOMNodeRemoved",
                        this._syncS,
                        !1
                      )),
                  (this._syncA = null),
                  (this._syncS = null),
                  this.$element.off(".select2"),
                  this.$element.attr(
                    "tabindex",
                    u.GetData(this.$element[0], "old-tabindex")
                  ),
                  this.$element.removeClass("select2-hidden-accessible"),
                  this.$element.attr("aria-hidden", "false"),
                  u.RemoveData(this.$element[0]),
                  this.$element.removeData("select2"),
                  this.dataAdapter.destroy(),
                  this.selection.destroy(),
                  this.dropdown.destroy(),
                  this.results.destroy(),
                  (this.dataAdapter = null),
                  (this.selection = null),
                  (this.dropdown = null),
                  (this.results = null);
              }),
              (d.prototype.render = function () {
                var e = o(
                  '<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>'
                );
                return (
                  e.attr("dir", this.options.get("dir")),
                  (this.$container = e),
                  this.$container.addClass(
                    "select2-container--" + this.options.get("theme")
                  ),
                  u.StoreData(e[0], "element", this.$element),
                  e
                );
              }),
              d
            );
          }
        ),
        e.define("jquery-mousewheel", ["jquery"], function (e) {
          return e;
        }),
        e.define(
          "jquery.select2",
          [
            "jquery",
            "jquery-mousewheel",
            "./select2/core",
            "./select2/defaults",
            "./select2/utils",
          ],
          function (i, e, o, t, s) {
            if (null == i.fn.select2) {
              var a = ["open", "close", "destroy"];
              i.fn.select2 = function (t) {
                if ("object" == typeof (t = t || {}))
                  return (
                    this.each(function () {
                      var e = i.extend(!0, {}, t);
                      new o(i(this), e);
                    }),
                    this
                  );
                if ("string" != typeof t)
                  throw new Error("Invalid arguments for Select2: " + t);
                var n,
                  r = Array.prototype.slice.call(arguments, 1);
                return (
                  this.each(function () {
                    var e = s.GetData(this, "select2");
                    null == e &&
                      window.console &&
                      console.error &&
                      console.error(
                        "The select2('" +
                          t +
                          "') method was called on an element that is not using Select2."
                      ),
                      (n = e[t].apply(e, r));
                  }),
                  -1 < i.inArray(t, a) ? this : n
                );
              };
            }
            return (
              null == i.fn.select2.defaults && (i.fn.select2.defaults = t), o
            );
          }
        ),
        { define: e.define, require: e.require }
      );
    })(),
    t = e.require("jquery.select2");
  return (u.fn.select2.amd = e), t;
});
/* @license MIT https://raw.githubusercontent.com/SortableJS/Sortable/1.15.1/LICENSE */
/*! Sortable 1.15.1 - MIT | git://github.com/SortableJS/Sortable.git */
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t = t || self).Sortable = e());
})(this, function () {
  "use strict";
  function e(e, t) {
    var n,
      o = Object.keys(e);
    return (
      Object.getOwnPropertySymbols &&
        ((n = Object.getOwnPropertySymbols(e)),
        t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
        o.push.apply(o, n)),
      o
    );
  }
  function N(o) {
    for (var t = 1; t < arguments.length; t++) {
      var i = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? e(Object(i), !0).forEach(function (t) {
            var e, n;
            (e = o),
              (t = i[(n = t)]),
              n in e
                ? Object.defineProperty(e, n, {
                    value: t,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[n] = t);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(o, Object.getOwnPropertyDescriptors(i))
        : e(Object(i)).forEach(function (t) {
            Object.defineProperty(o, t, Object.getOwnPropertyDescriptor(i, t));
          });
    }
    return o;
  }
  function o(t) {
    return (o =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          })(t);
  }
  function a() {
    return (a =
      Object.assign ||
      function (t) {
        for (var e = 1; e < arguments.length; e++) {
          var n,
            o = arguments[e];
          for (n in o)
            Object.prototype.hasOwnProperty.call(o, n) && (t[n] = o[n]);
        }
        return t;
      }).apply(this, arguments);
  }
  function i(t, e) {
    if (null == t) return {};
    var n,
      o = (function (t, e) {
        if (null == t) return {};
        for (var n, o = {}, i = Object.keys(t), r = 0; r < i.length; r++)
          (n = i[r]), 0 <= e.indexOf(n) || (o[n] = t[n]);
        return o;
      })(t, e);
    if (Object.getOwnPropertySymbols)
      for (var i = Object.getOwnPropertySymbols(t), r = 0; r < i.length; r++)
        (n = i[r]),
          0 <= e.indexOf(n) ||
            (Object.prototype.propertyIsEnumerable.call(t, n) && (o[n] = t[n]));
    return o;
  }
  function r(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return l(t);
      })(t) ||
      (function (t) {
        if (
          ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
          null != t["@@iterator"]
        )
          return Array.from(t);
      })(t) ||
      (function (t, e) {
        if (t) {
          if ("string" == typeof t) return l(t, e);
          var n = Object.prototype.toString.call(t).slice(8, -1);
          return "Map" ===
            (n = "Object" === n && t.constructor ? t.constructor.name : n) ||
            "Set" === n
            ? Array.from(t)
            : "Arguments" === n ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
            ? l(t, e)
            : void 0;
        }
      })(t) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function l(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, o = new Array(e); n < e; n++) o[n] = t[n];
    return o;
  }
  function t(t) {
    if ("undefined" != typeof window && window.navigator)
      return !!navigator.userAgent.match(t);
  }
  var y = t(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),
    w = t(/Edge/i),
    s = t(/firefox/i),
    u = t(/safari/i) && !t(/chrome/i) && !t(/android/i),
    n = t(/iP(ad|od|hone)/i),
    c = t(/chrome/i) && t(/android/i),
    d = { capture: !1, passive: !1 };
  function h(t, e, n) {
    t.addEventListener(e, n, !y && d);
  }
  function p(t, e, n) {
    t.removeEventListener(e, n, !y && d);
  }
  function f(t, e) {
    if (e && (">" === e[0] && (e = e.substring(1)), t))
      try {
        if (t.matches) return t.matches(e);
        if (t.msMatchesSelector) return t.msMatchesSelector(e);
        if (t.webkitMatchesSelector) return t.webkitMatchesSelector(e);
      } catch (t) {
        return;
      }
  }
  function P(t, e, n, o) {
    if (t) {
      n = n || document;
      do {
        if (
          (null != e && (">" !== e[0] || t.parentNode === n) && f(t, e)) ||
          (o && t === n)
        )
          return t;
      } while (
        t !== n &&
        (t =
          (i = t).host && i !== document && i.host.nodeType
            ? i.host
            : i.parentNode)
      );
    }
    var i;
    return null;
  }
  var g,
    m = /\s+/g;
  function k(t, e, n) {
    var o;
    t &&
      e &&
      (t.classList
        ? t.classList[n ? "add" : "remove"](e)
        : ((o = (" " + t.className + " ")
            .replace(m, " ")
            .replace(" " + e + " ", " ")),
          (t.className = (o + (n ? " " + e : "")).replace(m, " "))));
  }
  function R(t, e, n) {
    var o = t && t.style;
    if (o) {
      if (void 0 === n)
        return (
          document.defaultView && document.defaultView.getComputedStyle
            ? (n = document.defaultView.getComputedStyle(t, ""))
            : t.currentStyle && (n = t.currentStyle),
          void 0 === e ? n : n[e]
        );
      o[(e = !(e in o || -1 !== e.indexOf("webkit")) ? "-webkit-" + e : e)] =
        n + ("string" == typeof n ? "" : "px");
    }
  }
  function v(t, e) {
    var n = "";
    if ("string" == typeof t) n = t;
    else
      do {
        var o = R(t, "transform");
      } while (
        (o && "none" !== o && (n = o + " " + n), !e && (t = t.parentNode))
      );
    var i =
      window.DOMMatrix ||
      window.WebKitCSSMatrix ||
      window.CSSMatrix ||
      window.MSCSSMatrix;
    return i && new i(n);
  }
  function b(t, e, n) {
    if (t) {
      var o = t.getElementsByTagName(e),
        i = 0,
        r = o.length;
      if (n) for (; i < r; i++) n(o[i], i);
      return o;
    }
    return [];
  }
  function O() {
    var t = document.scrollingElement;
    return t || document.documentElement;
  }
  function X(t, e, n, o, i) {
    if (t.getBoundingClientRect || t === window) {
      var r,
        a,
        l,
        s,
        c,
        u,
        d =
          t !== window && t.parentNode && t !== O()
            ? ((a = (r = t.getBoundingClientRect()).top),
              (l = r.left),
              (s = r.bottom),
              (c = r.right),
              (u = r.height),
              r.width)
            : ((l = a = 0),
              (s = window.innerHeight),
              (c = window.innerWidth),
              (u = window.innerHeight),
              window.innerWidth);
      if ((e || n) && t !== window && ((i = i || t.parentNode), !y))
        do {
          if (
            i &&
            i.getBoundingClientRect &&
            ("none" !== R(i, "transform") ||
              (n && "static" !== R(i, "position")))
          ) {
            var h = i.getBoundingClientRect();
            (a -= h.top + parseInt(R(i, "border-top-width"))),
              (l -= h.left + parseInt(R(i, "border-left-width"))),
              (s = a + r.height),
              (c = l + r.width);
            break;
          }
        } while ((i = i.parentNode));
      return (
        o &&
          t !== window &&
          ((o = (e = v(i || t)) && e.a),
          (t = e && e.d),
          e && ((s = (a /= t) + (u /= t)), (c = (l /= o) + (d /= o)))),
        { top: a, left: l, bottom: s, right: c, width: d, height: u }
      );
    }
  }
  function Y(t) {
    var e = X(t),
      n = parseInt(R(t, "padding-left")),
      o = parseInt(R(t, "padding-top")),
      i = parseInt(R(t, "padding-right")),
      r = parseInt(R(t, "padding-bottom"));
    return (
      (e.top += o + parseInt(R(t, "border-top-width"))),
      (e.left += n + parseInt(R(t, "border-left-width"))),
      (e.width = t.clientWidth - n - i),
      (e.height = t.clientHeight - o - r),
      (e.bottom = e.top + e.height),
      (e.right = e.left + e.width),
      e
    );
  }
  function B(t, e, n) {
    for (var o = A(t, !0), i = X(t)[e]; o; ) {
      var r = X(o)[n];
      if (!("top" === n || "left" === n ? r <= i : i <= r)) return o;
      if (o === O()) break;
      o = A(o, !1);
    }
    return !1;
  }
  function F(t, e, n, o) {
    for (var i = 0, r = 0, a = t.children; r < a.length; ) {
      if (
        "none" !== a[r].style.display &&
        a[r] !== Ft.ghost &&
        (o || a[r] !== Ft.dragged) &&
        P(a[r], n.draggable, t, !1)
      ) {
        if (i === e) return a[r];
        i++;
      }
      r++;
    }
    return null;
  }
  function j(t, e) {
    for (
      var n = t.lastElementChild;
      n && (n === Ft.ghost || "none" === R(n, "display") || (e && !f(n, e)));

    )
      n = n.previousElementSibling;
    return n || null;
  }
  function H(t, e) {
    var n = 0;
    if (!t || !t.parentNode) return -1;
    for (; (t = t.previousElementSibling); )
      "TEMPLATE" === t.nodeName.toUpperCase() ||
        t === Ft.clone ||
        (e && !f(t, e)) ||
        n++;
    return n;
  }
  function E(t) {
    var e = 0,
      n = 0,
      o = O();
    if (t)
      do {
        var i = v(t),
          r = i.a,
          i = i.d;
      } while (
        ((e += t.scrollLeft * r),
        (n += t.scrollTop * i),
        t !== o && (t = t.parentNode))
      );
    return [e, n];
  }
  function A(t, e) {
    if (!t || !t.getBoundingClientRect) return O();
    var n = t,
      o = !1;
    do {
      if (n.clientWidth < n.scrollWidth || n.clientHeight < n.scrollHeight) {
        var i = R(n);
        if (
          (n.clientWidth < n.scrollWidth &&
            ("auto" == i.overflowX || "scroll" == i.overflowX)) ||
          (n.clientHeight < n.scrollHeight &&
            ("auto" == i.overflowY || "scroll" == i.overflowY))
        ) {
          if (!n.getBoundingClientRect || n === document.body) return O();
          if (o || e) return n;
          o = !0;
        }
      }
    } while ((n = n.parentNode));
    return O();
  }
  function D(t, e) {
    return (
      Math.round(t.top) === Math.round(e.top) &&
      Math.round(t.left) === Math.round(e.left) &&
      Math.round(t.height) === Math.round(e.height) &&
      Math.round(t.width) === Math.round(e.width)
    );
  }
  function S(e, n) {
    return function () {
      var t;
      g ||
        (1 === (t = arguments).length ? e.call(this, t[0]) : e.apply(this, t),
        (g = setTimeout(function () {
          g = void 0;
        }, n)));
    };
  }
  function L(t, e, n) {
    (t.scrollLeft += e), (t.scrollTop += n);
  }
  function _(t) {
    var e = window.Polymer,
      n = window.jQuery || window.Zepto;
    return e && e.dom
      ? e.dom(t).cloneNode(!0)
      : n
      ? n(t).clone(!0)[0]
      : t.cloneNode(!0);
  }
  function C(t, e) {
    R(t, "position", "absolute"),
      R(t, "top", e.top),
      R(t, "left", e.left),
      R(t, "width", e.width),
      R(t, "height", e.height);
  }
  function T(t) {
    R(t, "position", ""),
      R(t, "top", ""),
      R(t, "left", ""),
      R(t, "width", ""),
      R(t, "height", "");
  }
  var W = "Sortable" + new Date().getTime();
  function x() {
    var e,
      o = [];
    return {
      captureAnimationState: function () {
        (o = []),
          this.options.animation &&
            [].slice.call(this.el.children).forEach(function (t) {
              var e, n;
              "none" !== R(t, "display") &&
                t !== Ft.ghost &&
                (o.push({ target: t, rect: X(t) }),
                (e = N({}, o[o.length - 1].rect)),
                !t.thisAnimationDuration ||
                  ((n = v(t, !0)) && ((e.top -= n.f), (e.left -= n.e))),
                (t.fromRect = e));
            });
      },
      addAnimationState: function (t) {
        o.push(t);
      },
      removeAnimationState: function (t) {
        o.splice(
          (function (t, e) {
            for (var n in t)
              if (t.hasOwnProperty(n))
                for (var o in e)
                  if (e.hasOwnProperty(o) && e[o] === t[n][o]) return Number(n);
            return -1;
          })(o, { target: t }),
          1
        );
      },
      animateAll: function (t) {
        var c = this;
        if (!this.options.animation)
          return clearTimeout(e), void ("function" == typeof t && t());
        var u = !1,
          d = 0;
        o.forEach(function (t) {
          var e = 0,
            n = t.target,
            o = n.fromRect,
            i = X(n),
            r = n.prevFromRect,
            a = n.prevToRect,
            l = t.rect,
            s = v(n, !0);
          s && ((i.top -= s.f), (i.left -= s.e)),
            (n.toRect = i),
            n.thisAnimationDuration &&
              D(r, i) &&
              !D(o, i) &&
              (l.top - i.top) / (l.left - i.left) ==
                (o.top - i.top) / (o.left - i.left) &&
              ((t = l),
              (s = r),
              (r = a),
              (a = c.options),
              (e =
                (Math.sqrt(
                  Math.pow(s.top - t.top, 2) + Math.pow(s.left - t.left, 2)
                ) /
                  Math.sqrt(
                    Math.pow(s.top - r.top, 2) + Math.pow(s.left - r.left, 2)
                  )) *
                a.animation)),
            D(i, o) ||
              ((n.prevFromRect = o),
              (n.prevToRect = i),
              (e = e || c.options.animation),
              c.animate(n, l, i, e)),
            e &&
              ((u = !0),
              (d = Math.max(d, e)),
              clearTimeout(n.animationResetTimer),
              (n.animationResetTimer = setTimeout(function () {
                (n.animationTime = 0),
                  (n.prevFromRect = null),
                  (n.fromRect = null),
                  (n.prevToRect = null),
                  (n.thisAnimationDuration = null);
              }, e)),
              (n.thisAnimationDuration = e));
        }),
          clearTimeout(e),
          u
            ? (e = setTimeout(function () {
                "function" == typeof t && t();
              }, d))
            : "function" == typeof t && t(),
          (o = []);
      },
      animate: function (t, e, n, o) {
        var i, r;
        o &&
          (R(t, "transition", ""),
          R(t, "transform", ""),
          (i = (r = v(this.el)) && r.a),
          (r = r && r.d),
          (i = (e.left - n.left) / (i || 1)),
          (r = (e.top - n.top) / (r || 1)),
          (t.animatingX = !!i),
          (t.animatingY = !!r),
          R(t, "transform", "translate3d(" + i + "px," + r + "px,0)"),
          (this.forRepaintDummy = t.offsetWidth),
          R(
            t,
            "transition",
            "transform " +
              o +
              "ms" +
              (this.options.easing ? " " + this.options.easing : "")
          ),
          R(t, "transform", "translate3d(0,0,0)"),
          "number" == typeof t.animated && clearTimeout(t.animated),
          (t.animated = setTimeout(function () {
            R(t, "transition", ""),
              R(t, "transform", ""),
              (t.animated = !1),
              (t.animatingX = !1),
              (t.animatingY = !1);
          }, o)));
      },
    };
  }
  var M = [],
    I = { initializeByDefault: !0 },
    K = {
      mount: function (e) {
        for (var t in I) !I.hasOwnProperty(t) || t in e || (e[t] = I[t]);
        M.forEach(function (t) {
          if (t.pluginName === e.pluginName)
            throw "Sortable: Cannot mount plugin ".concat(
              e.pluginName,
              " more than once"
            );
        }),
          M.push(e);
      },
      pluginEvent: function (e, n, o) {
        var t = this;
        (this.eventCanceled = !1),
          (o.cancel = function () {
            t.eventCanceled = !0;
          });
        var i = e + "Global";
        M.forEach(function (t) {
          n[t.pluginName] &&
            (n[t.pluginName][i] && n[t.pluginName][i](N({ sortable: n }, o)),
            n.options[t.pluginName] &&
              n[t.pluginName][e] &&
              n[t.pluginName][e](N({ sortable: n }, o)));
        });
      },
      initializePlugins: function (n, o, i, t) {
        for (var e in (M.forEach(function (t) {
          var e = t.pluginName;
          (n.options[e] || t.initializeByDefault) &&
            (((t = new t(n, o, n.options)).sortable = n),
            (t.options = n.options),
            (n[e] = t),
            a(i, t.defaults));
        }),
        n.options)) {
          var r;
          n.options.hasOwnProperty(e) &&
            void 0 !== (r = this.modifyOption(n, e, n.options[e])) &&
            (n.options[e] = r);
        }
      },
      getEventProperties: function (e, n) {
        var o = {};
        return (
          M.forEach(function (t) {
            "function" == typeof t.eventProperties &&
              a(o, t.eventProperties.call(n[t.pluginName], e));
          }),
          o
        );
      },
      modifyOption: function (e, n, o) {
        var i;
        return (
          M.forEach(function (t) {
            e[t.pluginName] &&
              t.optionListeners &&
              "function" == typeof t.optionListeners[n] &&
              (i = t.optionListeners[n].call(e[t.pluginName], o));
          }),
          i
        );
      },
    };
  function z(t) {
    var e = t.sortable,
      n = t.rootEl,
      o = t.name,
      i = t.targetEl,
      r = t.cloneEl,
      a = t.toEl,
      l = t.fromEl,
      s = t.oldIndex,
      c = t.newIndex,
      u = t.oldDraggableIndex,
      d = t.newDraggableIndex,
      h = t.originalEvent,
      p = t.putSortable,
      f = t.extraEventProperties;
    if ((e = e || (n && n[W]))) {
      var g,
        m = e.options,
        t = "on" + o.charAt(0).toUpperCase() + o.substr(1);
      !window.CustomEvent || y || w
        ? (g = document.createEvent("Event")).initEvent(o, !0, !0)
        : (g = new CustomEvent(o, { bubbles: !0, cancelable: !0 })),
        (g.to = a || n),
        (g.from = l || n),
        (g.item = i || n),
        (g.clone = r),
        (g.oldIndex = s),
        (g.newIndex = c),
        (g.oldDraggableIndex = u),
        (g.newDraggableIndex = d),
        (g.originalEvent = h),
        (g.pullMode = p ? p.lastPutMode : void 0);
      var v,
        b = N(N({}, f), K.getEventProperties(o, e));
      for (v in b) g[v] = b[v];
      n && n.dispatchEvent(g), m[t] && m[t].call(e, g);
    }
  }
  function G(t, e) {
    var n = (o =
        2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {})
        .evt,
      o = i(o, U);
    K.pluginEvent.bind(Ft)(
      t,
      e,
      N(
        {
          dragEl: V,
          parentEl: Z,
          ghostEl: $,
          rootEl: Q,
          nextEl: J,
          lastDownEl: tt,
          cloneEl: et,
          cloneHidden: nt,
          dragStarted: gt,
          putSortable: st,
          activeSortable: Ft.active,
          originalEvent: n,
          oldIndex: ot,
          oldDraggableIndex: rt,
          newIndex: it,
          newDraggableIndex: at,
          hideGhostForTarget: Rt,
          unhideGhostForTarget: Xt,
          cloneNowHidden: function () {
            nt = !0;
          },
          cloneNowShown: function () {
            nt = !1;
          },
          dispatchSortableEvent: function (t) {
            q({ sortable: e, name: t, originalEvent: n });
          },
        },
        o
      )
    );
  }
  var U = ["evt"];
  function q(t) {
    z(
      N(
        {
          putSortable: st,
          cloneEl: et,
          targetEl: V,
          rootEl: Q,
          oldIndex: ot,
          oldDraggableIndex: rt,
          newIndex: it,
          newDraggableIndex: at,
        },
        t
      )
    );
  }
  var V,
    Z,
    $,
    Q,
    J,
    tt,
    et,
    nt,
    ot,
    it,
    rt,
    at,
    lt,
    st,
    ct,
    ut,
    dt,
    ht,
    pt,
    ft,
    gt,
    mt,
    vt,
    bt,
    yt,
    wt = !1,
    Et = !1,
    Dt = [],
    St = !1,
    _t = !1,
    Ct = [],
    Tt = !1,
    xt = [],
    Ot = "undefined" != typeof document,
    At = n,
    Mt = w || y ? "cssFloat" : "float",
    It = Ot && !c && !n && "draggable" in document.createElement("div"),
    Nt = (function () {
      if (Ot) {
        if (y) return !1;
        var t = document.createElement("x");
        return (
          (t.style.cssText = "pointer-events:auto"),
          "auto" === t.style.pointerEvents
        );
      }
    })(),
    Pt = function (t, e) {
      var n = R(t),
        o =
          parseInt(n.width) -
          parseInt(n.paddingLeft) -
          parseInt(n.paddingRight) -
          parseInt(n.borderLeftWidth) -
          parseInt(n.borderRightWidth),
        i = F(t, 0, e),
        r = F(t, 1, e),
        a = i && R(i),
        l = r && R(r),
        s = a && parseInt(a.marginLeft) + parseInt(a.marginRight) + X(i).width,
        t = l && parseInt(l.marginLeft) + parseInt(l.marginRight) + X(r).width;
      if ("flex" === n.display)
        return "column" === n.flexDirection ||
          "column-reverse" === n.flexDirection
          ? "vertical"
          : "horizontal";
      if ("grid" === n.display)
        return n.gridTemplateColumns.split(" ").length <= 1
          ? "vertical"
          : "horizontal";
      if (i && a.float && "none" !== a.float) {
        e = "left" === a.float ? "left" : "right";
        return !r || ("both" !== l.clear && l.clear !== e)
          ? "horizontal"
          : "vertical";
      }
      return i &&
        ("block" === a.display ||
          "flex" === a.display ||
          "table" === a.display ||
          "grid" === a.display ||
          (o <= s && "none" === n[Mt]) ||
          (r && "none" === n[Mt] && o < s + t))
        ? "vertical"
        : "horizontal";
    },
    kt = function (t) {
      function l(r, a) {
        return function (t, e, n, o) {
          var i =
            t.options.group.name &&
            e.options.group.name &&
            t.options.group.name === e.options.group.name;
          if (null == r && (a || i)) return !0;
          if (null == r || !1 === r) return !1;
          if (a && "clone" === r) return r;
          if ("function" == typeof r) return l(r(t, e, n, o), a)(t, e, n, o);
          e = (a ? t : e).options.group.name;
          return (
            !0 === r ||
            ("string" == typeof r && r === e) ||
            (r.join && -1 < r.indexOf(e))
          );
        };
      }
      var e = {},
        n = t.group;
      (n && "object" == o(n)) || (n = { name: n }),
        (e.name = n.name),
        (e.checkPull = l(n.pull, !0)),
        (e.checkPut = l(n.put)),
        (e.revertClone = n.revertClone),
        (t.group = e);
    },
    Rt = function () {
      !Nt && $ && R($, "display", "none");
    },
    Xt = function () {
      !Nt && $ && R($, "display", "");
    };
  Ot &&
    !c &&
    document.addEventListener(
      "click",
      function (t) {
        if (Et)
          return (
            t.preventDefault(),
            t.stopPropagation && t.stopPropagation(),
            t.stopImmediatePropagation && t.stopImmediatePropagation(),
            (Et = !1)
          );
      },
      !0
    );
  function Yt(t) {
    if (V) {
      t = t.touches ? t.touches[0] : t;
      var e =
        ((i = t.clientX),
        (r = t.clientY),
        Dt.some(function (t) {
          var e = t[W].options.emptyInsertThreshold;
          if (e && !j(t)) {
            var n = X(t),
              o = i >= n.left - e && i <= n.right + e,
              e = r >= n.top - e && r <= n.bottom + e;
            return o && e ? (a = t) : void 0;
          }
        }),
        a);
      if (e) {
        var n,
          o = {};
        for (n in t) t.hasOwnProperty(n) && (o[n] = t[n]);
        (o.target = o.rootEl = e),
          (o.preventDefault = void 0),
          (o.stopPropagation = void 0),
          e[W]._onDragOver(o);
      }
    }
    var i, r, a;
  }
  function Bt(t) {
    V && V.parentNode[W]._isOutsideThisEl(t.target);
  }
  function Ft(t, e) {
    if (!t || !t.nodeType || 1 !== t.nodeType)
      throw "Sortable: `el` must be an HTMLElement, not ".concat(
        {}.toString.call(t)
      );
    (this.el = t), (this.options = e = a({}, e)), (t[W] = this);
    var n,
      o,
      i = {
        group: null,
        sort: !0,
        disabled: !1,
        store: null,
        handle: null,
        draggable: /^[uo]l$/i.test(t.nodeName) ? ">li" : ">*",
        swapThreshold: 1,
        invertSwap: !1,
        invertedSwapThreshold: null,
        removeCloneOnHide: !0,
        direction: function () {
          return Pt(t, this.options);
        },
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        ignore: "a, img",
        filter: null,
        preventOnFilter: !0,
        animation: 0,
        easing: null,
        setData: function (t, e) {
          t.setData("Text", e.textContent);
        },
        dropBubble: !1,
        dragoverBubble: !1,
        dataIdAttr: "data-id",
        delay: 0,
        delayOnTouchOnly: !1,
        touchStartThreshold:
          (Number.parseInt ? Number : window).parseInt(
            window.devicePixelRatio,
            10
          ) || 1,
        forceFallback: !1,
        fallbackClass: "sortable-fallback",
        fallbackOnBody: !1,
        fallbackTolerance: 0,
        fallbackOffset: { x: 0, y: 0 },
        supportPointer:
          !1 !== Ft.supportPointer && "PointerEvent" in window && !u,
        emptyInsertThreshold: 5,
      };
    for (n in (K.initializePlugins(this, t, i), i)) n in e || (e[n] = i[n]);
    for (o in (kt(e), this))
      "_" === o.charAt(0) &&
        "function" == typeof this[o] &&
        (this[o] = this[o].bind(this));
    (this.nativeDraggable = !e.forceFallback && It),
      this.nativeDraggable && (this.options.touchStartThreshold = 1),
      e.supportPointer
        ? h(t, "pointerdown", this._onTapStart)
        : (h(t, "mousedown", this._onTapStart),
          h(t, "touchstart", this._onTapStart)),
      this.nativeDraggable && (h(t, "dragover", this), h(t, "dragenter", this)),
      Dt.push(this.el),
      e.store && e.store.get && this.sort(e.store.get(this) || []),
      a(this, x());
  }
  function jt(t, e, n, o, i, r, a, l) {
    var s,
      c,
      u = t[W],
      d = u.options.onMove;
    return (
      !window.CustomEvent || y || w
        ? (s = document.createEvent("Event")).initEvent("move", !0, !0)
        : (s = new CustomEvent("move", { bubbles: !0, cancelable: !0 })),
      (s.to = e),
      (s.from = t),
      (s.dragged = n),
      (s.draggedRect = o),
      (s.related = i || e),
      (s.relatedRect = r || X(e)),
      (s.willInsertAfter = l),
      (s.originalEvent = a),
      t.dispatchEvent(s),
      (c = d ? d.call(u, s, a) : c)
    );
  }
  function Ht(t) {
    t.draggable = !1;
  }
  function Lt() {
    Tt = !1;
  }
  function Wt(t) {
    return setTimeout(t, 0);
  }
  function Kt(t) {
    return clearTimeout(t);
  }
  (Ft.prototype = {
    constructor: Ft,
    _isOutsideThisEl: function (t) {
      this.el.contains(t) || t === this.el || (mt = null);
    },
    _getDirection: function (t, e) {
      return "function" == typeof this.options.direction
        ? this.options.direction.call(this, t, e, V)
        : this.options.direction;
    },
    _onTapStart: function (e) {
      if (e.cancelable) {
        var n = this,
          o = this.el,
          t = this.options,
          i = t.preventOnFilter,
          r = e.type,
          a =
            (e.touches && e.touches[0]) ||
            (e.pointerType && "touch" === e.pointerType && e),
          l = (a || e).target,
          s =
            (e.target.shadowRoot &&
              ((e.path && e.path[0]) ||
                (e.composedPath && e.composedPath()[0]))) ||
            l,
          c = t.filter;
        if (
          (!(function (t) {
            xt.length = 0;
            var e = t.getElementsByTagName("input"),
              n = e.length;
            for (; n--; ) {
              var o = e[n];
              o.checked && xt.push(o);
            }
          })(o),
          !V &&
            !(
              (/mousedown|pointerdown/.test(r) && 0 !== e.button) ||
              t.disabled
            ) &&
            !s.isContentEditable &&
            (this.nativeDraggable ||
              !u ||
              !l ||
              "SELECT" !== l.tagName.toUpperCase()) &&
            !(((l = P(l, t.draggable, o, !1)) && l.animated) || tt === l))
        ) {
          if (((ot = H(l)), (rt = H(l, t.draggable)), "function" == typeof c)) {
            if (c.call(this, e, l, this))
              return (
                q({
                  sortable: n,
                  rootEl: s,
                  name: "filter",
                  targetEl: l,
                  toEl: o,
                  fromEl: o,
                }),
                G("filter", n, { evt: e }),
                void (i && e.cancelable && e.preventDefault())
              );
          } else if (
            (c =
              c &&
              c.split(",").some(function (t) {
                if ((t = P(s, t.trim(), o, !1)))
                  return (
                    q({
                      sortable: n,
                      rootEl: t,
                      name: "filter",
                      targetEl: l,
                      fromEl: o,
                      toEl: o,
                    }),
                    G("filter", n, { evt: e }),
                    !0
                  );
              }))
          )
            return void (i && e.cancelable && e.preventDefault());
          (t.handle && !P(s, t.handle, o, !1)) ||
            this._prepareDragStart(e, a, l);
        }
      }
    },
    _prepareDragStart: function (t, e, n) {
      var o,
        i = this,
        r = i.el,
        a = i.options,
        l = r.ownerDocument;
      n &&
        !V &&
        n.parentNode === r &&
        ((o = X(n)),
        (Q = r),
        (Z = (V = n).parentNode),
        (J = V.nextSibling),
        (tt = n),
        (lt = a.group),
        (ct = {
          target: (Ft.dragged = V),
          clientX: (e || t).clientX,
          clientY: (e || t).clientY,
        }),
        (pt = ct.clientX - o.left),
        (ft = ct.clientY - o.top),
        (this._lastX = (e || t).clientX),
        (this._lastY = (e || t).clientY),
        (V.style["will-change"] = "all"),
        (o = function () {
          G("delayEnded", i, { evt: t }),
            Ft.eventCanceled
              ? i._onDrop()
              : (i._disableDelayedDragEvents(),
                !s && i.nativeDraggable && (V.draggable = !0),
                i._triggerDragStart(t, e),
                q({ sortable: i, name: "choose", originalEvent: t }),
                k(V, a.chosenClass, !0));
        }),
        a.ignore.split(",").forEach(function (t) {
          b(V, t.trim(), Ht);
        }),
        h(l, "dragover", Yt),
        h(l, "mousemove", Yt),
        h(l, "touchmove", Yt),
        h(l, "mouseup", i._onDrop),
        h(l, "touchend", i._onDrop),
        h(l, "touchcancel", i._onDrop),
        s &&
          this.nativeDraggable &&
          ((this.options.touchStartThreshold = 4), (V.draggable = !0)),
        G("delayStart", this, { evt: t }),
        !a.delay ||
        (a.delayOnTouchOnly && !e) ||
        (this.nativeDraggable && (w || y))
          ? o()
          : Ft.eventCanceled
          ? this._onDrop()
          : (h(l, "mouseup", i._disableDelayedDrag),
            h(l, "touchend", i._disableDelayedDrag),
            h(l, "touchcancel", i._disableDelayedDrag),
            h(l, "mousemove", i._delayedDragTouchMoveHandler),
            h(l, "touchmove", i._delayedDragTouchMoveHandler),
            a.supportPointer &&
              h(l, "pointermove", i._delayedDragTouchMoveHandler),
            (i._dragStartTimer = setTimeout(o, a.delay))));
    },
    _delayedDragTouchMoveHandler: function (t) {
      t = t.touches ? t.touches[0] : t;
      Math.max(
        Math.abs(t.clientX - this._lastX),
        Math.abs(t.clientY - this._lastY)
      ) >=
        Math.floor(
          this.options.touchStartThreshold /
            ((this.nativeDraggable && window.devicePixelRatio) || 1)
        ) && this._disableDelayedDrag();
    },
    _disableDelayedDrag: function () {
      V && Ht(V),
        clearTimeout(this._dragStartTimer),
        this._disableDelayedDragEvents();
    },
    _disableDelayedDragEvents: function () {
      var t = this.el.ownerDocument;
      p(t, "mouseup", this._disableDelayedDrag),
        p(t, "touchend", this._disableDelayedDrag),
        p(t, "touchcancel", this._disableDelayedDrag),
        p(t, "mousemove", this._delayedDragTouchMoveHandler),
        p(t, "touchmove", this._delayedDragTouchMoveHandler),
        p(t, "pointermove", this._delayedDragTouchMoveHandler);
    },
    _triggerDragStart: function (t, e) {
      (e = e || ("touch" == t.pointerType && t)),
        !this.nativeDraggable || e
          ? this.options.supportPointer
            ? h(document, "pointermove", this._onTouchMove)
            : h(document, e ? "touchmove" : "mousemove", this._onTouchMove)
          : (h(V, "dragend", this), h(Q, "dragstart", this._onDragStart));
      try {
        document.selection
          ? Wt(function () {
              document.selection.empty();
            })
          : window.getSelection().removeAllRanges();
      } catch (t) {}
    },
    _dragStarted: function (t, e) {
      var n;
      (wt = !1),
        Q && V
          ? (G("dragStarted", this, { evt: e }),
            this.nativeDraggable && h(document, "dragover", Bt),
            (n = this.options),
            t || k(V, n.dragClass, !1),
            k(V, n.ghostClass, !0),
            (Ft.active = this),
            t && this._appendGhost(),
            q({ sortable: this, name: "start", originalEvent: e }))
          : this._nulling();
    },
    _emulateDragOver: function () {
      if (ut) {
        (this._lastX = ut.clientX), (this._lastY = ut.clientY), Rt();
        for (
          var t = document.elementFromPoint(ut.clientX, ut.clientY), e = t;
          t &&
          t.shadowRoot &&
          (t = t.shadowRoot.elementFromPoint(ut.clientX, ut.clientY)) !== e;

        )
          e = t;
        if ((V.parentNode[W]._isOutsideThisEl(t), e))
          do {
            if (e[W])
              if (
                e[W]._onDragOver({
                  clientX: ut.clientX,
                  clientY: ut.clientY,
                  target: t,
                  rootEl: e,
                }) &&
                !this.options.dragoverBubble
              )
                break;
          } while ((e = (t = e).parentNode));
        Xt();
      }
    },
    _onTouchMove: function (t) {
      if (ct) {
        var e = this.options,
          n = e.fallbackTolerance,
          o = e.fallbackOffset,
          i = t.touches ? t.touches[0] : t,
          r = $ && v($, !0),
          a = $ && r && r.a,
          l = $ && r && r.d,
          e = At && yt && E(yt),
          a =
            (i.clientX - ct.clientX + o.x) / (a || 1) +
            (e ? e[0] - Ct[0] : 0) / (a || 1),
          l =
            (i.clientY - ct.clientY + o.y) / (l || 1) +
            (e ? e[1] - Ct[1] : 0) / (l || 1);
        if (!Ft.active && !wt) {
          if (
            n &&
            Math.max(
              Math.abs(i.clientX - this._lastX),
              Math.abs(i.clientY - this._lastY)
            ) < n
          )
            return;
          this._onDragStart(t, !0);
        }
        $ &&
          (r
            ? ((r.e += a - (dt || 0)), (r.f += l - (ht || 0)))
            : (r = { a: 1, b: 0, c: 0, d: 1, e: a, f: l }),
          (r = "matrix("
            .concat(r.a, ",")
            .concat(r.b, ",")
            .concat(r.c, ",")
            .concat(r.d, ",")
            .concat(r.e, ",")
            .concat(r.f, ")")),
          R($, "webkitTransform", r),
          R($, "mozTransform", r),
          R($, "msTransform", r),
          R($, "transform", r),
          (dt = a),
          (ht = l),
          (ut = i)),
          t.cancelable && t.preventDefault();
      }
    },
    _appendGhost: function () {
      if (!$) {
        var t = this.options.fallbackOnBody ? document.body : Q,
          e = X(V, !0, At, !0, t),
          n = this.options;
        if (At) {
          for (
            yt = t;
            "static" === R(yt, "position") &&
            "none" === R(yt, "transform") &&
            yt !== document;

          )
            yt = yt.parentNode;
          yt !== document.body && yt !== document.documentElement
            ? (yt === document && (yt = O()),
              (e.top += yt.scrollTop),
              (e.left += yt.scrollLeft))
            : (yt = O()),
            (Ct = E(yt));
        }
        k(($ = V.cloneNode(!0)), n.ghostClass, !1),
          k($, n.fallbackClass, !0),
          k($, n.dragClass, !0),
          R($, "transition", ""),
          R($, "transform", ""),
          R($, "box-sizing", "border-box"),
          R($, "margin", 0),
          R($, "top", e.top),
          R($, "left", e.left),
          R($, "width", e.width),
          R($, "height", e.height),
          R($, "opacity", "0.8"),
          R($, "position", At ? "absolute" : "fixed"),
          R($, "zIndex", "100000"),
          R($, "pointerEvents", "none"),
          (Ft.ghost = $),
          t.appendChild($),
          R(
            $,
            "transform-origin",
            (pt / parseInt($.style.width)) * 100 +
              "% " +
              (ft / parseInt($.style.height)) * 100 +
              "%"
          );
      }
    },
    _onDragStart: function (t, e) {
      var n = this,
        o = t.dataTransfer,
        i = n.options;
      G("dragStart", this, { evt: t }),
        Ft.eventCanceled
          ? this._onDrop()
          : (G("setupClone", this),
            Ft.eventCanceled ||
              ((et = _(V)).removeAttribute("id"),
              (et.draggable = !1),
              (et.style["will-change"] = ""),
              this._hideClone(),
              k(et, this.options.chosenClass, !1),
              (Ft.clone = et)),
            (n.cloneId = Wt(function () {
              G("clone", n),
                Ft.eventCanceled ||
                  (n.options.removeCloneOnHide || Q.insertBefore(et, V),
                  n._hideClone(),
                  q({ sortable: n, name: "clone" }));
            })),
            e || k(V, i.dragClass, !0),
            e
              ? ((Et = !0), (n._loopId = setInterval(n._emulateDragOver, 50)))
              : (p(document, "mouseup", n._onDrop),
                p(document, "touchend", n._onDrop),
                p(document, "touchcancel", n._onDrop),
                o &&
                  ((o.effectAllowed = "move"),
                  i.setData && i.setData.call(n, o, V)),
                h(document, "drop", n),
                R(V, "transform", "translateZ(0)")),
            (wt = !0),
            (n._dragStartId = Wt(n._dragStarted.bind(n, e, t))),
            h(document, "selectstart", n),
            (gt = !0),
            u && R(document.body, "user-select", "none"));
    },
    _onDragOver: function (n) {
      var o,
        i,
        r,
        t,
        e,
        a = this.el,
        l = n.target,
        s = this.options,
        c = s.group,
        u = Ft.active,
        d = lt === c,
        h = s.sort,
        p = st || u,
        f = this,
        g = !1;
      if (!Tt) {
        if (
          (void 0 !== n.preventDefault && n.cancelable && n.preventDefault(),
          (l = P(l, s.draggable, a, !0)),
          O("dragOver"),
          Ft.eventCanceled)
        )
          return g;
        if (
          V.contains(n.target) ||
          (l.animated && l.animatingX && l.animatingY) ||
          f._ignoreWhileAnimating === l
        )
          return M(!1);
        if (
          ((Et = !1),
          u &&
            !s.disabled &&
            (d
              ? h || (i = Z !== Q)
              : st === this ||
                ((this.lastPutMode = lt.checkPull(this, u, V, n)) &&
                  c.checkPut(this, u, V, n))))
        ) {
          if (
            ((r = "vertical" === this._getDirection(n, l)),
            (o = X(V)),
            O("dragOverValid"),
            Ft.eventCanceled)
          )
            return g;
          if (i)
            return (
              (Z = Q),
              A(),
              this._hideClone(),
              O("revert"),
              Ft.eventCanceled || (J ? Q.insertBefore(V, J) : Q.appendChild(V)),
              M(!0)
            );
          var m = j(a, s.draggable);
          if (
            m &&
            ((S = n),
            (c = r),
            (x = X(j((D = this).el, D.options.draggable))),
            (D = Y(D.el)),
            !(c
              ? S.clientX > D.right + 10 ||
                (S.clientY > x.bottom && S.clientX > x.left)
              : S.clientY > D.bottom + 10 ||
                (S.clientX > x.right && S.clientY > x.top)) || m.animated)
          ) {
            if (
              m &&
              ((t = n),
              (e = r),
              (C = X(F((_ = this).el, 0, _.options, !0))),
              (_ = Y(_.el)),
              e
                ? t.clientX < _.left - 10 ||
                  (t.clientY < C.top && t.clientX < C.right)
                : t.clientY < _.top - 10 ||
                  (t.clientY < C.bottom && t.clientX < C.left))
            ) {
              var v = F(a, 0, s, !0);
              if (v === V) return M(!1);
              if (((E = X((l = v))), !1 !== jt(Q, a, V, o, l, E, n, !1)))
                return A(), a.insertBefore(V, v), (Z = a), I(), M(!0);
            } else if (l.parentNode === a) {
              var b,
                y,
                w,
                E = X(l),
                D = V.parentNode !== a,
                S =
                  ((S = (V.animated && V.toRect) || o),
                  (x = (l.animated && l.toRect) || E),
                  (_ = (e = r) ? S.left : S.top),
                  (t = e ? S.right : S.bottom),
                  (C = e ? S.width : S.height),
                  (v = e ? x.left : x.top),
                  (S = e ? x.right : x.bottom),
                  (x = e ? x.width : x.height),
                  !(_ === v || t === S || _ + C / 2 === v + x / 2)),
                _ = r ? "top" : "left",
                C = B(l, "top", "top") || B(V, "top", "top"),
                v = C ? C.scrollTop : void 0;
              if (
                (mt !== l &&
                  ((y = E[_]), (St = !1), (_t = (!S && s.invertSwap) || D)),
                0 !==
                  (b = (function (t, e, n, o, i, r, a, l) {
                    var s = o ? t.clientY : t.clientX,
                      c = o ? n.height : n.width,
                      t = o ? n.top : n.left,
                      o = o ? n.bottom : n.right,
                      n = !1;
                    if (!a)
                      if (l && bt < c * i) {
                        if (
                          (St =
                            !St &&
                            (1 === vt
                              ? t + (c * r) / 2 < s
                              : s < o - (c * r) / 2)
                              ? !0
                              : St)
                        )
                          n = !0;
                        else if (1 === vt ? s < t + bt : o - bt < s) return -vt;
                      } else if (
                        t + (c * (1 - i)) / 2 < s &&
                        s < o - (c * (1 - i)) / 2
                      )
                        return (function (t) {
                          return H(V) < H(t) ? 1 : -1;
                        })(e);
                    if (
                      (n = n || a) &&
                      (s < t + (c * r) / 2 || o - (c * r) / 2 < s)
                    )
                      return t + c / 2 < s ? 1 : -1;
                    return 0;
                  })(
                    n,
                    l,
                    E,
                    r,
                    S ? 1 : s.swapThreshold,
                    null == s.invertedSwapThreshold
                      ? s.swapThreshold
                      : s.invertedSwapThreshold,
                    _t,
                    mt === l
                  )))
              )
                for (
                  var T = H(V);
                  (w = Z.children[(T -= b)]) &&
                  ("none" === R(w, "display") || w === $);

                );
              if (0 === b || w === l) return M(!1);
              vt = b;
              var x = (mt = l).nextElementSibling,
                D = !1,
                S = jt(Q, a, V, o, l, E, n, (D = 1 === b));
              if (!1 !== S)
                return (
                  (1 !== S && -1 !== S) || (D = 1 === S),
                  (Tt = !0),
                  setTimeout(Lt, 30),
                  A(),
                  D && !x
                    ? a.appendChild(V)
                    : l.parentNode.insertBefore(V, D ? x : l),
                  C && L(C, 0, v - C.scrollTop),
                  (Z = V.parentNode),
                  void 0 === y || _t || (bt = Math.abs(y - X(l)[_])),
                  I(),
                  M(!0)
                );
            }
          } else {
            if (m === V) return M(!1);
            if (
              ((l = m && a === n.target ? m : l) && (E = X(l)),
              !1 !== jt(Q, a, V, o, l, E, n, !!l))
            )
              return (
                A(),
                m && m.nextSibling
                  ? a.insertBefore(V, m.nextSibling)
                  : a.appendChild(V),
                (Z = a),
                I(),
                M(!0)
              );
          }
          if (a.contains(V)) return M(!1);
        }
        return !1;
      }
      function O(t, e) {
        G(
          t,
          f,
          N(
            {
              evt: n,
              isOwner: d,
              axis: r ? "vertical" : "horizontal",
              revert: i,
              dragRect: o,
              targetRect: E,
              canSort: h,
              fromSortable: p,
              target: l,
              completed: M,
              onMove: function (t, e) {
                return jt(Q, a, V, o, t, X(t), n, e);
              },
              changed: I,
            },
            e
          )
        );
      }
      function A() {
        O("dragOverAnimationCapture"),
          f.captureAnimationState(),
          f !== p && p.captureAnimationState();
      }
      function M(t) {
        return (
          O("dragOverCompleted", { insertion: t }),
          t &&
            (d ? u._hideClone() : u._showClone(f),
            f !== p &&
              (k(V, (st || u).options.ghostClass, !1), k(V, s.ghostClass, !0)),
            st !== f && f !== Ft.active
              ? (st = f)
              : f === Ft.active && st && (st = null),
            p === f && (f._ignoreWhileAnimating = l),
            f.animateAll(function () {
              O("dragOverAnimationComplete"), (f._ignoreWhileAnimating = null);
            }),
            f !== p && (p.animateAll(), (p._ignoreWhileAnimating = null))),
          ((l === V && !V.animated) || (l === a && !l.animated)) && (mt = null),
          s.dragoverBubble ||
            n.rootEl ||
            l === document ||
            (V.parentNode[W]._isOutsideThisEl(n.target), t || Yt(n)),
          !s.dragoverBubble && n.stopPropagation && n.stopPropagation(),
          (g = !0)
        );
      }
      function I() {
        (it = H(V)),
          (at = H(V, s.draggable)),
          q({
            sortable: f,
            name: "change",
            toEl: a,
            newIndex: it,
            newDraggableIndex: at,
            originalEvent: n,
          });
      }
    },
    _ignoreWhileAnimating: null,
    _offMoveEvents: function () {
      p(document, "mousemove", this._onTouchMove),
        p(document, "touchmove", this._onTouchMove),
        p(document, "pointermove", this._onTouchMove),
        p(document, "dragover", Yt),
        p(document, "mousemove", Yt),
        p(document, "touchmove", Yt);
    },
    _offUpEvents: function () {
      var t = this.el.ownerDocument;
      p(t, "mouseup", this._onDrop),
        p(t, "touchend", this._onDrop),
        p(t, "pointerup", this._onDrop),
        p(t, "touchcancel", this._onDrop),
        p(document, "selectstart", this);
    },
    _onDrop: function (t) {
      var e = this.el,
        n = this.options;
      (it = H(V)),
        (at = H(V, n.draggable)),
        G("drop", this, { evt: t }),
        (Z = V && V.parentNode),
        (it = H(V)),
        (at = H(V, n.draggable)),
        Ft.eventCanceled ||
          ((St = _t = wt = !1),
          clearInterval(this._loopId),
          clearTimeout(this._dragStartTimer),
          Kt(this.cloneId),
          Kt(this._dragStartId),
          this.nativeDraggable &&
            (p(document, "drop", this), p(e, "dragstart", this._onDragStart)),
          this._offMoveEvents(),
          this._offUpEvents(),
          u && R(document.body, "user-select", ""),
          R(V, "transform", ""),
          t &&
            (gt &&
              (t.cancelable && t.preventDefault(),
              n.dropBubble || t.stopPropagation()),
            $ && $.parentNode && $.parentNode.removeChild($),
            (Q === Z || (st && "clone" !== st.lastPutMode)) &&
              et &&
              et.parentNode &&
              et.parentNode.removeChild(et),
            V &&
              (this.nativeDraggable && p(V, "dragend", this),
              Ht(V),
              (V.style["will-change"] = ""),
              gt && !wt && k(V, (st || this).options.ghostClass, !1),
              k(V, this.options.chosenClass, !1),
              q({
                sortable: this,
                name: "unchoose",
                toEl: Z,
                newIndex: null,
                newDraggableIndex: null,
                originalEvent: t,
              }),
              Q !== Z
                ? (0 <= it &&
                    (q({
                      rootEl: Z,
                      name: "add",
                      toEl: Z,
                      fromEl: Q,
                      originalEvent: t,
                    }),
                    q({
                      sortable: this,
                      name: "remove",
                      toEl: Z,
                      originalEvent: t,
                    }),
                    q({
                      rootEl: Z,
                      name: "sort",
                      toEl: Z,
                      fromEl: Q,
                      originalEvent: t,
                    }),
                    q({
                      sortable: this,
                      name: "sort",
                      toEl: Z,
                      originalEvent: t,
                    })),
                  st && st.save())
                : it !== ot &&
                  0 <= it &&
                  (q({
                    sortable: this,
                    name: "update",
                    toEl: Z,
                    originalEvent: t,
                  }),
                  q({
                    sortable: this,
                    name: "sort",
                    toEl: Z,
                    originalEvent: t,
                  })),
              Ft.active &&
                ((null != it && -1 !== it) || ((it = ot), (at = rt)),
                q({ sortable: this, name: "end", toEl: Z, originalEvent: t }),
                this.save())))),
        this._nulling();
    },
    _nulling: function () {
      G("nulling", this),
        (Q =
          V =
          Z =
          $ =
          J =
          et =
          tt =
          nt =
          ct =
          ut =
          gt =
          it =
          at =
          ot =
          rt =
          mt =
          vt =
          st =
          lt =
          Ft.dragged =
          Ft.ghost =
          Ft.clone =
          Ft.active =
            null),
        xt.forEach(function (t) {
          t.checked = !0;
        }),
        (xt.length = dt = ht = 0);
    },
    handleEvent: function (t) {
      switch (t.type) {
        case "drop":
        case "dragend":
          this._onDrop(t);
          break;
        case "dragenter":
        case "dragover":
          V &&
            (this._onDragOver(t),
            (function (t) {
              t.dataTransfer && (t.dataTransfer.dropEffect = "move");
              t.cancelable && t.preventDefault();
            })(t));
          break;
        case "selectstart":
          t.preventDefault();
      }
    },
    toArray: function () {
      for (
        var t,
          e = [],
          n = this.el.children,
          o = 0,
          i = n.length,
          r = this.options;
        o < i;
        o++
      )
        P((t = n[o]), r.draggable, this.el, !1) &&
          e.push(
            t.getAttribute(r.dataIdAttr) ||
              (function (t) {
                var e =
                    t.tagName + t.className + t.src + t.href + t.textContent,
                  n = e.length,
                  o = 0;
                for (; n--; ) o += e.charCodeAt(n);
                return o.toString(36);
              })(t)
          );
      return e;
    },
    sort: function (t, e) {
      var n = {},
        o = this.el;
      this.toArray().forEach(function (t, e) {
        e = o.children[e];
        P(e, this.options.draggable, o, !1) && (n[t] = e);
      }, this),
        e && this.captureAnimationState(),
        t.forEach(function (t) {
          n[t] && (o.removeChild(n[t]), o.appendChild(n[t]));
        }),
        e && this.animateAll();
    },
    save: function () {
      var t = this.options.store;
      t && t.set && t.set(this);
    },
    closest: function (t, e) {
      return P(t, e || this.options.draggable, this.el, !1);
    },
    option: function (t, e) {
      var n = this.options;
      if (void 0 === e) return n[t];
      var o = K.modifyOption(this, t, e);
      (n[t] = void 0 !== o ? o : e), "group" === t && kt(n);
    },
    destroy: function () {
      G("destroy", this);
      var t = this.el;
      (t[W] = null),
        p(t, "mousedown", this._onTapStart),
        p(t, "touchstart", this._onTapStart),
        p(t, "pointerdown", this._onTapStart),
        this.nativeDraggable &&
          (p(t, "dragover", this), p(t, "dragenter", this)),
        Array.prototype.forEach.call(
          t.querySelectorAll("[draggable]"),
          function (t) {
            t.removeAttribute("draggable");
          }
        ),
        this._onDrop(),
        this._disableDelayedDragEvents(),
        Dt.splice(Dt.indexOf(this.el), 1),
        (this.el = t = null);
    },
    _hideClone: function () {
      nt ||
        (G("hideClone", this),
        Ft.eventCanceled ||
          (R(et, "display", "none"),
          this.options.removeCloneOnHide &&
            et.parentNode &&
            et.parentNode.removeChild(et),
          (nt = !0)));
    },
    _showClone: function (t) {
      "clone" === t.lastPutMode
        ? nt &&
          (G("showClone", this),
          Ft.eventCanceled ||
            (V.parentNode != Q || this.options.group.revertClone
              ? J
                ? Q.insertBefore(et, J)
                : Q.appendChild(et)
              : Q.insertBefore(et, V),
            this.options.group.revertClone && this.animate(V, et),
            R(et, "display", ""),
            (nt = !1)))
        : this._hideClone();
    },
  }),
    Ot &&
      h(document, "touchmove", function (t) {
        (Ft.active || wt) && t.cancelable && t.preventDefault();
      }),
    (Ft.utils = {
      on: h,
      off: p,
      css: R,
      find: b,
      is: function (t, e) {
        return !!P(t, e, t, !1);
      },
      extend: function (t, e) {
        if (t && e) for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
        return t;
      },
      throttle: S,
      closest: P,
      toggleClass: k,
      clone: _,
      index: H,
      nextTick: Wt,
      cancelNextTick: Kt,
      detectDirection: Pt,
      getChild: F,
    }),
    (Ft.get = function (t) {
      return t[W];
    }),
    (Ft.mount = function () {
      for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
        e[n] = arguments[n];
      (e = e[0].constructor === Array ? e[0] : e).forEach(function (t) {
        if (!t.prototype || !t.prototype.constructor)
          throw "Sortable: Mounted plugin must be a constructor function, not ".concat(
            {}.toString.call(t)
          );
        t.utils && (Ft.utils = N(N({}, Ft.utils), t.utils)), K.mount(t);
      });
    }),
    (Ft.create = function (t, e) {
      return new Ft(t, e);
    });
  var zt,
    Gt,
    Ut,
    qt,
    Vt,
    Zt,
    $t = [],
    Qt = !(Ft.version = "1.15.1");
  function Jt() {
    $t.forEach(function (t) {
      clearInterval(t.pid);
    }),
      ($t = []);
  }
  function te() {
    clearInterval(Zt);
  }
  var ee,
    ne = S(function (n, t, e, o) {
      if (t.scroll) {
        var i,
          r = (n.touches ? n.touches[0] : n).clientX,
          a = (n.touches ? n.touches[0] : n).clientY,
          l = t.scrollSensitivity,
          s = t.scrollSpeed,
          c = O(),
          u = !1;
        Gt !== e &&
          ((Gt = e),
          Jt(),
          (zt = t.scroll),
          (i = t.scrollFn),
          !0 === zt && (zt = A(e, !0)));
        var d = 0,
          h = zt;
        do {
          var p = h,
            f = X(p),
            g = f.top,
            m = f.bottom,
            v = f.left,
            b = f.right,
            y = f.width,
            w = f.height,
            E = void 0,
            D = void 0,
            S = p.scrollWidth,
            _ = p.scrollHeight,
            C = R(p),
            T = p.scrollLeft,
            f = p.scrollTop,
            D =
              p === c
                ? ((E =
                    y < S &&
                    ("auto" === C.overflowX ||
                      "scroll" === C.overflowX ||
                      "visible" === C.overflowX)),
                  w < _ &&
                    ("auto" === C.overflowY ||
                      "scroll" === C.overflowY ||
                      "visible" === C.overflowY))
                : ((E =
                    y < S &&
                    ("auto" === C.overflowX || "scroll" === C.overflowX)),
                  w < _ &&
                    ("auto" === C.overflowY || "scroll" === C.overflowY)),
            T =
              E &&
              (Math.abs(b - r) <= l && T + y < S) -
                (Math.abs(v - r) <= l && !!T),
            f =
              D &&
              (Math.abs(m - a) <= l && f + w < _) -
                (Math.abs(g - a) <= l && !!f);
          if (!$t[d]) for (var x = 0; x <= d; x++) $t[x] || ($t[x] = {});
          ($t[d].vx == T && $t[d].vy == f && $t[d].el === p) ||
            (($t[d].el = p),
            ($t[d].vx = T),
            ($t[d].vy = f),
            clearInterval($t[d].pid),
            (0 == T && 0 == f) ||
              ((u = !0),
              ($t[d].pid = setInterval(
                function () {
                  o && 0 === this.layer && Ft.active._onTouchMove(Vt);
                  var t = $t[this.layer].vy ? $t[this.layer].vy * s : 0,
                    e = $t[this.layer].vx ? $t[this.layer].vx * s : 0;
                  ("function" == typeof i &&
                    "continue" !==
                      i.call(
                        Ft.dragged.parentNode[W],
                        e,
                        t,
                        n,
                        Vt,
                        $t[this.layer].el
                      )) ||
                    L($t[this.layer].el, e, t);
                }.bind({ layer: d }),
                24
              )))),
            d++;
        } while (t.bubbleScroll && h !== c && (h = A(h, !1)));
        Qt = u;
      }
    }, 30),
    c = function (t) {
      var e = t.originalEvent,
        n = t.putSortable,
        o = t.dragEl,
        i = t.activeSortable,
        r = t.dispatchSortableEvent,
        a = t.hideGhostForTarget,
        t = t.unhideGhostForTarget;
      e &&
        ((i = n || i),
        a(),
        (e =
          e.changedTouches && e.changedTouches.length
            ? e.changedTouches[0]
            : e),
        (e = document.elementFromPoint(e.clientX, e.clientY)),
        t(),
        i &&
          !i.el.contains(e) &&
          (r("spill"), this.onSpill({ dragEl: o, putSortable: n })));
    };
  function oe() {}
  function ie() {}
  (oe.prototype = {
    startIndex: null,
    dragStart: function (t) {
      t = t.oldDraggableIndex;
      this.startIndex = t;
    },
    onSpill: function (t) {
      var e = t.dragEl,
        n = t.putSortable;
      this.sortable.captureAnimationState(), n && n.captureAnimationState();
      t = F(this.sortable.el, this.startIndex, this.options);
      t ? this.sortable.el.insertBefore(e, t) : this.sortable.el.appendChild(e),
        this.sortable.animateAll(),
        n && n.animateAll();
    },
    drop: c,
  }),
    a(oe, { pluginName: "revertOnSpill" }),
    (ie.prototype = {
      onSpill: function (t) {
        var e = t.dragEl,
          t = t.putSortable || this.sortable;
        t.captureAnimationState(),
          e.parentNode && e.parentNode.removeChild(e),
          t.animateAll();
      },
      drop: c,
    }),
    a(ie, { pluginName: "removeOnSpill" });
  var re,
    ae,
    le,
    se,
    ce,
    ue = [],
    de = [],
    he = !1,
    pe = !1,
    fe = !1;
  function ge(n, o) {
    de.forEach(function (t, e) {
      e = o.children[t.sortableIndex + (n ? Number(e) : 0)];
      e ? o.insertBefore(t, e) : o.appendChild(t);
    });
  }
  function me() {
    ue.forEach(function (t) {
      t !== le && t.parentNode && t.parentNode.removeChild(t);
    });
  }
  return (
    Ft.mount(
      new (function () {
        function t() {
          for (var t in ((this.defaults = {
            scroll: !0,
            forceAutoScrollFallback: !1,
            scrollSensitivity: 30,
            scrollSpeed: 10,
            bubbleScroll: !0,
          }),
          this))
            "_" === t.charAt(0) &&
              "function" == typeof this[t] &&
              (this[t] = this[t].bind(this));
        }
        return (
          (t.prototype = {
            dragStarted: function (t) {
              t = t.originalEvent;
              this.sortable.nativeDraggable
                ? h(document, "dragover", this._handleAutoScroll)
                : this.options.supportPointer
                ? h(document, "pointermove", this._handleFallbackAutoScroll)
                : t.touches
                ? h(document, "touchmove", this._handleFallbackAutoScroll)
                : h(document, "mousemove", this._handleFallbackAutoScroll);
            },
            dragOverCompleted: function (t) {
              t = t.originalEvent;
              this.options.dragOverBubble ||
                t.rootEl ||
                this._handleAutoScroll(t);
            },
            drop: function () {
              this.sortable.nativeDraggable
                ? p(document, "dragover", this._handleAutoScroll)
                : (p(document, "pointermove", this._handleFallbackAutoScroll),
                  p(document, "touchmove", this._handleFallbackAutoScroll),
                  p(document, "mousemove", this._handleFallbackAutoScroll)),
                te(),
                Jt(),
                clearTimeout(g),
                (g = void 0);
            },
            nulling: function () {
              (Vt = Gt = zt = Qt = Zt = Ut = qt = null), ($t.length = 0);
            },
            _handleFallbackAutoScroll: function (t) {
              this._handleAutoScroll(t, !0);
            },
            _handleAutoScroll: function (e, n) {
              var o,
                i = this,
                r = (e.touches ? e.touches[0] : e).clientX,
                a = (e.touches ? e.touches[0] : e).clientY,
                t = document.elementFromPoint(r, a);
              (Vt = e),
                n || this.options.forceAutoScrollFallback || w || y || u
                  ? (ne(e, this.options, t, n),
                    (o = A(t, !0)),
                    !Qt ||
                      (Zt && r === Ut && a === qt) ||
                      (Zt && te(),
                      (Zt = setInterval(function () {
                        var t = A(document.elementFromPoint(r, a), !0);
                        t !== o && ((o = t), Jt()), ne(e, i.options, t, n);
                      }, 10)),
                      (Ut = r),
                      (qt = a)))
                  : this.options.bubbleScroll && A(t, !0) !== O()
                  ? ne(e, this.options, A(t, !1), !1)
                  : Jt();
            },
          }),
          a(t, { pluginName: "scroll", initializeByDefault: !0 })
        );
      })()
    ),
    Ft.mount(ie, oe),
    Ft.mount(
      new (function () {
        function t() {
          this.defaults = { swapClass: "sortable-swap-highlight" };
        }
        return (
          (t.prototype = {
            dragStart: function (t) {
              t = t.dragEl;
              ee = t;
            },
            dragOverValid: function (t) {
              var e = t.completed,
                n = t.target,
                o = t.onMove,
                i = t.activeSortable,
                r = t.changed,
                a = t.cancel;
              i.options.swap &&
                ((t = this.sortable.el),
                (i = this.options),
                n &&
                  n !== t &&
                  ((t = ee),
                  (ee = !1 !== o(n) ? (k(n, i.swapClass, !0), n) : null),
                  t && t !== ee && k(t, i.swapClass, !1)),
                r(),
                e(!0),
                a());
            },
            drop: function (t) {
              var e,
                n,
                o = t.activeSortable,
                i = t.putSortable,
                r = t.dragEl,
                a = i || this.sortable,
                l = this.options;
              ee && k(ee, l.swapClass, !1),
                ee &&
                  (l.swap || (i && i.options.swap)) &&
                  r !== ee &&
                  (a.captureAnimationState(),
                  a !== o && o.captureAnimationState(),
                  (n = ee),
                  (t = (e = r).parentNode),
                  (l = n.parentNode),
                  t &&
                    l &&
                    !t.isEqualNode(n) &&
                    !l.isEqualNode(e) &&
                    ((i = H(e)),
                    (r = H(n)),
                    t.isEqualNode(l) && i < r && r++,
                    t.insertBefore(n, t.children[i]),
                    l.insertBefore(e, l.children[r])),
                  a.animateAll(),
                  a !== o && o.animateAll());
            },
            nulling: function () {
              ee = null;
            },
          }),
          a(t, {
            pluginName: "swap",
            eventProperties: function () {
              return { swapItem: ee };
            },
          })
        );
      })()
    ),
    Ft.mount(
      new (function () {
        function t(o) {
          for (var t in this)
            "_" === t.charAt(0) &&
              "function" == typeof this[t] &&
              (this[t] = this[t].bind(this));
          o.options.avoidImplicitDeselect ||
            (o.options.supportPointer
              ? h(document, "pointerup", this._deselectMultiDrag)
              : (h(document, "mouseup", this._deselectMultiDrag),
                h(document, "touchend", this._deselectMultiDrag))),
            h(document, "keydown", this._checkKeyDown),
            h(document, "keyup", this._checkKeyUp),
            (this.defaults = {
              selectedClass: "sortable-selected",
              multiDragKey: null,
              avoidImplicitDeselect: !1,
              setData: function (t, e) {
                var n = "";
                ue.length && ae === o
                  ? ue.forEach(function (t, e) {
                      n += (e ? ", " : "") + t.textContent;
                    })
                  : (n = e.textContent),
                  t.setData("Text", n);
              },
            });
        }
        return (
          (t.prototype = {
            multiDragKeyDown: !1,
            isMultiDrag: !1,
            delayStartGlobal: function (t) {
              t = t.dragEl;
              le = t;
            },
            delayEnded: function () {
              this.isMultiDrag = ~ue.indexOf(le);
            },
            setupClone: function (t) {
              var e = t.sortable,
                t = t.cancel;
              if (this.isMultiDrag) {
                for (var n = 0; n < ue.length; n++)
                  de.push(_(ue[n])),
                    (de[n].sortableIndex = ue[n].sortableIndex),
                    (de[n].draggable = !1),
                    (de[n].style["will-change"] = ""),
                    k(de[n], this.options.selectedClass, !1),
                    ue[n] === le && k(de[n], this.options.chosenClass, !1);
                e._hideClone(), t();
              }
            },
            clone: function (t) {
              var e = t.sortable,
                n = t.rootEl,
                o = t.dispatchSortableEvent,
                t = t.cancel;
              this.isMultiDrag &&
                (this.options.removeCloneOnHide ||
                  (ue.length && ae === e && (ge(!0, n), o("clone"), t())));
            },
            showClone: function (t) {
              var e = t.cloneNowShown,
                n = t.rootEl,
                t = t.cancel;
              this.isMultiDrag &&
                (ge(!1, n),
                de.forEach(function (t) {
                  R(t, "display", "");
                }),
                e(),
                (ce = !1),
                t());
            },
            hideClone: function (t) {
              var e = this,
                n = (t.sortable, t.cloneNowHidden),
                t = t.cancel;
              this.isMultiDrag &&
                (de.forEach(function (t) {
                  R(t, "display", "none"),
                    e.options.removeCloneOnHide &&
                      t.parentNode &&
                      t.parentNode.removeChild(t);
                }),
                n(),
                (ce = !0),
                t());
            },
            dragStartGlobal: function (t) {
              t.sortable;
              !this.isMultiDrag && ae && ae.multiDrag._deselectMultiDrag(),
                ue.forEach(function (t) {
                  t.sortableIndex = H(t);
                }),
                (ue = ue.sort(function (t, e) {
                  return t.sortableIndex - e.sortableIndex;
                })),
                (fe = !0);
            },
            dragStarted: function (t) {
              var e,
                n = this,
                t = t.sortable;
              this.isMultiDrag &&
                (this.options.sort &&
                  (t.captureAnimationState(),
                  this.options.animation &&
                    (ue.forEach(function (t) {
                      t !== le && R(t, "position", "absolute");
                    }),
                    (e = X(le, !1, !0, !0)),
                    ue.forEach(function (t) {
                      t !== le && C(t, e);
                    }),
                    (he = pe = !0))),
                t.animateAll(function () {
                  (he = pe = !1),
                    n.options.animation &&
                      ue.forEach(function (t) {
                        T(t);
                      }),
                    n.options.sort && me();
                }));
            },
            dragOver: function (t) {
              var e = t.target,
                n = t.completed,
                t = t.cancel;
              pe && ~ue.indexOf(e) && (n(!1), t());
            },
            revert: function (t) {
              var n,
                o,
                e = t.fromSortable,
                i = t.rootEl,
                r = t.sortable,
                a = t.dragRect;
              1 < ue.length &&
                (ue.forEach(function (t) {
                  r.addAnimationState({ target: t, rect: pe ? X(t) : a }),
                    T(t),
                    (t.fromRect = a),
                    e.removeAnimationState(t);
                }),
                (pe = !1),
                (n = !this.options.removeCloneOnHide),
                (o = i),
                ue.forEach(function (t, e) {
                  e = o.children[t.sortableIndex + (n ? Number(e) : 0)];
                  e ? o.insertBefore(t, e) : o.appendChild(t);
                }));
            },
            dragOverCompleted: function (t) {
              var e,
                n = t.sortable,
                o = t.isOwner,
                i = t.insertion,
                r = t.activeSortable,
                a = t.parentEl,
                l = t.putSortable,
                t = this.options;
              i &&
                (o && r._hideClone(),
                (he = !1),
                t.animation &&
                  1 < ue.length &&
                  (pe || (!o && !r.options.sort && !l)) &&
                  ((e = X(le, !1, !0, !0)),
                  ue.forEach(function (t) {
                    t !== le && (C(t, e), a.appendChild(t));
                  }),
                  (pe = !0)),
                o ||
                  (pe || me(),
                  1 < ue.length
                    ? ((o = ce),
                      r._showClone(n),
                      r.options.animation &&
                        !ce &&
                        o &&
                        de.forEach(function (t) {
                          r.addAnimationState({ target: t, rect: se }),
                            (t.fromRect = se),
                            (t.thisAnimationDuration = null);
                        }))
                    : r._showClone(n)));
            },
            dragOverAnimationCapture: function (t) {
              var e = t.dragRect,
                n = t.isOwner,
                t = t.activeSortable;
              ue.forEach(function (t) {
                t.thisAnimationDuration = null;
              }),
                t.options.animation &&
                  !n &&
                  t.multiDrag.isMultiDrag &&
                  ((se = a({}, e)),
                  (e = v(le, !0)),
                  (se.top -= e.f),
                  (se.left -= e.e));
            },
            dragOverAnimationComplete: function () {
              pe && ((pe = !1), me());
            },
            drop: function (t) {
              var e = t.originalEvent,
                n = t.rootEl,
                o = t.parentEl,
                i = t.sortable,
                r = t.dispatchSortableEvent,
                a = t.oldIndex,
                l = t.putSortable,
                s = l || this.sortable;
              if (e) {
                var c,
                  u,
                  d,
                  h = this.options,
                  p = o.children;
                if (!fe)
                  if (
                    (h.multiDragKey &&
                      !this.multiDragKeyDown &&
                      this._deselectMultiDrag(),
                    k(le, h.selectedClass, !~ue.indexOf(le)),
                    ~ue.indexOf(le))
                  )
                    ue.splice(ue.indexOf(le), 1),
                      (re = null),
                      z({
                        sortable: i,
                        rootEl: n,
                        name: "deselect",
                        targetEl: le,
                        originalEvent: e,
                      });
                  else {
                    if (
                      (ue.push(le),
                      z({
                        sortable: i,
                        rootEl: n,
                        name: "select",
                        targetEl: le,
                        originalEvent: e,
                      }),
                      e.shiftKey && re && i.el.contains(re))
                    ) {
                      var f = H(re),
                        t = H(le);
                      if (~f && ~t && f !== t)
                        for (
                          var g, m = f < t ? ((g = f), t) : ((g = t), f + 1);
                          g < m;
                          g++
                        )
                          ~ue.indexOf(p[g]) ||
                            (k(p[g], h.selectedClass, !0),
                            ue.push(p[g]),
                            z({
                              sortable: i,
                              rootEl: n,
                              name: "select",
                              targetEl: p[g],
                              originalEvent: e,
                            }));
                    } else re = le;
                    ae = s;
                  }
                fe &&
                  this.isMultiDrag &&
                  ((pe = !1),
                  (o[W].options.sort || o !== n) &&
                    1 < ue.length &&
                    ((c = X(le)),
                    (u = H(le, ":not(." + this.options.selectedClass + ")")),
                    !he && h.animation && (le.thisAnimationDuration = null),
                    s.captureAnimationState(),
                    he ||
                      (h.animation &&
                        ((le.fromRect = c),
                        ue.forEach(function (t) {
                          var e;
                          (t.thisAnimationDuration = null),
                            t !== le &&
                              ((e = pe ? X(t) : c),
                              (t.fromRect = e),
                              s.addAnimationState({ target: t, rect: e }));
                        })),
                      me(),
                      ue.forEach(function (t) {
                        p[u] ? o.insertBefore(t, p[u]) : o.appendChild(t), u++;
                      }),
                      a === H(le) &&
                        ((d = !1),
                        ue.forEach(function (t) {
                          t.sortableIndex !== H(t) && (d = !0);
                        }),
                        d && (r("update"), r("sort")))),
                    ue.forEach(function (t) {
                      T(t);
                    }),
                    s.animateAll()),
                  (ae = s)),
                  (n === o || (l && "clone" !== l.lastPutMode)) &&
                    de.forEach(function (t) {
                      t.parentNode && t.parentNode.removeChild(t);
                    });
              }
            },
            nullingGlobal: function () {
              (this.isMultiDrag = fe = !1), (de.length = 0);
            },
            destroyGlobal: function () {
              this._deselectMultiDrag(),
                p(document, "pointerup", this._deselectMultiDrag),
                p(document, "mouseup", this._deselectMultiDrag),
                p(document, "touchend", this._deselectMultiDrag),
                p(document, "keydown", this._checkKeyDown),
                p(document, "keyup", this._checkKeyUp);
            },
            _deselectMultiDrag: function (t) {
              if (
                !(
                  (void 0 !== fe && fe) ||
                  ae !== this.sortable ||
                  (t &&
                    P(
                      t.target,
                      this.options.draggable,
                      this.sortable.el,
                      !1
                    )) ||
                  (t && 0 !== t.button)
                )
              )
                for (; ue.length; ) {
                  var e = ue[0];
                  k(e, this.options.selectedClass, !1),
                    ue.shift(),
                    z({
                      sortable: this.sortable,
                      rootEl: this.sortable.el,
                      name: "deselect",
                      targetEl: e,
                      originalEvent: t,
                    });
                }
            },
            _checkKeyDown: function (t) {
              t.key === this.options.multiDragKey &&
                (this.multiDragKeyDown = !0);
            },
            _checkKeyUp: function (t) {
              t.key === this.options.multiDragKey &&
                (this.multiDragKeyDown = !1);
            },
          }),
          a(t, {
            pluginName: "multiDrag",
            utils: {
              select: function (t) {
                var e = t.parentNode[W];
                e &&
                  e.options.multiDrag &&
                  !~ue.indexOf(t) &&
                  (ae &&
                    ae !== e &&
                    (ae.multiDrag._deselectMultiDrag(), (ae = e)),
                  k(t, e.options.selectedClass, !0),
                  ue.push(t));
              },
              deselect: function (t) {
                var e = t.parentNode[W],
                  n = ue.indexOf(t);
                e &&
                  e.options.multiDrag &&
                  ~n &&
                  (k(t, e.options.selectedClass, !1), ue.splice(n, 1));
              },
            },
            eventProperties: function () {
              var n = this,
                o = [],
                i = [];
              return (
                ue.forEach(function (t) {
                  var e;
                  o.push({ multiDragElement: t, index: t.sortableIndex }),
                    (e =
                      pe && t !== le
                        ? -1
                        : pe
                        ? H(t, ":not(." + n.options.selectedClass + ")")
                        : H(t)),
                    i.push({ multiDragElement: t, index: e });
                }),
                {
                  items: r(ue),
                  clones: [].concat(de),
                  oldIndicies: o,
                  newIndicies: i,
                }
              );
            },
            optionListeners: {
              multiDragKey: function (t) {
                return (
                  "ctrl" === (t = t.toLowerCase())
                    ? (t = "Control")
                    : 1 < t.length &&
                      (t = t.charAt(0).toUpperCase() + t.substr(1)),
                  t
                );
              },
            },
          })
        );
      })()
    ),
    Ft
  );
});
/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function ($, drupalSettings, Sortable, once) {
  "use strict";
  Drupal.behaviors.select2 = {
    attach: function (context) {
      $(once("select2-init", ".select2-widget", context)).each(function () {
        var config = $(this).data("select2-config");
        config.createTag = function (params) {
          var term = $.trim(params.term);
          if (term === "") return null;
          return { id: "$ID:" + term, text: term };
        };
        config.templateSelection = function (option, container) {
          if ("element" in option && "value" in option.element)
            $(container).data("optionValue", option.element.value);
          return option.text;
        };
        if (Object.prototype.hasOwnProperty.call(config, "ajax"))
          config.ajax.data = function (params) {
            var selected = [];
            if (Array.isArray($(this).val())) selected = $(this).val();
            else {
              if ($(this).val() !== "") selected = [$(this).val()];
            }
            return $.extend({}, params, {
              q: params.term,
              selected: selected.filter(function (selected) {
                return !selected.startsWith("$ID:");
              }),
            });
          };
        $(this).data("select2-config", config);
        $(this).trigger("select2-init");
        config = $(this).data("select2-config");
        if (Object.prototype.hasOwnProperty.call(config, "dropdownParent"))
          config.dropdownParent = $(config.dropdownParent);
        $(this).select2(config);
        if (config.multiple) {
          var $select = $(this);
          var $list = $select
            .next(".select2-container")
            .find("ul.select2-selection__rendered");
          Sortable.create($list[0], {
            draggable: "li:not(.select2-search)",
            forceFallback: true,
            onEnd: function () {
              $($list.find(".select2-selection__choice").get().reverse()).each(
                function () {
                  $select.prepend(
                    $select
                      .find(
                        'option[value="' + $(this).data("optionValue") + '"]'
                      )
                      .first()
                  );
                }
              );
            },
          });
        }
      });
    },
  };
})(jQuery, drupalSettings, Sortable, once);
/*! Select2 4.0.13 | https://github.com/select2/select2/blob/master/LICENSE.md */

!(function () {
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd)
    var e = jQuery.fn.select2.amd;
  e.define("select2/i18n/en", [], function () {
    return {
      errorLoading: function () {
        return "The results could not be loaded.";
      },
      inputTooLong: function (e) {
        var n = e.input.length - e.maximum,
          r = "Please delete " + n + " character";
        return 1 != n && (r += "s"), r;
      },
      inputTooShort: function (e) {
        return (
          "Please enter " + (e.minimum - e.input.length) + " or more characters"
        );
      },
      loadingMore: function () {
        return "Loading more resultsÃ¢â‚¬Â¦";
      },
      maximumSelected: function (e) {
        var n = "You can only select " + e.maximum + " item";
        return 1 != e.maximum && (n += "s"), n;
      },
      noResults: function () {
        return "No results found";
      },
      searching: function () {
        return "SearchingÃ¢â‚¬Â¦";
      },
      removeAllItems: function () {
        return "Remove all items";
      },
    };
  }),
    e.define,
    e.require;
})();
(() => {
  const e = document.getElementById("main-header");
  const mini_nav_toggler = e.querySelector(".mini-toolbar button.nav-toggler");
  if (mini_nav_toggler) {
    mini_nav_toggler.addEventListener("click", () => {
      document.body.classList.toggle("main-menu-open");
      // document.body.classList.toggle("main-menu-open"),
      //   document.getElementById("search-bar").classList.toggle("active");
    });
  }
  const search_toggler = e.querySelector("#search-btn-toggler");
  if (search_toggler) {
    e.addEventListener("click", () => {
      document.body.classList.toggle("main-searchbar-open");
    });
  }
})();
