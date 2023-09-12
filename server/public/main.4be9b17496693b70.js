"use strict";
(self.webpackChunkclient = self.webpackChunkclient || []).push([
  [179],
  {
    146: () => {
      function _e(e) {
        return "function" == typeof e;
      }
      function Xr(e) {
        const t = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (t.prototype = Object.create(Error.prototype)),
          (t.prototype.constructor = t),
          t
        );
      }
      const Ti = Xr(
        (e) =>
          function (t) {
            e(this),
              (this.message = t
                ? `${t.length} errors occurred during unsubscription:\n${t
                    .map((r, i) => `${i + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = t);
          }
      );
      function ei(e, n) {
        if (e) {
          const t = e.indexOf(n);
          0 <= t && e.splice(t, 1);
        }
      }
      class gt {
        constructor(n) {
          (this.initialTeardown = n),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let n;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: t } = this;
            if (t)
              if (((this._parentage = null), Array.isArray(t)))
                for (const o of t) o.remove(this);
              else t.remove(this);
            const { initialTeardown: r } = this;
            if (_e(r))
              try {
                r();
              } catch (o) {
                n = o instanceof Ti ? o.errors : [o];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const o of i)
                try {
                  Ir(o);
                } catch (s) {
                  (n = n ?? []),
                    s instanceof Ti ? (n = [...n, ...s.errors]) : n.push(s);
                }
            }
            if (n) throw new Ti(n);
          }
        }
        add(n) {
          var t;
          if (n && n !== this)
            if (this.closed) Ir(n);
            else {
              if (n instanceof gt) {
                if (n.closed || n._hasParent(this)) return;
                n._addParent(this);
              }
              (this._finalizers =
                null !== (t = this._finalizers) && void 0 !== t ? t : []).push(
                n
              );
            }
        }
        _hasParent(n) {
          const { _parentage: t } = this;
          return t === n || (Array.isArray(t) && t.includes(n));
        }
        _addParent(n) {
          const { _parentage: t } = this;
          this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
        }
        _removeParent(n) {
          const { _parentage: t } = this;
          t === n ? (this._parentage = null) : Array.isArray(t) && ei(t, n);
        }
        remove(n) {
          const { _finalizers: t } = this;
          t && ei(t, n), n instanceof gt && n._removeParent(this);
        }
      }
      gt.EMPTY = (() => {
        const e = new gt();
        return (e.closed = !0), e;
      })();
      const ks = gt.EMPTY;
      function Al(e) {
        return (
          e instanceof gt ||
          (e && "closed" in e && _e(e.remove) && _e(e.add) && _e(e.unsubscribe))
        );
      }
      function Ir(e) {
        _e(e) ? e() : e.unsubscribe();
      }
      const ti = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        uo = {
          setTimeout(e, n, ...t) {
            const { delegate: r } = uo;
            return r?.setTimeout
              ? r.setTimeout(e, n, ...t)
              : setTimeout(e, n, ...t);
          },
          clearTimeout(e) {
            const { delegate: n } = uo;
            return (n?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Sd(e) {
        uo.setTimeout(() => {
          const { onUnhandledError: n } = ti;
          if (!n) throw e;
          n(e);
        });
      }
      function ni() {}
      const Md = Fs("C", void 0, void 0);
      function Fs(e, n, t) {
        return { kind: e, value: n, error: t };
      }
      let Or = null;
      function dr(e) {
        if (ti.useDeprecatedSynchronousErrorHandling) {
          const n = !Or;
          if ((n && (Or = { errorThrown: !1, error: null }), e(), n)) {
            const { errorThrown: t, error: r } = Or;
            if (((Or = null), t)) throw r;
          }
        } else e();
      }
      class fo extends gt {
        constructor(n) {
          super(),
            (this.isStopped = !1),
            n
              ? ((this.destination = n), Al(n) && n.add(this))
              : (this.destination = Bs);
        }
        static create(n, t, r) {
          return new ri(n, t, r);
        }
        next(n) {
          this.isStopped
            ? Ls(
                (function Nd(e) {
                  return Fs("N", e, void 0);
                })(n),
                this
              )
            : this._next(n);
        }
        error(n) {
          this.isStopped
            ? Ls(
                (function Td(e) {
                  return Fs("E", void 0, e);
                })(n),
                this
              )
            : ((this.isStopped = !0), this._error(n));
        }
        complete() {
          this.isStopped
            ? Ls(Md, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(n) {
          this.destination.next(n);
        }
        _error(n) {
          try {
            this.destination.error(n);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const Rl = Function.prototype.bind;
      function ho(e, n) {
        return Rl.call(e, n);
      }
      class xl {
        constructor(n) {
          this.partialObserver = n;
        }
        next(n) {
          const { partialObserver: t } = this;
          if (t.next)
            try {
              t.next(n);
            } catch (r) {
              bn(r);
            }
        }
        error(n) {
          const { partialObserver: t } = this;
          if (t.error)
            try {
              t.error(n);
            } catch (r) {
              bn(r);
            }
          else bn(n);
        }
        complete() {
          const { partialObserver: n } = this;
          if (n.complete)
            try {
              n.complete();
            } catch (t) {
              bn(t);
            }
        }
      }
      class ri extends fo {
        constructor(n, t, r) {
          let i;
          if ((super(), _e(n) || !n))
            i = {
              next: n ?? void 0,
              error: t ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let o;
            this && ti.useDeprecatedNextContext
              ? ((o = Object.create(n)),
                (o.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: n.next && ho(n.next, o),
                  error: n.error && ho(n.error, o),
                  complete: n.complete && ho(n.complete, o),
                }))
              : (i = n);
          }
          this.destination = new xl(i);
        }
      }
      function bn(e) {
        ti.useDeprecatedSynchronousErrorHandling
          ? (function Id(e) {
              ti.useDeprecatedSynchronousErrorHandling &&
                Or &&
                ((Or.errorThrown = !0), (Or.error = e));
            })(e)
          : Sd(e);
      }
      function Ls(e, n) {
        const { onStoppedNotification: t } = ti;
        t && uo.setTimeout(() => t(e, n));
      }
      const Bs = {
          closed: !0,
          next: ni,
          error: function Pl(e) {
            throw e;
          },
          complete: ni,
        },
        Vs =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Kn(e) {
        return e;
      }
      function Fl(e) {
        return 0 === e.length
          ? Kn
          : 1 === e.length
          ? e[0]
          : function (t) {
              return e.reduce((r, i) => i(r), t);
            };
      }
      let Me = (() => {
        class e {
          constructor(t) {
            t && (this._subscribe = t);
          }
          lift(t) {
            const r = new e();
            return (r.source = this), (r.operator = t), r;
          }
          subscribe(t, r, i) {
            const o = (function Ad(e) {
              return (
                (e && e instanceof fo) ||
                ((function Od(e) {
                  return e && _e(e.next) && _e(e.error) && _e(e.complete);
                })(e) &&
                  Al(e))
              );
            })(t)
              ? t
              : new ri(t, r, i);
            return (
              dr(() => {
                const { operator: s, source: a } = this;
                o.add(
                  s
                    ? s.call(o, a)
                    : a
                    ? this._subscribe(o)
                    : this._trySubscribe(o)
                );
              }),
              o
            );
          }
          _trySubscribe(t) {
            try {
              return this._subscribe(t);
            } catch (r) {
              t.error(r);
            }
          }
          forEach(t, r) {
            return new (r = Ll(r))((i, o) => {
              const s = new ri({
                next: (a) => {
                  try {
                    t(a);
                  } catch (l) {
                    o(l), s.unsubscribe();
                  }
                },
                error: o,
                complete: i,
              });
              this.subscribe(s);
            });
          }
          _subscribe(t) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(t);
          }
          [Vs]() {
            return this;
          }
          pipe(...t) {
            return Fl(t)(this);
          }
          toPromise(t) {
            return new (t = Ll(t))((r, i) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => i(s),
                () => r(o)
              );
            });
          }
        }
        return (e.create = (n) => new e(n)), e;
      })();
      function Ll(e) {
        var n;
        return null !== (n = e ?? ti.Promise) && void 0 !== n ? n : Promise;
      }
      const Rd = Xr(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Pe = (() => {
        class e extends Me {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(t) {
            const r = new Bl(this, this);
            return (r.operator = t), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new Rd();
          }
          next(t) {
            dr(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(t);
              }
            });
          }
          error(t) {
            dr(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = t);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(t);
              }
            });
          }
          complete() {
            dr(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: t } = this;
                for (; t.length; ) t.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var t;
            return (
              (null === (t = this.observers) || void 0 === t
                ? void 0
                : t.length) > 0
            );
          }
          _trySubscribe(t) {
            return this._throwIfClosed(), super._trySubscribe(t);
          }
          _subscribe(t) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(t),
              this._innerSubscribe(t)
            );
          }
          _innerSubscribe(t) {
            const { hasError: r, isStopped: i, observers: o } = this;
            return r || i
              ? ks
              : ((this.currentObservers = null),
                o.push(t),
                new gt(() => {
                  (this.currentObservers = null), ei(o, t);
                }));
          }
          _checkFinalizedStatuses(t) {
            const { hasError: r, thrownError: i, isStopped: o } = this;
            r ? t.error(i) : o && t.complete();
          }
          asObservable() {
            const t = new Me();
            return (t.source = this), t;
          }
        }
        return (e.create = (n, t) => new Bl(n, t)), e;
      })();
      class Bl extends Pe {
        constructor(n, t) {
          super(), (this.destination = n), (this.source = t);
        }
        next(n) {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.next) ||
            void 0 === r ||
            r.call(t, n);
        }
        error(n) {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.error) ||
            void 0 === r ||
            r.call(t, n);
        }
        complete() {
          var n, t;
          null ===
            (t =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.complete) ||
            void 0 === t ||
            t.call(n);
        }
        _subscribe(n) {
          var t, r;
          return null !==
            (r =
              null === (t = this.source) || void 0 === t
                ? void 0
                : t.subscribe(n)) && void 0 !== r
            ? r
            : ks;
        }
      }
      function Hs(e) {
        return _e(e?.lift);
      }
      function Qe(e) {
        return (n) => {
          if (Hs(n))
            return n.lift(function (t) {
              try {
                return e(t, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Be(e, n, t, r, i) {
        return new xd(e, n, t, r, i);
      }
      class xd extends fo {
        constructor(n, t, r, i, o, s) {
          super(n),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = t
              ? function (a) {
                  try {
                    t(a);
                  } catch (l) {
                    n.error(l);
                  }
                }
              : super._next),
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (l) {
                    n.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    n.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var n;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: t } = this;
            super.unsubscribe(),
              !t &&
                (null === (n = this.onFinalize) ||
                  void 0 === n ||
                  n.call(this));
          }
        }
      }
      function Z(e, n) {
        return Qe((t, r) => {
          let i = 0;
          t.subscribe(
            Be(r, (o) => {
              r.next(e.call(n, o, i++));
            })
          );
        });
      }
      function ln(e) {
        return this instanceof ln ? ((this.v = e), this) : new ln(e);
      }
      function Gs(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t,
          n = e[Symbol.asyncIterator];
        return n
          ? n.call(e)
          : ((e = (function G(e) {
              var n = "function" == typeof Symbol && Symbol.iterator,
                t = n && e[n],
                r = 0;
              if (t) return t.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                n
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (t = {}),
            r("next"),
            r("throw"),
            r("return"),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function r(o) {
          t[o] =
            e[o] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function i(o, s, a, l) {
                  Promise.resolve(l).then(function (c) {
                    o({ value: c, done: a });
                  }, s);
                })(a, l, (s = e[o](s)).done, s.value);
              });
            };
        }
      }
      const Fd = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Im(e) {
        return _e(e?.then);
      }
      function Om(e) {
        return _e(e[Vs]);
      }
      function Am(e) {
        return Symbol.asyncIterator && _e(e?.[Symbol.asyncIterator]);
      }
      function Rm(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const xm = (function YS() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Pm(e) {
        return _e(e?.[xm]);
      }
      function km(e) {
        return (function Ni(e, n, t) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var i,
            r = t.apply(e, n || []),
            o = [];
          return (
            (i = {}),
            s("next"),
            s("throw"),
            s("return"),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function s(f) {
            r[f] &&
              (i[f] = function (h) {
                return new Promise(function (y, b) {
                  o.push([f, h, y, b]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function l(f) {
                f.value instanceof ln
                  ? Promise.resolve(f.value.v).then(c, u)
                  : d(o[0][2], f);
              })(r[f](h));
            } catch (y) {
              d(o[0][3], y);
            }
          }
          function c(f) {
            a("next", f);
          }
          function u(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
          }
        })(this, arguments, function* () {
          const t = e.getReader();
          try {
            for (;;) {
              const { value: r, done: i } = yield ln(t.read());
              if (i) return yield ln(void 0);
              yield yield ln(r);
            }
          } finally {
            t.releaseLock();
          }
        });
      }
      function Fm(e) {
        return _e(e?.getReader);
      }
      function Et(e) {
        if (e instanceof Me) return e;
        if (null != e) {
          if (Om(e))
            return (function JS(e) {
              return new Me((n) => {
                const t = e[Vs]();
                if (_e(t.subscribe)) return t.subscribe(n);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (Fd(e))
            return (function ZS(e) {
              return new Me((n) => {
                for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
                n.complete();
              });
            })(e);
          if (Im(e))
            return (function QS(e) {
              return new Me((n) => {
                e.then(
                  (t) => {
                    n.closed || (n.next(t), n.complete());
                  },
                  (t) => n.error(t)
                ).then(null, Sd);
              });
            })(e);
          if (Am(e)) return Lm(e);
          if (Pm(e))
            return (function XS(e) {
              return new Me((n) => {
                for (const t of e) if ((n.next(t), n.closed)) return;
                n.complete();
              });
            })(e);
          if (Fm(e))
            return (function eM(e) {
              return Lm(km(e));
            })(e);
        }
        throw Rm(e);
      }
      function Lm(e) {
        return new Me((n) => {
          (function tM(e, n) {
            var t, r, i, o;
            return (function D(e, n, t, r) {
              return new (t || (t = Promise))(function (o, s) {
                function a(u) {
                  try {
                    c(r.next(u));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(u) {
                  try {
                    c(r.throw(u));
                  } catch (d) {
                    s(d);
                  }
                }
                function c(u) {
                  u.done
                    ? o(u.value)
                    : (function i(o) {
                        return o instanceof t
                          ? o
                          : new t(function (s) {
                              s(o);
                            });
                      })(u.value).then(a, l);
                }
                c((r = r.apply(e, n || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (t = Gs(e); !(r = yield t.next()).done; )
                  if ((n.next(r.value), n.closed)) return;
              } catch (s) {
                i = { error: s };
              } finally {
                try {
                  r && !r.done && (o = t.return) && (yield o.call(t));
                } finally {
                  if (i) throw i.error;
                }
              }
              n.complete();
            });
          })(e, n).catch((t) => n.error(t));
        });
      }
      function Ar(e, n, t, r = 0, i = !1) {
        const o = n.schedule(function () {
          t(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(o), !i)) return o;
      }
      function St(e, n, t = 1 / 0) {
        return _e(n)
          ? St((r, i) => Z((o, s) => n(r, o, i, s))(Et(e(r, i))), t)
          : ("number" == typeof n && (t = n),
            Qe((r, i) =>
              (function nM(e, n, t, r, i, o, s, a) {
                const l = [];
                let c = 0,
                  u = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !c && n.complete();
                  },
                  h = (b) => (c < r ? y(b) : l.push(b)),
                  y = (b) => {
                    o && n.next(b), c++;
                    let w = !1;
                    Et(t(b, u++)).subscribe(
                      Be(
                        n,
                        (S) => {
                          i?.(S), o ? h(S) : n.next(S);
                        },
                        () => {
                          w = !0;
                        },
                        void 0,
                        () => {
                          if (w)
                            try {
                              for (c--; l.length && c < r; ) {
                                const S = l.shift();
                                s ? Ar(n, s, () => y(S)) : y(S);
                              }
                              f();
                            } catch (S) {
                              n.error(S);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Be(n, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, i, e, t)
            ));
      }
      function mo(e = 1 / 0) {
        return St(Kn, e);
      }
      const kn = new Me((e) => e.complete());
      function Bm(e) {
        return e && _e(e.schedule);
      }
      function Ld(e) {
        return e[e.length - 1];
      }
      function Ul(e) {
        return _e(Ld(e)) ? e.pop() : void 0;
      }
      function js(e) {
        return Bm(Ld(e)) ? e.pop() : void 0;
      }
      function Vm(e, n = 0) {
        return Qe((t, r) => {
          t.subscribe(
            Be(
              r,
              (i) => Ar(r, e, () => r.next(i), n),
              () => Ar(r, e, () => r.complete(), n),
              (i) => Ar(r, e, () => r.error(i), n)
            )
          );
        });
      }
      function Hm(e, n = 0) {
        return Qe((t, r) => {
          r.add(e.schedule(() => t.subscribe(r), n));
        });
      }
      function Um(e, n) {
        if (!e) throw new Error("Iterable cannot be null");
        return new Me((t) => {
          Ar(t, n, () => {
            const r = e[Symbol.asyncIterator]();
            Ar(
              t,
              n,
              () => {
                r.next().then((i) => {
                  i.done ? t.complete() : t.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function mt(e, n) {
        return n
          ? (function uM(e, n) {
              if (null != e) {
                if (Om(e))
                  return (function oM(e, n) {
                    return Et(e).pipe(Hm(n), Vm(n));
                  })(e, n);
                if (Fd(e))
                  return (function aM(e, n) {
                    return new Me((t) => {
                      let r = 0;
                      return n.schedule(function () {
                        r === e.length
                          ? t.complete()
                          : (t.next(e[r++]), t.closed || this.schedule());
                      });
                    });
                  })(e, n);
                if (Im(e))
                  return (function sM(e, n) {
                    return Et(e).pipe(Hm(n), Vm(n));
                  })(e, n);
                if (Am(e)) return Um(e, n);
                if (Pm(e))
                  return (function lM(e, n) {
                    return new Me((t) => {
                      let r;
                      return (
                        Ar(t, n, () => {
                          (r = e[xm]()),
                            Ar(
                              t,
                              n,
                              () => {
                                let i, o;
                                try {
                                  ({ value: i, done: o } = r.next());
                                } catch (s) {
                                  return void t.error(s);
                                }
                                o ? t.complete() : t.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => _e(r?.return) && r.return()
                      );
                    });
                  })(e, n);
                if (Fm(e))
                  return (function cM(e, n) {
                    return Um(km(e), n);
                  })(e, n);
              }
              throw Rm(e);
            })(e, n)
          : Et(e);
      }
      function $m(...e) {
        const n = js(e),
          t = (function iM(e, n) {
            return "number" == typeof Ld(e) ? e.pop() : n;
          })(e, 1 / 0),
          r = e;
        return r.length ? (1 === r.length ? Et(r[0]) : mo(t)(mt(r, n))) : kn;
      }
      function Bd(e, n, ...t) {
        if (!0 === n) return void e();
        if (!1 === n) return;
        const r = new ri({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return Et(n(...t)).subscribe(r);
      }
      function He(e) {
        for (let n in e) if (e[n] === He) return n;
        throw Error("Could not find renamed property on target object.");
      }
      function Vd(e, n) {
        for (const t in n)
          n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
      }
      function $e(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map($e).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const n = e.toString();
        if (null == n) return "" + n;
        const t = n.indexOf("\n");
        return -1 === t ? n : n.substring(0, t);
      }
      function Hd(e, n) {
        return null == e || "" === e
          ? null === n
            ? ""
            : n
          : null == n || "" === n
          ? e
          : e + " " + n;
      }
      const fM = He({ __forward_ref__: He });
      function oe(e) {
        return (
          (e.__forward_ref__ = oe),
          (e.toString = function () {
            return $e(this());
          }),
          e
        );
      }
      function X(e) {
        return Ud(e) ? e() : e;
      }
      function Ud(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(fM) &&
          e.__forward_ref__ === oe
        );
      }
      function $d(e) {
        return e && !!e.ɵproviders;
      }
      const Gm = "https://g.co/ng/security#xss";
      class B extends Error {
        constructor(n, t) {
          super($l(n, t)), (this.code = n);
        }
      }
      function $l(e, n) {
        return `NG0${Math.abs(e)}${n ? ": " + n.trim() : ""}`;
      }
      function ae(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function Gl(e, n) {
        throw new B(-201, !1);
      }
      function Ne(e, n, t, r) {
        throw new Error(
          `ASSERTION ERROR: ${e}` +
            (null == r ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`)
        );
      }
      function F(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function Ie(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function jl(e) {
        return jm(e, zl) || jm(e, Wm);
      }
      function jm(e, n) {
        return e.hasOwnProperty(n) ? e[n] : null;
      }
      function zm(e) {
        return e && (e.hasOwnProperty(Gd) || e.hasOwnProperty(bM))
          ? e[Gd]
          : null;
      }
      const zl = He({ ɵprov: He }),
        Gd = He({ ɵinj: He }),
        Wm = He({ ngInjectableDef: He }),
        bM = He({ ngInjectorDef: He });
      var ee = (() => (
        ((ee = ee || {})[(ee.Default = 0)] = "Default"),
        (ee[(ee.Host = 1)] = "Host"),
        (ee[(ee.Self = 2)] = "Self"),
        (ee[(ee.SkipSelf = 4)] = "SkipSelf"),
        (ee[(ee.Optional = 8)] = "Optional"),
        ee
      ))();
      let jd;
      function Ln(e) {
        const n = jd;
        return (jd = e), n;
      }
      function qm(e, n, t) {
        const r = jl(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : t & ee.Optional
          ? null
          : void 0 !== n
          ? n
          : void Gl($e(e));
      }
      const Ke = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        zs = {},
        zd = "__NG_DI_FLAG__",
        Wl = "ngTempTokenPath",
        CM = "ngTokenPath",
        wM = /\n/gm,
        EM = "\u0275",
        Km = "__source";
      let Ws;
      function _o(e) {
        const n = Ws;
        return (Ws = e), n;
      }
      function SM(e, n = ee.Default) {
        if (void 0 === Ws) throw new B(-203, !1);
        return null === Ws
          ? qm(e, void 0, n)
          : Ws.get(e, n & ee.Optional ? null : void 0, n);
      }
      function L(e, n = ee.Default) {
        return (
          (function DM() {
            return jd;
          })() || SM
        )(X(e), n);
      }
      function se(e, n = ee.Default) {
        return L(e, ql(n));
      }
      function ql(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Wd(e) {
        const n = [];
        for (let t = 0; t < e.length; t++) {
          const r = X(e[t]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new B(900, !1);
            let i,
              o = ee.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = MM(a);
              "number" == typeof l
                ? -1 === l
                  ? (i = a.token)
                  : (o |= l)
                : (i = a);
            }
            n.push(L(i, o));
          } else n.push(L(r));
        }
        return n;
      }
      function qs(e, n) {
        return (e[zd] = n), (e.prototype[zd] = n), e;
      }
      function MM(e) {
        return e[zd];
      }
      function Rr(e) {
        return { toString: e }.toString();
      }
      var fr = (() => (
          ((fr = fr || {})[(fr.OnPush = 0)] = "OnPush"),
          (fr[(fr.Default = 1)] = "Default"),
          fr
        ))(),
        hr = (() => {
          return (
            ((e = hr || (hr = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            hr
          );
          var e;
        })();
      const xr = {},
        Se = [],
        Kl = He({ ɵcmp: He }),
        qd = He({ ɵdir: He }),
        Kd = He({ ɵpipe: He }),
        Jm = He({ ɵmod: He }),
        Pr = He({ ɵfac: He }),
        Ks = He({ __NG_ELEMENT_ID__: He });
      let IM = 0;
      function Oe(e) {
        return Rr(() => {
          const n = Qm(e),
            t = {
              ...n,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === fr.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (n.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              data: e.data || {},
              encapsulation: e.encapsulation || hr.Emulated,
              id: "c" + IM++,
              styles: e.styles || Se,
              _: null,
              schemas: e.schemas || null,
              tView: null,
            };
          Xm(t);
          const r = e.dependencies;
          return (t.directiveDefs = Yl(r, !1)), (t.pipeDefs = Yl(r, !0)), t;
        });
      }
      function AM(e) {
        return Ae(e) || Wt(e);
      }
      function RM(e) {
        return null !== e;
      }
      function ke(e) {
        return Rr(() => ({
          type: e.type,
          bootstrap: e.bootstrap || Se,
          declarations: e.declarations || Se,
          imports: e.imports || Se,
          exports: e.exports || Se,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function Zm(e, n) {
        if (null == e) return xr;
        const t = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let i = e[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])),
              (t[i] = r),
              n && (n[i] = o);
          }
        return t;
      }
      function V(e) {
        return Rr(() => {
          const n = Qm(e);
          return Xm(n), n;
        });
      }
      function cn(e) {
        return {
          type: e.type,
          name: e.name,
          factory: null,
          pure: !1 !== e.pure,
          standalone: !0 === e.standalone,
          onDestroy: e.type.prototype.ngOnDestroy || null,
        };
      }
      function Ae(e) {
        return e[Kl] || null;
      }
      function Wt(e) {
        return e[qd] || null;
      }
      function un(e) {
        return e[Kd] || null;
      }
      function Cn(e, n) {
        const t = e[Jm] || null;
        if (!t && !0 === n)
          throw new Error(`Type ${$e(e)} does not have '\u0275mod' property.`);
        return t;
      }
      function Qm(e) {
        const n = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: n,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          selectors: e.selectors || Se,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: Zm(e.inputs, n),
          outputs: Zm(e.outputs),
        };
      }
      function Xm(e) {
        e.features?.forEach((n) => n(e));
      }
      function Yl(e, n) {
        if (!e) return null;
        const t = n ? un : AM;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => t(r)).filter(RM);
      }
      const kr = 0,
        $ = 1,
        he = 2,
        it = 3,
        Yn = 4,
        Ii = 5,
        qt = 6,
        yo = 7,
        dt = 8,
        Jl = 9,
        Zl = 10,
        ge = 11,
        Yd = 12,
        Ys = 13,
        e_ = 14,
        bo = 15,
        Kt = 16,
        Js = 17,
        Do = 18,
        pr = 19,
        Zs = 20,
        t_ = 21,
        Ye = 22,
        Jd = 1,
        n_ = 2,
        Ql = 7,
        Xl = 8,
        Co = 9,
        Xt = 10;
      function wn(e) {
        return Array.isArray(e) && "object" == typeof e[Jd];
      }
      function Jn(e) {
        return Array.isArray(e) && !0 === e[Jd];
      }
      function Zd(e) {
        return 0 != (4 & e.flags);
      }
      function Qs(e) {
        return e.componentOffset > -1;
      }
      function ec(e) {
        return 1 == (1 & e.flags);
      }
      function Zn(e) {
        return !!e.template;
      }
      function PM(e) {
        return 0 != (256 & e[he]);
      }
      function Oi(e, n) {
        return e.hasOwnProperty(Pr) ? e[Pr] : null;
      }
      class LM {
        constructor(n, t, r) {
          (this.previousValue = n),
            (this.currentValue = t),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function ot() {
        return o_;
      }
      function o_(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = VM), BM;
      }
      function BM() {
        const e = a_(this),
          n = e?.current;
        if (n) {
          const t = e.previous;
          if (t === xr) e.previous = n;
          else for (let r in n) t[r] = n[r];
          (e.current = null), this.ngOnChanges(n);
        }
      }
      function VM(e, n, t, r) {
        const i = this.declaredInputs[t],
          o =
            a_(e) ||
            (function HM(e, n) {
              return (e[s_] = n);
            })(e, { previous: xr, current: null }),
          s = o.current || (o.current = {}),
          a = o.previous,
          l = a[i];
        (s[i] = new LM(l && l.currentValue, n, a === xr)), (e[r] = n);
      }
      ot.ngInherit = !0;
      const s_ = "__ngSimpleChanges__";
      function a_(e) {
        return e[s_] || null;
      }
      const Bn = function (e, n, t) {};
      function Bt(e) {
        for (; Array.isArray(e); ) e = e[kr];
        return e;
      }
      function tc(e, n) {
        return Bt(n[e]);
      }
      function En(e, n) {
        return Bt(n[e.index]);
      }
      function u_(e, n) {
        return e.data[n];
      }
      function wo(e, n) {
        return e[n];
      }
      function dn(e, n) {
        const t = n[e];
        return wn(t) ? t : t[kr];
      }
      function nc(e) {
        return 64 == (64 & e[he]);
      }
      function oi(e, n) {
        return null == n ? null : e[n];
      }
      function d_(e) {
        e[Do] = 0;
      }
      function Xd(e, n) {
        e[Ii] += n;
        let t = e,
          r = e[it];
        for (
          ;
          null !== r && ((1 === n && 1 === t[Ii]) || (-1 === n && 0 === t[Ii]));

        )
          (r[Ii] += n), (t = r), (r = r[it]);
      }
      const le = { lFrame: D_(null), bindingsEnabled: !0 };
      function h_() {
        return le.bindingsEnabled;
      }
      function x() {
        return le.lFrame.lView;
      }
      function be() {
        return le.lFrame.tView;
      }
      function K(e) {
        return (le.lFrame.contextLView = e), e[dt];
      }
      function Y(e) {
        return (le.lFrame.contextLView = null), e;
      }
      function Vt() {
        let e = p_();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function p_() {
        return le.lFrame.currentTNode;
      }
      function Xs() {
        const e = le.lFrame,
          n = e.currentTNode;
        return e.isParent ? n : n.parent;
      }
      function gr(e, n) {
        const t = le.lFrame;
        (t.currentTNode = e), (t.isParent = n);
      }
      function ef() {
        return le.lFrame.isParent;
      }
      function tf() {
        le.lFrame.isParent = !1;
      }
      function en() {
        const e = le.lFrame;
        let n = e.bindingRootIndex;
        return (
          -1 === n && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n
        );
      }
      function Fr() {
        return le.lFrame.bindingIndex;
      }
      function Eo() {
        return le.lFrame.bindingIndex++;
      }
      function Lr(e) {
        const n = le.lFrame,
          t = n.bindingIndex;
        return (n.bindingIndex = n.bindingIndex + e), t;
      }
      function __(e) {
        le.lFrame.inI18n = e;
      }
      function XM(e, n) {
        const t = le.lFrame;
        (t.bindingIndex = t.bindingRootIndex = e), nf(n);
      }
      function nf(e) {
        le.lFrame.currentDirectiveIndex = e;
      }
      function v_() {
        return le.lFrame.currentQueryIndex;
      }
      function sf(e) {
        le.lFrame.currentQueryIndex = e;
      }
      function tT(e) {
        const n = e[$];
        return 2 === n.type ? n.declTNode : 1 === n.type ? e[qt] : null;
      }
      function y_(e, n, t) {
        if (t & ee.SkipSelf) {
          let i = n,
            o = e;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              t & ee.Host ||
              ((i = tT(o)), null === i || ((o = o[bo]), 10 & i.type)));

          );
          if (null === i) return !1;
          (n = i), (e = o);
        }
        const r = (le.lFrame = b_());
        return (r.currentTNode = n), (r.lView = e), !0;
      }
      function af(e) {
        const n = b_(),
          t = e[$];
        (le.lFrame = n),
          (n.currentTNode = t.firstChild),
          (n.lView = e),
          (n.tView = t),
          (n.contextLView = e),
          (n.bindingIndex = t.bindingStartIndex),
          (n.inI18n = !1);
      }
      function b_() {
        const e = le.lFrame,
          n = null === e ? null : e.child;
        return null === n ? D_(e) : n;
      }
      function D_(e) {
        const n = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = n), n;
      }
      function C_() {
        const e = le.lFrame;
        return (
          (le.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const w_ = C_;
      function lf() {
        const e = C_();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function tn() {
        return le.lFrame.selectedIndex;
      }
      function Ai(e) {
        le.lFrame.selectedIndex = e;
      }
      function tt() {
        const e = le.lFrame;
        return u_(e.tView, e.selectedIndex);
      }
      function rc(e, n) {
        for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
          const o = e.data[t].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: c,
              ngOnDestroy: u,
            } = o;
          s && (e.contentHooks ?? (e.contentHooks = [])).push(-t, s),
            a &&
              ((e.contentHooks ?? (e.contentHooks = [])).push(t, a),
              (e.contentCheckHooks ?? (e.contentCheckHooks = [])).push(t, a)),
            l && (e.viewHooks ?? (e.viewHooks = [])).push(-t, l),
            c &&
              ((e.viewHooks ?? (e.viewHooks = [])).push(t, c),
              (e.viewCheckHooks ?? (e.viewCheckHooks = [])).push(t, c)),
            null != u && (e.destroyHooks ?? (e.destroyHooks = [])).push(t, u);
        }
      }
      function ic(e, n, t) {
        E_(e, n, 3, t);
      }
      function oc(e, n, t, r) {
        (3 & e[he]) === t && E_(e, n, t, r);
      }
      function cf(e, n) {
        let t = e[he];
        (3 & t) === n && ((t &= 2047), (t += 1), (e[he] = t));
      }
      function E_(e, n, t, r) {
        const o = r ?? -1,
          s = n.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & e[Do] : 0; l < s; l++)
          if ("number" == typeof n[l + 1]) {
            if (((a = n[l]), null != r && a >= r)) break;
          } else
            n[l] < 0 && (e[Do] += 65536),
              (a < o || -1 == o) &&
                (uT(e, t, n, l), (e[Do] = (4294901760 & e[Do]) + l + 2)),
              l++;
      }
      function uT(e, n, t, r) {
        const i = t[r] < 0,
          o = t[r + 1],
          a = e[i ? -t[r] : t[r]];
        if (i) {
          if (e[he] >> 11 < e[Do] >> 16 && (3 & e[he]) === n) {
            (e[he] += 2048), Bn(4, a, o);
            try {
              o.call(a);
            } finally {
              Bn(5, a, o);
            }
          }
        } else {
          Bn(4, a, o);
          try {
            o.call(a);
          } finally {
            Bn(5, a, o);
          }
        }
      }
      const So = -1;
      class ea {
        constructor(n, t, r) {
          (this.factory = n),
            (this.resolving = !1),
            (this.canSeeViewProviders = t),
            (this.injectImpl = r);
        }
      }
      function df(e, n, t) {
        let r = 0;
        for (; r < t.length; ) {
          const i = t[r];
          if ("number" == typeof i) {
            if (0 !== i) break;
            r++;
            const o = t[r++],
              s = t[r++],
              a = t[r++];
            e.setAttribute(n, s, a, o);
          } else {
            const o = i,
              s = t[++r];
            M_(o) ? e.setProperty(n, o, s) : e.setAttribute(n, o, s), r++;
          }
        }
        return r;
      }
      function S_(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function M_(e) {
        return 64 === e.charCodeAt(0);
      }
      function ta(e, n) {
        if (null !== n && 0 !== n.length)
          if (null === e || 0 === e.length) e = n.slice();
          else {
            let t = -1;
            for (let r = 0; r < n.length; r++) {
              const i = n[r];
              "number" == typeof i
                ? (t = i)
                : 0 === t ||
                  T_(e, t, i, null, -1 === t || 2 === t ? n[++r] : null);
            }
          }
        return e;
      }
      function T_(e, n, t, r, i) {
        let o = 0,
          s = e.length;
        if (-1 === n) s = -1;
        else
          for (; o < e.length; ) {
            const a = e[o++];
            if ("number" == typeof a) {
              if (a === n) {
                s = -1;
                break;
              }
              if (a > n) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < e.length; ) {
          const a = e[o];
          if ("number" == typeof a) break;
          if (a === t) {
            if (null === r) return void (null !== i && (e[o + 1] = i));
            if (r === e[o + 1]) return void (e[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (e.splice(s, 0, n), (o = s + 1)),
          e.splice(o++, 0, t),
          null !== r && e.splice(o++, 0, r),
          null !== i && e.splice(o++, 0, i);
      }
      function N_(e) {
        return e !== So;
      }
      function sc(e) {
        return 32767 & e;
      }
      function ac(e, n) {
        let t = (function pT(e) {
            return e >> 16;
          })(e),
          r = n;
        for (; t > 0; ) (r = r[bo]), t--;
        return r;
      }
      let ff = !0;
      function lc(e) {
        const n = ff;
        return (ff = e), n;
      }
      const I_ = 255,
        O_ = 5;
      let gT = 0;
      const mr = {};
      function cc(e, n) {
        const t = A_(e, n);
        if (-1 !== t) return t;
        const r = n[$];
        r.firstCreatePass &&
          ((e.injectorIndex = n.length),
          hf(r.data, e),
          hf(n, null),
          hf(r.blueprint, null));
        const i = pf(e, n),
          o = e.injectorIndex;
        if (N_(i)) {
          const s = sc(i),
            a = ac(i, n),
            l = a[$].data;
          for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c];
        }
        return (n[o + 8] = i), o;
      }
      function hf(e, n) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
      }
      function A_(e, n) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === n[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function pf(e, n) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let t = 0,
          r = null,
          i = n;
        for (; null !== i; ) {
          if (((r = B_(i)), null === r)) return So;
          if ((t++, (i = i[bo]), -1 !== r.injectorIndex))
            return r.injectorIndex | (t << 16);
        }
        return So;
      }
      function gf(e, n, t) {
        !(function mT(e, n, t) {
          let r;
          "string" == typeof t
            ? (r = t.charCodeAt(0) || 0)
            : t.hasOwnProperty(Ks) && (r = t[Ks]),
            null == r && (r = t[Ks] = gT++);
          const i = r & I_;
          n.data[e + (i >> O_)] |= 1 << i;
        })(e, n, t);
      }
      function R_(e, n, t) {
        if (t & ee.Optional || void 0 !== e) return e;
        Gl();
      }
      function x_(e, n, t, r) {
        if (
          (t & ee.Optional && void 0 === r && (r = null),
          !(t & (ee.Self | ee.Host)))
        ) {
          const i = e[Jl],
            o = Ln(void 0);
          try {
            return i ? i.get(n, r, t & ee.Optional) : qm(n, r, t & ee.Optional);
          } finally {
            Ln(o);
          }
        }
        return R_(r, 0, t);
      }
      function P_(e, n, t, r = ee.Default, i) {
        if (null !== e) {
          if (1024 & n[he]) {
            const s = (function DT(e, n, t, r, i) {
              let o = e,
                s = n;
              for (
                ;
                null !== o && null !== s && 1024 & s[he] && !(256 & s[he]);

              ) {
                const a = k_(o, s, t, r | ee.Self, mr);
                if (a !== mr) return a;
                let l = o.parent;
                if (!l) {
                  const c = s[t_];
                  if (c) {
                    const u = c.get(t, mr, r);
                    if (u !== mr) return u;
                  }
                  (l = B_(s)), (s = s[bo]);
                }
                o = l;
              }
              return i;
            })(e, n, t, r, mr);
            if (s !== mr) return s;
          }
          const o = k_(e, n, t, r, mr);
          if (o !== mr) return o;
        }
        return x_(n, t, r, i);
      }
      function k_(e, n, t, r, i) {
        const o = (function yT(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const n = e.hasOwnProperty(Ks) ? e[Ks] : void 0;
          return "number" == typeof n ? (n >= 0 ? n & I_ : bT) : n;
        })(t);
        if ("function" == typeof o) {
          if (!y_(n, e, r)) return r & ee.Host ? R_(i, 0, r) : x_(n, t, r, i);
          try {
            const s = o(r);
            if (null != s || r & ee.Optional) return s;
            Gl();
          } finally {
            w_();
          }
        } else if ("number" == typeof o) {
          let s = null,
            a = A_(e, n),
            l = So,
            c = r & ee.Host ? n[Kt][qt] : null;
          for (
            (-1 === a || r & ee.SkipSelf) &&
            ((l = -1 === a ? pf(e, n) : n[a + 8]),
            l !== So && L_(r, !1)
              ? ((s = n[$]), (a = sc(l)), (n = ac(l, n)))
              : (a = -1));
            -1 !== a;

          ) {
            const u = n[$];
            if (F_(o, a, u.data)) {
              const d = vT(a, n, t, s, r, c);
              if (d !== mr) return d;
            }
            (l = n[a + 8]),
              l !== So && L_(r, n[$].data[a + 8] === c) && F_(o, a, n)
                ? ((s = u), (a = sc(l)), (n = ac(l, n)))
                : (a = -1);
          }
        }
        return i;
      }
      function vT(e, n, t, r, i, o) {
        const s = n[$],
          a = s.data[e + 8],
          u = uc(
            a,
            s,
            t,
            null == r ? Qs(a) && ff : r != s && 0 != (3 & a.type),
            i & ee.Host && o === a
          );
        return null !== u ? Ri(n, s, u, a) : mr;
      }
      function uc(e, n, t, r, i) {
        const o = e.providerIndexes,
          s = n.data,
          a = 1048575 & o,
          l = e.directiveStart,
          u = o >> 20,
          f = i ? a + u : e.directiveEnd;
        for (let h = r ? a : a + u; h < f; h++) {
          const y = s[h];
          if ((h < l && t === y) || (h >= l && y.type === t)) return h;
        }
        if (i) {
          const h = s[l];
          if (h && Zn(h) && h.type === t) return l;
        }
        return null;
      }
      function Ri(e, n, t, r) {
        let i = e[t];
        const o = n.data;
        if (
          (function dT(e) {
            return e instanceof ea;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function hM(e, n) {
              const t = n ? `. Dependency path: ${n.join(" > ")} > ${e}` : "";
              throw new B(
                -200,
                `Circular dependency in DI detected for ${e}${t}`
              );
            })(
              (function Te(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : ae(e);
              })(o[t])
            );
          const a = lc(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Ln(s.injectImpl) : null;
          y_(e, r, ee.Default);
          try {
            (i = e[t] = s.factory(void 0, o, e, r)),
              n.firstCreatePass &&
                t >= r.directiveStart &&
                (function cT(e, n, t) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: i,
                    ngDoCheck: o,
                  } = n.type.prototype;
                  if (r) {
                    const s = o_(n);
                    (t.preOrderHooks ?? (t.preOrderHooks = [])).push(e, s),
                      (
                        t.preOrderCheckHooks ?? (t.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  i &&
                    (t.preOrderHooks ?? (t.preOrderHooks = [])).push(0 - e, i),
                    o &&
                      ((t.preOrderHooks ?? (t.preOrderHooks = [])).push(e, o),
                      (
                        t.preOrderCheckHooks ?? (t.preOrderCheckHooks = [])
                      ).push(e, o));
                })(t, o[t], n);
          } finally {
            null !== l && Ln(l), lc(a), (s.resolving = !1), w_();
          }
        }
        return i;
      }
      function F_(e, n, t) {
        return !!(t[n + (e >> O_)] & (1 << e));
      }
      function L_(e, n) {
        return !(e & ee.Self || (e & ee.Host && n));
      }
      class Mo {
        constructor(n, t) {
          (this._tNode = n), (this._lView = t);
        }
        get(n, t, r) {
          return P_(this._tNode, this._lView, n, ql(r), t);
        }
      }
      function bT() {
        return new Mo(Vt(), x());
      }
      function st(e) {
        return Rr(() => {
          const n = e.prototype.constructor,
            t = n[Pr] || mf(n),
            r = Object.prototype;
          let i = Object.getPrototypeOf(e.prototype).constructor;
          for (; i && i !== r; ) {
            const o = i[Pr] || mf(i);
            if (o && o !== t) return o;
            i = Object.getPrototypeOf(i);
          }
          return (o) => new o();
        });
      }
      function mf(e) {
        return Ud(e)
          ? () => {
              const n = mf(X(e));
              return n && n();
            }
          : Oi(e);
      }
      function B_(e) {
        const n = e[$],
          t = n.type;
        return 2 === t ? n.declTNode : 1 === t ? e[qt] : null;
      }
      function si(e) {
        return (function _T(e, n) {
          if ("class" === n) return e.classes;
          if ("style" === n) return e.styles;
          const t = e.attrs;
          if (t) {
            const r = t.length;
            let i = 0;
            for (; i < r; ) {
              const o = t[i];
              if (S_(o)) break;
              if (0 === o) i += 2;
              else if ("number" == typeof o)
                for (i++; i < r && "string" == typeof t[i]; ) i++;
              else {
                if (o === n) return t[i + 1];
                i += 2;
              }
            }
          }
          return null;
        })(Vt(), e);
      }
      const No = "__parameters__";
      function Oo(e, n, t) {
        return Rr(() => {
          const r = (function _f(e) {
            return function (...t) {
              if (e) {
                const r = e(...t);
                for (const i in r) this[i] = r[i];
              }
            };
          })(n);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(l, c, u) {
              const d = l.hasOwnProperty(No)
                ? l[No]
                : Object.defineProperty(l, No, { value: [] })[No];
              for (; d.length <= u; ) d.push(null);
              return (d[u] = d[u] || []).push(s), l;
            }
          }
          return (
            t && (i.prototype = Object.create(t.prototype)),
            (i.prototype.ngMetadataName = e),
            (i.annotationCls = i),
            i
          );
        });
      }
      class z {
        constructor(n, t) {
          (this._desc = n),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof t
              ? (this.__NG_ELEMENT_ID__ = t)
              : void 0 !== t &&
                (this.ɵprov = F({
                  token: this,
                  providedIn: t.providedIn || "root",
                  factory: t.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function xi(e, n) {
        e.forEach((t) => (Array.isArray(t) ? xi(t, n) : n(t)));
      }
      function H_(e, n, t) {
        n >= e.length ? e.push(t) : e.splice(n, 0, t);
      }
      function dc(e, n) {
        return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
      }
      function ia(e, n) {
        const t = [];
        for (let r = 0; r < e; r++) t.push(n);
        return t;
      }
      function Sn(e, n, t) {
        let r = Ao(e, n);
        return (
          r >= 0
            ? (e[1 | r] = t)
            : ((r = ~r),
              (function ST(e, n, t, r) {
                let i = e.length;
                if (i == n) e.push(t, r);
                else if (1 === i) e.push(r, e[0]), (e[0] = t);
                else {
                  for (i--, e.push(e[i - 1], e[i]); i > n; )
                    (e[i] = e[i - 2]), i--;
                  (e[n] = t), (e[n + 1] = r);
                }
              })(e, r, n, t)),
          r
        );
      }
      function yf(e, n) {
        const t = Ao(e, n);
        if (t >= 0) return e[1 | t];
      }
      function Ao(e, n) {
        return (function U_(e, n, t) {
          let r = 0,
            i = e.length >> t;
          for (; i !== r; ) {
            const o = r + ((i - r) >> 1),
              s = e[o << t];
            if (n === s) return o << t;
            s > n ? (i = o) : (r = o + 1);
          }
          return ~(i << t);
        })(e, n, 1);
      }
      const oa = qs(Oo("Optional"), 8),
        sa = qs(Oo("SkipSelf"), 4);
      var fn = (() => (
        ((fn = fn || {})[(fn.Important = 1)] = "Important"),
        (fn[(fn.DashCase = 2)] = "DashCase"),
        fn
      ))();
      const jT = /^>|^->|<!--|-->|--!>|<!-$/g,
        zT = /(<|>)/,
        WT = "\u200b$1\u200b";
      const Sf = new Map();
      let qT = 0;
      const Tf = "__ngContext__";
      function Yt(e, n) {
        wn(n)
          ? ((e[Tf] = n[Zs]),
            (function YT(e) {
              Sf.set(e[Zs], e);
            })(n))
          : (e[Tf] = n);
      }
      let Nf;
      function If(e, n) {
        return Nf(e, n);
      }
      function ua(e) {
        const n = e[it];
        return Jn(n) ? n[it] : n;
      }
      function Of(e) {
        return av(e[Ys]);
      }
      function Af(e) {
        return av(e[Yn]);
      }
      function av(e) {
        for (; null !== e && !Jn(e); ) e = e[Yn];
        return e;
      }
      function xo(e, n, t, r, i) {
        if (null != r) {
          let o,
            s = !1;
          Jn(r) ? (o = r) : wn(r) && ((s = !0), (r = r[kr]));
          const a = Bt(r);
          0 === e && null !== t
            ? null == i
              ? hv(n, t, a)
              : Pi(n, t, a, i || null, !0)
            : 1 === e && null !== t
            ? Pi(n, t, a, i || null, !0)
            : 2 === e
            ? Bf(n, a, s)
            : 3 === e && n.destroyNode(a),
            null != o &&
              (function vN(e, n, t, r, i) {
                const o = t[Ql];
                o !== Bt(t) && xo(n, e, r, o, i);
                for (let a = Xt; a < t.length; a++) {
                  const l = t[a];
                  da(l[$], l, e, n, r, o);
                }
              })(n, e, o, t, i);
        }
      }
      function Rf(e, n) {
        return e.createText(n);
      }
      function lv(e, n, t) {
        e.setValue(n, t);
      }
      function sN(e, n) {
        return e.createComment(
          (function X_(e) {
            return e.replace(jT, (n) => n.replace(zT, WT));
          })(n)
        );
      }
      function xf(e, n, t) {
        return e.createElement(n, t);
      }
      function cv(e, n) {
        const t = e[Co],
          r = t.indexOf(n),
          i = n[it];
        512 & n[he] && ((n[he] &= -513), Xd(i, -1)), t.splice(r, 1);
      }
      function Pf(e, n) {
        if (e.length <= Xt) return;
        const t = Xt + n,
          r = e[t];
        if (r) {
          const i = r[Js];
          null !== i && i !== e && cv(i, r), n > 0 && (e[t - 1][Yn] = r[Yn]);
          const o = dc(e, Xt + n);
          !(function aN(e, n) {
            da(e, n, n[ge], 2, null, null), (n[kr] = null), (n[qt] = null);
          })(r[$], r);
          const s = o[pr];
          null !== s && s.detachView(o[$]),
            (r[it] = null),
            (r[Yn] = null),
            (r[he] &= -65);
        }
        return r;
      }
      function uv(e, n) {
        if (!(128 & n[he])) {
          const t = n[ge];
          t.destroyNode && da(e, n, t, 3, null, null),
            (function uN(e) {
              let n = e[Ys];
              if (!n) return kf(e[$], e);
              for (; n; ) {
                let t = null;
                if (wn(n)) t = n[Ys];
                else {
                  const r = n[Xt];
                  r && (t = r);
                }
                if (!t) {
                  for (; n && !n[Yn] && n !== e; )
                    wn(n) && kf(n[$], n), (n = n[it]);
                  null === n && (n = e), wn(n) && kf(n[$], n), (t = n && n[Yn]);
                }
                n = t;
              }
            })(n);
        }
      }
      function kf(e, n) {
        if (!(128 & n[he])) {
          (n[he] &= -65),
            (n[he] |= 128),
            (function pN(e, n) {
              let t;
              if (null != e && null != (t = e.destroyHooks))
                for (let r = 0; r < t.length; r += 2) {
                  const i = n[t[r]];
                  if (!(i instanceof ea)) {
                    const o = t[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          l = o[s + 1];
                        Bn(4, a, l);
                        try {
                          l.call(a);
                        } finally {
                          Bn(5, a, l);
                        }
                      }
                    else {
                      Bn(4, i, o);
                      try {
                        o.call(i);
                      } finally {
                        Bn(5, i, o);
                      }
                    }
                  }
                }
            })(e, n),
            (function hN(e, n) {
              const t = e.cleanup,
                r = n[yo];
              let i = -1;
              if (null !== t)
                for (let o = 0; o < t.length - 1; o += 2)
                  if ("string" == typeof t[o]) {
                    const s = t[o + 3];
                    s >= 0 ? r[(i = s)]() : r[(i = -s)].unsubscribe(), (o += 2);
                  } else {
                    const s = r[(i = t[o + 1])];
                    t[o].call(s);
                  }
              if (null !== r) {
                for (let o = i + 1; o < r.length; o++) (0, r[o])();
                n[yo] = null;
              }
            })(e, n),
            1 === n[$].type && n[ge].destroy();
          const t = n[Js];
          if (null !== t && Jn(n[it])) {
            t !== n[it] && cv(t, n);
            const r = n[pr];
            null !== r && r.detachView(e);
          }
          !(function JT(e) {
            Sf.delete(e[Zs]);
          })(n);
        }
      }
      function dv(e, n, t) {
        return fv(e, n.parent, t);
      }
      function fv(e, n, t) {
        let r = n;
        for (; null !== r && 40 & r.type; ) r = (n = r).parent;
        if (null === r) return t[kr];
        {
          const { componentOffset: i } = r;
          if (i > -1) {
            const { encapsulation: o } = e.data[r.directiveStart + i];
            if (o === hr.None || o === hr.Emulated) return null;
          }
          return En(r, t);
        }
      }
      function Pi(e, n, t, r, i) {
        e.insertBefore(n, t, r, i);
      }
      function hv(e, n, t) {
        e.appendChild(n, t);
      }
      function pv(e, n, t, r, i) {
        null !== r ? Pi(e, n, t, r, i) : hv(e, n, t);
      }
      function gc(e, n) {
        return e.parentNode(n);
      }
      function gv(e, n, t) {
        return _v(e, n, t);
      }
      function mv(e, n, t) {
        return 40 & e.type ? En(e, t) : null;
      }
      let Ff,
        vc,
        Uf,
        yc,
        _v = mv;
      function vv(e, n) {
        (_v = e), (Ff = n);
      }
      function mc(e, n, t, r) {
        const i = dv(e, r, n),
          o = n[ge],
          a = gv(r.parent || n[qt], r, n);
        if (null != i)
          if (Array.isArray(t))
            for (let l = 0; l < t.length; l++) pv(o, i, t[l], a, !1);
          else pv(o, i, t, a, !1);
        void 0 !== Ff && Ff(o, r, n, t, i);
      }
      function _c(e, n) {
        if (null !== n) {
          const t = n.type;
          if (3 & t) return En(n, e);
          if (4 & t) return Lf(-1, e[n.index]);
          if (8 & t) {
            const r = n.child;
            if (null !== r) return _c(e, r);
            {
              const i = e[n.index];
              return Jn(i) ? Lf(-1, i) : Bt(i);
            }
          }
          if (32 & t) return If(n, e)() || Bt(e[n.index]);
          {
            const r = yv(e, n);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : _c(ua(e[Kt]), r)
              : _c(e, n.next);
          }
        }
        return null;
      }
      function yv(e, n) {
        return null !== n ? e[Kt][qt].projection[n.projection] : null;
      }
      function Lf(e, n) {
        const t = Xt + e + 1;
        if (t < n.length) {
          const r = n[t],
            i = r[$].firstChild;
          if (null !== i) return _c(r, i);
        }
        return n[Ql];
      }
      function Bf(e, n, t) {
        const r = gc(e, n);
        r &&
          (function gN(e, n, t, r) {
            e.removeChild(n, t, r);
          })(e, r, n, t);
      }
      function Vf(e, n, t, r, i, o, s) {
        for (; null != t; ) {
          const a = r[t.index],
            l = t.type;
          if (
            (s && 0 === n && (a && Yt(Bt(a), r), (t.flags |= 2)),
            32 != (32 & t.flags))
          )
            if (8 & l) Vf(e, n, t.child, r, i, o, !1), xo(n, e, i, a, o);
            else if (32 & l) {
              const c = If(t, r);
              let u;
              for (; (u = c()); ) xo(n, e, i, u, o);
              xo(n, e, i, a, o);
            } else 16 & l ? bv(e, n, r, t, i, o) : xo(n, e, i, a, o);
          t = s ? t.projectionNext : t.next;
        }
      }
      function da(e, n, t, r, i, o) {
        Vf(t, r, e.firstChild, n, i, o, !1);
      }
      function bv(e, n, t, r, i, o) {
        const s = t[Kt],
          l = s[qt].projection[r.projection];
        if (Array.isArray(l))
          for (let c = 0; c < l.length; c++) xo(n, e, i, l[c], o);
        else Vf(e, n, l, s[it], i, o, !0);
      }
      function Dv(e, n, t) {
        "" === t
          ? e.removeAttribute(n, "class")
          : e.setAttribute(n, "class", t);
      }
      function Cv(e, n, t) {
        const { mergedAttrs: r, classes: i, styles: o } = t;
        null !== r && df(e, n, r),
          null !== i && Dv(e, n, i),
          null !== o &&
            (function bN(e, n, t) {
              e.setAttribute(n, "style", t);
            })(e, n, o);
      }
      function Po(e) {
        return (
          (function Hf() {
            if (void 0 === vc && ((vc = null), Ke.trustedTypes))
              try {
                vc = Ke.trustedTypes.createPolicy("angular", {
                  createHTML: (e) => e,
                  createScript: (e) => e,
                  createScriptURL: (e) => e,
                });
              } catch {}
            return vc;
          })()?.createHTML(e) || e
        );
      }
      function wv() {
        return void 0 !== Uf ? Uf : typeof document < "u" ? document : void 0;
      }
      function $f() {
        if (void 0 === yc && ((yc = null), Ke.trustedTypes))
          try {
            yc = Ke.trustedTypes.createPolicy("angular#unsafe-bypass", {
              createHTML: (e) => e,
              createScript: (e) => e,
              createScriptURL: (e) => e,
            });
          } catch {}
        return yc;
      }
      function Ev(e) {
        return $f()?.createHTML(e) || e;
      }
      function Mv(e) {
        return $f()?.createScriptURL(e) || e;
      }
      class Tv {
        constructor(n) {
          this.changingThisBreaksApplicationSecurity = n;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Gm})`;
        }
      }
      function ai(e) {
        return e instanceof Tv ? e.changingThisBreaksApplicationSecurity : e;
      }
      function fa(e, n) {
        const t = (function ON(e) {
          return (e instanceof Tv && e.getTypeName()) || null;
        })(e);
        if (null != t && t !== n) {
          if ("ResourceURL" === t && "URL" === n) return !0;
          throw new Error(`Required a safe ${n}, got a ${t} (see ${Gm})`);
        }
        return t === n;
      }
      function Nv(e) {
        const n = new RN(e);
        return (function xN() {
          try {
            return !!new window.DOMParser().parseFromString(
              Po(""),
              "text/html"
            );
          } catch {
            return !1;
          }
        })()
          ? new AN(n)
          : n;
      }
      class AN {
        constructor(n) {
          this.inertDocumentHelper = n;
        }
        getInertBodyElement(n) {
          n = "<body><remove></remove>" + n;
          try {
            const t = new window.DOMParser().parseFromString(
              Po(n),
              "text/html"
            ).body;
            return null === t
              ? this.inertDocumentHelper.getInertBodyElement(n)
              : (t.removeChild(t.firstChild), t);
          } catch {
            return null;
          }
        }
      }
      class RN {
        constructor(n) {
          (this.defaultDoc = n),
            (this.inertDocument =
              this.defaultDoc.implementation.createHTMLDocument(
                "sanitization-inert"
              ));
        }
        getInertBodyElement(n) {
          const t = this.inertDocument.createElement("template");
          return (t.innerHTML = Po(n)), t;
        }
      }
      const PN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      function Gf(e) {
        return (e = String(e)).match(PN) ? e : "unsafe:" + e;
      }
      function Br(e) {
        const n = {};
        for (const t of e.split(",")) n[t] = !0;
        return n;
      }
      function ha(...e) {
        const n = {};
        for (const t of e)
          for (const r in t) t.hasOwnProperty(r) && (n[r] = !0);
        return n;
      }
      const Iv = Br("area,br,col,hr,img,wbr"),
        Ov = Br("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        Av = Br("rp,rt"),
        jf = ha(
          Iv,
          ha(
            Ov,
            Br(
              "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
            )
          ),
          ha(
            Av,
            Br(
              "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
            )
          ),
          ha(Av, Ov)
        ),
        zf = Br("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
        Rv = ha(
          zf,
          Br(
            "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
          ),
          Br(
            "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
          )
        ),
        kN = Br("script,style,template");
      class FN {
        constructor() {
          (this.sanitizedSomething = !1), (this.buf = []);
        }
        sanitizeChildren(n) {
          let t = n.firstChild,
            r = !0;
          for (; t; )
            if (
              (t.nodeType === Node.ELEMENT_NODE
                ? (r = this.startElement(t))
                : t.nodeType === Node.TEXT_NODE
                ? this.chars(t.nodeValue)
                : (this.sanitizedSomething = !0),
              r && t.firstChild)
            )
              t = t.firstChild;
            else
              for (; t; ) {
                t.nodeType === Node.ELEMENT_NODE && this.endElement(t);
                let i = this.checkClobberedElement(t, t.nextSibling);
                if (i) {
                  t = i;
                  break;
                }
                t = this.checkClobberedElement(t, t.parentNode);
              }
          return this.buf.join("");
        }
        startElement(n) {
          const t = n.nodeName.toLowerCase();
          if (!jf.hasOwnProperty(t))
            return (this.sanitizedSomething = !0), !kN.hasOwnProperty(t);
          this.buf.push("<"), this.buf.push(t);
          const r = n.attributes;
          for (let i = 0; i < r.length; i++) {
            const o = r.item(i),
              s = o.name,
              a = s.toLowerCase();
            if (!Rv.hasOwnProperty(a)) {
              this.sanitizedSomething = !0;
              continue;
            }
            let l = o.value;
            zf[a] && (l = Gf(l)), this.buf.push(" ", s, '="', xv(l), '"');
          }
          return this.buf.push(">"), !0;
        }
        endElement(n) {
          const t = n.nodeName.toLowerCase();
          jf.hasOwnProperty(t) &&
            !Iv.hasOwnProperty(t) &&
            (this.buf.push("</"), this.buf.push(t), this.buf.push(">"));
        }
        chars(n) {
          this.buf.push(xv(n));
        }
        checkClobberedElement(n, t) {
          if (
            t &&
            (n.compareDocumentPosition(t) &
              Node.DOCUMENT_POSITION_CONTAINED_BY) ===
              Node.DOCUMENT_POSITION_CONTAINED_BY
          )
            throw new Error(
              `Failed to sanitize html because the element is clobbered: ${n.outerHTML}`
            );
          return t;
        }
      }
      const LN = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        BN = /([^\#-~ |!])/g;
      function xv(e) {
        return e
          .replace(/&/g, "&amp;")
          .replace(LN, function (n) {
            return (
              "&#" +
              (1024 * (n.charCodeAt(0) - 55296) +
                (n.charCodeAt(1) - 56320) +
                65536) +
              ";"
            );
          })
          .replace(BN, function (n) {
            return "&#" + n.charCodeAt(0) + ";";
          })
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
      let bc;
      function Wf(e) {
        return "content" in e &&
          (function HN(e) {
            return (
              e.nodeType === Node.ELEMENT_NODE && "TEMPLATE" === e.nodeName
            );
          })(e)
          ? e.content
          : null;
      }
      var _t = (() => (
        ((_t = _t || {})[(_t.NONE = 0)] = "NONE"),
        (_t[(_t.HTML = 1)] = "HTML"),
        (_t[(_t.STYLE = 2)] = "STYLE"),
        (_t[(_t.SCRIPT = 3)] = "SCRIPT"),
        (_t[(_t.URL = 4)] = "URL"),
        (_t[(_t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        _t
      ))();
      function Pv(e) {
        const n = pa();
        return n
          ? Ev(n.sanitize(_t.HTML, e) || "")
          : fa(e, "HTML")
          ? Ev(ai(e))
          : (function VN(e, n) {
              let t = null;
              try {
                bc = bc || Nv(e);
                let r = n ? String(n) : "";
                t = bc.getInertBodyElement(r);
                let i = 5,
                  o = r;
                do {
                  if (0 === i)
                    throw new Error(
                      "Failed to sanitize html because the input is unstable"
                    );
                  i--,
                    (r = o),
                    (o = t.innerHTML),
                    (t = bc.getInertBodyElement(r));
                } while (r !== o);
                return Po(new FN().sanitizeChildren(Wf(t) || t));
              } finally {
                if (t) {
                  const r = Wf(t) || t;
                  for (; r.firstChild; ) r.removeChild(r.firstChild);
                }
              }
            })(wv(), ae(e));
      }
      function li(e) {
        const n = pa();
        return n
          ? n.sanitize(_t.URL, e) || ""
          : fa(e, "URL")
          ? ai(e)
          : Gf(ae(e));
      }
      function kv(e) {
        const n = pa();
        if (n) return Mv(n.sanitize(_t.RESOURCE_URL, e) || "");
        if (fa(e, "ResourceURL")) return Mv(ai(e));
        throw new B(904, !1);
      }
      function pa() {
        const e = x();
        return e && e[Yd];
      }
      const Dc = new z("ENVIRONMENT_INITIALIZER"),
        Lv = new z("INJECTOR", -1),
        Bv = new z("INJECTOR_DEF_TYPES");
      class Vv {
        get(n, t = zs) {
          if (t === zs) {
            const r = new Error(`NullInjectorError: No provider for ${$e(n)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return t;
        }
      }
      function qN(...e) {
        return { ɵproviders: Hv(0, e), ɵfromNgModule: !0 };
      }
      function Hv(e, ...n) {
        const t = [],
          r = new Set();
        let i;
        return (
          xi(n, (o) => {
            const s = o;
            qf(s, t, [], r) && (i || (i = []), i.push(s));
          }),
          void 0 !== i && Uv(i, t),
          t
        );
      }
      function Uv(e, n) {
        for (let t = 0; t < e.length; t++) {
          const { providers: i } = e[t];
          Kf(i, (o) => {
            n.push(o);
          });
        }
      }
      function qf(e, n, t, r) {
        if (!(e = X(e))) return !1;
        let i = null,
          o = zm(e);
        const s = !o && Ae(e);
        if (o || s) {
          if (s && !s.standalone) return !1;
          i = e;
        } else {
          const l = e.ngModule;
          if (((o = zm(l)), !o)) return !1;
          i = l;
        }
        const a = r.has(i);
        if (s) {
          if (a) return !1;
          if ((r.add(i), s.dependencies)) {
            const l =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const c of l) qf(c, n, t, r);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let c;
              r.add(i);
              try {
                xi(o.imports, (u) => {
                  qf(u, n, t, r) && (c || (c = []), c.push(u));
                });
              } finally {
              }
              void 0 !== c && Uv(c, n);
            }
            if (!a) {
              const c = Oi(i) || (() => new i());
              n.push(
                { provide: i, useFactory: c, deps: Se },
                { provide: Bv, useValue: i, multi: !0 },
                { provide: Dc, useValue: () => L(i), multi: !0 }
              );
            }
            const l = o.providers;
            null == l ||
              a ||
              Kf(l, (u) => {
                n.push(u);
              });
          }
        }
        return i !== e && void 0 !== e.providers;
      }
      function Kf(e, n) {
        for (let t of e)
          $d(t) && (t = t.ɵproviders), Array.isArray(t) ? Kf(t, n) : n(t);
      }
      const KN = He({ provide: String, useValue: He });
      function Yf(e) {
        return null !== e && "object" == typeof e && KN in e;
      }
      function ki(e) {
        return "function" == typeof e;
      }
      const Jf = new z("Set Injector scope."),
        Cc = {},
        JN = {};
      let Zf;
      function wc() {
        return void 0 === Zf && (Zf = new Vv()), Zf;
      }
      class Hn {}
      class jv extends Hn {
        get destroyed() {
          return this._destroyed;
        }
        constructor(n, t, r, i) {
          super(),
            (this.parent = t),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Xf(n, (s) => this.processProvider(s)),
            this.records.set(Lv, ko(void 0, this)),
            i.has("environment") && this.records.set(Hn, ko(void 0, this));
          const o = this.records.get(Jf);
          null != o && "string" == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(Bv.multi, Se, ee.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            for (const n of this._onDestroyHooks) n();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(n) {
          this._onDestroyHooks.push(n);
        }
        runInContext(n) {
          this.assertNotDestroyed();
          const t = _o(this),
            r = Ln(void 0);
          try {
            return n();
          } finally {
            _o(t), Ln(r);
          }
        }
        get(n, t = zs, r = ee.Default) {
          this.assertNotDestroyed(), (r = ql(r));
          const i = _o(this),
            o = Ln(void 0);
          try {
            if (!(r & ee.SkipSelf)) {
              let a = this.records.get(n);
              if (void 0 === a) {
                const l =
                  (function tI(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof z)
                    );
                  })(n) && jl(n);
                (a = l && this.injectableDefInScope(l) ? ko(Qf(n), Cc) : null),
                  this.records.set(n, a);
              }
              if (null != a) return this.hydrate(n, a);
            }
            return (r & ee.Self ? wc() : this.parent).get(
              n,
              (t = r & ee.Optional && t === zs ? null : t)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Wl] = s[Wl] || []).unshift($e(n)), i)) throw s;
              return (function TM(e, n, t, r) {
                const i = e[Wl];
                throw (
                  (n[Km] && i.unshift(n[Km]),
                  (e.message = (function NM(e, n, t, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && e.charAt(1) == EM
                        ? e.slice(2)
                        : e;
                    let i = $e(n);
                    if (Array.isArray(n)) i = n.map($e).join(" -> ");
                    else if ("object" == typeof n) {
                      let o = [];
                      for (let s in n)
                        if (n.hasOwnProperty(s)) {
                          let a = n[s];
                          o.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : $e(a))
                          );
                        }
                      i = `{${o.join(", ")}}`;
                    }
                    return `${t}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(
                      wM,
                      "\n  "
                    )}`;
                  })("\n" + e.message, i, t, r)),
                  (e[CM] = i),
                  (e[Wl] = null),
                  e)
                );
              })(s, n, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Ln(o), _o(i);
          }
        }
        resolveInjectorInitializers() {
          const n = _o(this),
            t = Ln(void 0);
          try {
            const r = this.get(Dc.multi, Se, ee.Self);
            for (const i of r) i();
          } finally {
            _o(n), Ln(t);
          }
        }
        toString() {
          const n = [],
            t = this.records;
          for (const r of t.keys()) n.push($e(r));
          return `R3Injector[${n.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new B(205, !1);
        }
        processProvider(n) {
          let t = ki((n = X(n))) ? n : X(n && n.provide);
          const r = (function QN(e) {
            return Yf(e) ? ko(void 0, e.useValue) : ko(zv(e), Cc);
          })(n);
          if (ki(n) || !0 !== n.multi) this.records.get(t);
          else {
            let i = this.records.get(t);
            i ||
              ((i = ko(void 0, Cc, !0)),
              (i.factory = () => Wd(i.multi)),
              this.records.set(t, i)),
              (t = n),
              i.multi.push(n);
          }
          this.records.set(t, r);
        }
        hydrate(n, t) {
          return (
            t.value === Cc && ((t.value = JN), (t.value = t.factory())),
            "object" == typeof t.value &&
              t.value &&
              (function eI(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(t.value) &&
              this._ngOnDestroyHooks.add(t.value),
            t.value
          );
        }
        injectableDefInScope(n) {
          if (!n.providedIn) return !1;
          const t = X(n.providedIn);
          return "string" == typeof t
            ? "any" === t || this.scopes.has(t)
            : this.injectorDefTypes.has(t);
        }
      }
      function Qf(e) {
        const n = jl(e),
          t = null !== n ? n.factory : Oi(e);
        if (null !== t) return t;
        if (e instanceof z) throw new B(204, !1);
        if (e instanceof Function)
          return (function ZN(e) {
            const n = e.length;
            if (n > 0) throw (ia(n, "?"), new B(204, !1));
            const t = (function yM(e) {
              return (e && (e[zl] || e[Wm])) || null;
            })(e);
            return null !== t ? () => t.factory(e) : () => new e();
          })(e);
        throw new B(204, !1);
      }
      function zv(e, n, t) {
        let r;
        if (ki(e)) {
          const i = X(e);
          return Oi(i) || Qf(i);
        }
        if (Yf(e)) r = () => X(e.useValue);
        else if (
          (function Gv(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...Wd(e.deps || []));
        else if (
          (function $v(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => L(X(e.useExisting));
        else {
          const i = X(e && (e.useClass || e.provide));
          if (
            !(function XN(e) {
              return !!e.deps;
            })(e)
          )
            return Oi(i) || Qf(i);
          r = () => new i(...Wd(e.deps));
        }
        return r;
      }
      function ko(e, n, t = !1) {
        return { factory: e, value: n, multi: t ? [] : void 0 };
      }
      function Xf(e, n) {
        for (const t of e)
          Array.isArray(t) ? Xf(t, n) : t && $d(t) ? Xf(t.ɵproviders, n) : n(t);
      }
      class nI {}
      class Wv {}
      class iI {
        resolveComponentFactory(n) {
          throw (function rI(e) {
            const n = Error(
              `No component factory found for ${$e(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (n.ngComponent = e), n;
          })(n);
        }
      }
      let ga = (() => {
        class e {}
        return (e.NULL = new iI()), e;
      })();
      function oI() {
        return Fo(Vt(), x());
      }
      function Fo(e, n) {
        return new De(En(e, n));
      }
      let De = (() => {
        class e {
          constructor(t) {
            this.nativeElement = t;
          }
        }
        return (e.__NG_ELEMENT_ID__ = oI), e;
      })();
      function sI(e) {
        return e instanceof De ? e.nativeElement : e;
      }
      class eh {}
      let pn = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function aI() {
                const e = x(),
                  t = dn(Vt().index, e);
                return (wn(t) ? t : e)[ge];
              })()),
            e
          );
        })(),
        lI = (() => {
          class e {}
          return (
            (e.ɵprov = F({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class ma {
        constructor(n) {
          (this.full = n),
            (this.major = n.split(".")[0]),
            (this.minor = n.split(".")[1]),
            (this.patch = n.split(".").slice(2).join("."));
        }
      }
      const cI = new ma("15.2.9"),
        th = {},
        nh = "ngOriginalError";
      function rh(e) {
        return e[nh];
      }
      class Lo {
        constructor() {
          this._console = console;
        }
        handleError(n) {
          const t = this._findOriginalError(n);
          this._console.error("ERROR", n),
            t && this._console.error("ORIGINAL ERROR", t);
        }
        _findOriginalError(n) {
          let t = n && rh(n);
          for (; t && rh(t); ) t = rh(t);
          return t || null;
        }
      }
      function Vr(e) {
        return e instanceof Function ? e() : e;
      }
      function Yv(e, n, t) {
        let r = e.length;
        for (;;) {
          const i = e.indexOf(n, t);
          if (-1 === i) return i;
          if (0 === i || e.charCodeAt(i - 1) <= 32) {
            const o = n.length;
            if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
          }
          t = i + 1;
        }
      }
      const Jv = "ng-template";
      function bI(e, n, t) {
        let r = 0,
          i = !0;
        for (; r < e.length; ) {
          let o = e[r++];
          if ("string" == typeof o && i) {
            const s = e[r++];
            if (t && "class" === o && -1 !== Yv(s.toLowerCase(), n, 0))
              return !0;
          } else {
            if (1 === o) {
              for (; r < e.length && "string" == typeof (o = e[r++]); )
                if (o.toLowerCase() === n) return !0;
              return !1;
            }
            "number" == typeof o && (i = !1);
          }
        }
        return !1;
      }
      function Zv(e) {
        return 4 === e.type && e.value !== Jv;
      }
      function DI(e, n, t) {
        return n === (4 !== e.type || t ? e.value : Jv);
      }
      function CI(e, n, t) {
        let r = 4;
        const i = e.attrs || [],
          o = (function SI(e) {
            for (let n = 0; n < e.length; n++) if (S_(e[n])) return n;
            return e.length;
          })(i);
        let s = !1;
        for (let a = 0; a < n.length; a++) {
          const l = n[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !DI(e, l, t)) || ("" === l && 1 === n.length))
                ) {
                  if (Qn(r)) return !1;
                  s = !0;
                }
              } else {
                const c = 8 & r ? l : n[++a];
                if (8 & r && null !== e.attrs) {
                  if (!bI(e.attrs, c, t)) {
                    if (Qn(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = wI(8 & r ? "class" : l, i, Zv(e), t);
                if (-1 === d) {
                  if (Qn(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== c) {
                  let f;
                  f = d > o ? "" : i[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Yv(h, c, 0)) || (2 & r && c !== f)) {
                    if (Qn(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Qn(r) && !Qn(l)) return !1;
            if (s && Qn(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return Qn(r) || s;
      }
      function Qn(e) {
        return 0 == (1 & e);
      }
      function wI(e, n, t, r) {
        if (null === n) return -1;
        let i = 0;
        if (r || !t) {
          let o = !1;
          for (; i < n.length; ) {
            const s = n[i];
            if (s === e) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = n[++i];
                for (; "string" == typeof a; ) a = n[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function MI(e, n) {
          let t = e.indexOf(4);
          if (t > -1)
            for (t++; t < e.length; ) {
              const r = e[t];
              if ("number" == typeof r) return -1;
              if (r === n) return t;
              t++;
            }
          return -1;
        })(n, e);
      }
      function Qv(e, n, t = !1) {
        for (let r = 0; r < n.length; r++) if (CI(e, n[r], t)) return !0;
        return !1;
      }
      function TI(e, n) {
        e: for (let t = 0; t < n.length; t++) {
          const r = n[t];
          if (e.length === r.length) {
            for (let i = 0; i < e.length; i++) if (e[i] !== r[i]) continue e;
            return !0;
          }
        }
        return !1;
      }
      function Xv(e, n) {
        return e ? ":not(" + n.trim() + ")" : n;
      }
      function NI(e) {
        let n = e[0],
          t = 1,
          r = 2,
          i = "",
          o = !1;
        for (; t < e.length; ) {
          let s = e[t];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++t];
              i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
          else
            "" !== i && !Qn(s) && ((n += Xv(o, i)), (i = "")),
              (r = s),
              (o = o || !Qn(r));
          t++;
        }
        return "" !== i && (n += Xv(o, i)), n;
      }
      const ce = {};
      function g(e) {
        ey(be(), x(), tn() + e, !1);
      }
      function ey(e, n, t, r) {
        if (!r)
          if (3 == (3 & n[he])) {
            const o = e.preOrderCheckHooks;
            null !== o && ic(n, o, t);
          } else {
            const o = e.preOrderHooks;
            null !== o && oc(n, o, 0, t);
          }
        Ai(t);
      }
      function iy(e, n = null, t = null, r) {
        const i = oy(e, n, t, r);
        return i.resolveInjectorInitializers(), i;
      }
      function oy(e, n = null, t = null, r, i = new Set()) {
        const o = [t || Se, qN(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : $e(e))),
          new jv(o, n || wc(), r || null, i)
        );
      }
      let gn = (() => {
        class e {
          static create(t, r) {
            if (Array.isArray(t)) return iy({ name: "" }, r, t, "");
            {
              const i = t.name ?? "";
              return iy({ name: i }, t.parent, t.providers, i);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = zs),
          (e.NULL = new Vv()),
          (e.ɵprov = F({ token: e, providedIn: "any", factory: () => L(Lv) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function _(e, n = ee.Default) {
        const t = x();
        return null === t ? L(e, n) : P_(Vt(), t, X(e), n);
      }
      function hy(e, n) {
        const t = e.contentQueries;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) {
            const o = t[r + 1];
            if (-1 !== o) {
              const s = e.data[o];
              sf(t[r]), s.contentQueries(2, n[o], o);
            }
          }
      }
      function Sc(e, n, t, r, i, o, s, a, l, c, u) {
        const d = n.blueprint.slice();
        return (
          (d[kr] = i),
          (d[he] = 76 | r),
          (null !== u || (e && 1024 & e[he])) && (d[he] |= 1024),
          d_(d),
          (d[it] = d[bo] = e),
          (d[dt] = t),
          (d[Zl] = s || (e && e[Zl])),
          (d[ge] = a || (e && e[ge])),
          (d[Yd] = l || (e && e[Yd]) || null),
          (d[Jl] = c || (e && e[Jl]) || null),
          (d[qt] = o),
          (d[Zs] = (function KT() {
            return qT++;
          })()),
          (d[t_] = u),
          (d[Kt] = 2 == n.type ? e[Kt] : d),
          d
        );
      }
      function Ho(e, n, t, r, i) {
        let o = e.data[n];
        if (null === o)
          (o = lh(e, n, t, r, i)),
            (function QM() {
              return le.lFrame.inI18n;
            })() && (o.flags |= 32);
        else if (64 & o.type) {
          (o.type = t), (o.value = r), (o.attrs = i);
          const s = Xs();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return gr(o, !0), o;
      }
      function lh(e, n, t, r, i) {
        const o = p_(),
          s = ef(),
          l = (e.data[n] = (function eO(e, n, t, r, i, o) {
            return {
              type: t,
              index: r,
              insertBeforeIndex: null,
              injectorIndex: n ? n.injectorIndex : -1,
              directiveStart: -1,
              directiveEnd: -1,
              directiveStylingLast: -1,
              componentOffset: -1,
              propertyBindings: null,
              flags: 0,
              providerIndexes: 0,
              value: i,
              attrs: o,
              mergedAttrs: null,
              localNames: null,
              initialInputs: void 0,
              inputs: null,
              outputs: null,
              tView: null,
              next: null,
              prev: null,
              projectionNext: null,
              child: null,
              parent: n,
              projection: null,
              styles: null,
              stylesWithoutHost: null,
              residualStyles: void 0,
              classes: null,
              classesWithoutHost: null,
              residualClasses: void 0,
              classBindings: 0,
              styleBindings: 0,
            };
          })(0, s ? o : o && o.parent, t, n, r, i));
        return (
          null === e.firstChild && (e.firstChild = l),
          null !== o &&
            (s
              ? null == o.child && null !== l.parent && (o.child = l)
              : null === o.next && ((o.next = l), (l.prev = o))),
          l
        );
      }
      function _a(e, n, t, r) {
        if (0 === t) return -1;
        const i = n.length;
        for (let o = 0; o < t; o++)
          n.push(r), e.blueprint.push(r), e.data.push(null);
        return i;
      }
      function ch(e, n, t) {
        af(n);
        try {
          const r = e.viewQuery;
          null !== r && vh(1, r, t);
          const i = e.template;
          null !== i && py(e, n, i, 1, t),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && hy(e, n),
            e.staticViewQueries && vh(2, e.viewQuery, t);
          const o = e.components;
          null !== o &&
            (function ZI(e, n) {
              for (let t = 0; t < n.length; t++) bO(e, n[t]);
            })(n, o);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (n[he] &= -5), lf();
        }
      }
      function Mc(e, n, t, r) {
        const i = n[he];
        if (128 != (128 & i)) {
          af(n);
          try {
            d_(n),
              (function m_(e) {
                return (le.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== t && py(e, n, t, 2, r);
            const s = 3 == (3 & i);
            if (s) {
              const c = e.preOrderCheckHooks;
              null !== c && ic(n, c, null);
            } else {
              const c = e.preOrderHooks;
              null !== c && oc(n, c, 0, null), cf(n, 0);
            }
            if (
              ((function vO(e) {
                for (let n = Of(e); null !== n; n = Af(n)) {
                  if (!n[n_]) continue;
                  const t = n[Co];
                  for (let r = 0; r < t.length; r++) {
                    const i = t[r];
                    512 & i[he] || Xd(i[it], 1), (i[he] |= 512);
                  }
                }
              })(n),
              (function _O(e) {
                for (let n = Of(e); null !== n; n = Af(n))
                  for (let t = Xt; t < n.length; t++) {
                    const r = n[t],
                      i = r[$];
                    nc(r) && Mc(i, r, i.template, r[dt]);
                  }
              })(n),
              null !== e.contentQueries && hy(e, n),
              s)
            ) {
              const c = e.contentCheckHooks;
              null !== c && ic(n, c);
            } else {
              const c = e.contentHooks;
              null !== c && oc(n, c, 1), cf(n, 1);
            }
            !(function YI(e, n) {
              const t = e.hostBindingOpCodes;
              if (null !== t)
                try {
                  for (let r = 0; r < t.length; r++) {
                    const i = t[r];
                    if (i < 0) Ai(~i);
                    else {
                      const o = i,
                        s = t[++r],
                        a = t[++r];
                      XM(s, o), a(2, n[o]);
                    }
                  }
                } finally {
                  Ai(-1);
                }
            })(e, n);
            const a = e.components;
            null !== a &&
              (function JI(e, n) {
                for (let t = 0; t < n.length; t++) yO(e, n[t]);
              })(n, a);
            const l = e.viewQuery;
            if ((null !== l && vh(2, l, r), s)) {
              const c = e.viewCheckHooks;
              null !== c && ic(n, c);
            } else {
              const c = e.viewHooks;
              null !== c && oc(n, c, 2), cf(n, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (n[he] &= -41),
              512 & n[he] && ((n[he] &= -513), Xd(n[it], -1));
          } finally {
            lf();
          }
        }
      }
      function py(e, n, t, r, i) {
        const o = tn(),
          s = 2 & r;
        try {
          Ai(-1),
            s && n.length > Ye && ey(e, n, Ye, !1),
            Bn(s ? 2 : 0, i),
            t(r, i);
        } finally {
          Ai(o), Bn(s ? 3 : 1, i);
        }
      }
      function uh(e, n, t) {
        if (Zd(n)) {
          const i = n.directiveEnd;
          for (let o = n.directiveStart; o < i; o++) {
            const s = e.data[o];
            s.contentQueries && s.contentQueries(1, t[o], o);
          }
        }
      }
      function dh(e, n, t) {
        h_() &&
          ((function aO(e, n, t, r) {
            const i = t.directiveStart,
              o = t.directiveEnd;
            Qs(t) &&
              (function pO(e, n, t) {
                const r = En(n, e),
                  i = gy(t),
                  o = e[Zl],
                  s = Tc(
                    e,
                    Sc(
                      e,
                      i,
                      null,
                      t.onPush ? 32 : 16,
                      r,
                      n,
                      o,
                      o.createRenderer(r, t),
                      null,
                      null,
                      null
                    )
                  );
                e[n.index] = s;
              })(n, t, e.data[i + t.componentOffset]),
              e.firstCreatePass || cc(t, n),
              Yt(r, n);
            const s = t.initialInputs;
            for (let a = i; a < o; a++) {
              const l = e.data[a],
                c = Ri(n, e, a, t);
              Yt(c, n),
                null !== s && gO(0, a - i, c, l, 0, s),
                Zn(l) && (dn(t.index, n)[dt] = Ri(n, e, a, t));
            }
          })(e, n, t, En(t, n)),
          64 == (64 & t.flags) && by(e, n, t));
      }
      function fh(e, n, t = En) {
        const r = n.localNames;
        if (null !== r) {
          let i = n.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? t(n, e) : e[s];
            e[i++] = a;
          }
        }
      }
      function gy(e) {
        const n = e.tView;
        return null === n || n.incompleteFirstPass
          ? (e.tView = hh(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : n;
      }
      function hh(e, n, t, r, i, o, s, a, l, c) {
        const u = Ye + r,
          d = u + i,
          f = (function QI(e, n) {
            const t = [];
            for (let r = 0; r < n; r++) t.push(r < e ? null : ce);
            return t;
          })(u, d),
          h = "function" == typeof c ? c() : c;
        return (f[$] = {
          type: e,
          blueprint: f,
          template: t,
          queries: null,
          viewQuery: a,
          declTNode: n,
          data: f.slice().fill(null, u),
          bindingStartIndex: u,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function my(e, n, t, r) {
        const i = Cy(n);
        null === t
          ? i.push(r)
          : (i.push(t), e.firstCreatePass && wy(e).push(r, i.length - 1));
      }
      function _y(e, n, t, r) {
        for (let i in e)
          if (e.hasOwnProperty(i)) {
            t = null === t ? {} : t;
            const o = e[i];
            null === r
              ? vy(t, n, i, o)
              : r.hasOwnProperty(i) && vy(t, n, r[i], o);
          }
        return t;
      }
      function vy(e, n, t, r) {
        e.hasOwnProperty(t) ? e[t].push(n, r) : (e[t] = [n, r]);
      }
      function Mn(e, n, t, r, i, o, s, a) {
        const l = En(n, t);
        let u,
          c = n.inputs;
        !a && null != c && (u = c[r])
          ? (yh(e, t, u, r, i),
            Qs(n) &&
              (function rO(e, n) {
                const t = dn(n, e);
                16 & t[he] || (t[he] |= 32);
              })(t, n.index))
          : 3 & n.type &&
            ((r = (function nO(e) {
              return "class" === e
                ? "className"
                : "for" === e
                ? "htmlFor"
                : "formaction" === e
                ? "formAction"
                : "innerHtml" === e
                ? "innerHTML"
                : "readonly" === e
                ? "readOnly"
                : "tabindex" === e
                ? "tabIndex"
                : e;
            })(r)),
            (i = null != s ? s(i, n.value || "", r) : i),
            o.setProperty(l, r, i));
      }
      function ph(e, n, t, r) {
        if (h_()) {
          const i = null === r ? null : { "": -1 },
            o = (function cO(e, n) {
              const t = e.directiveRegistry;
              let r = null,
                i = null;
              if (t)
                for (let o = 0; o < t.length; o++) {
                  const s = t[o];
                  if (Qv(n, s.selectors, !1))
                    if ((r || (r = []), Zn(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (i = i || new Map()),
                          s.findHostDirectiveDefs(s, a, i),
                          r.unshift(...a, s),
                          gh(e, n, a.length);
                      } else r.unshift(s), gh(e, n, 0);
                    else
                      (i = i || new Map()),
                        s.findHostDirectiveDefs?.(s, r, i),
                        r.push(s);
                }
              return null === r ? null : [r, i];
            })(e, t);
          let s, a;
          null === o ? (s = a = null) : ([s, a] = o),
            null !== s && yy(e, n, t, s, i, a),
            i &&
              (function uO(e, n, t) {
                if (n) {
                  const r = (e.localNames = []);
                  for (let i = 0; i < n.length; i += 2) {
                    const o = t[n[i + 1]];
                    if (null == o) throw new B(-301, !1);
                    r.push(n[i], o);
                  }
                }
              })(t, r, i);
        }
        t.mergedAttrs = ta(t.mergedAttrs, t.attrs);
      }
      function yy(e, n, t, r, i, o) {
        for (let c = 0; c < r.length; c++) gf(cc(t, n), e, r[c].type);
        !(function fO(e, n, t) {
          (e.flags |= 1),
            (e.directiveStart = n),
            (e.directiveEnd = n + t),
            (e.providerIndexes = n);
        })(t, e.data.length, r.length);
        for (let c = 0; c < r.length; c++) {
          const u = r[c];
          u.providersResolver && u.providersResolver(u);
        }
        let s = !1,
          a = !1,
          l = _a(e, n, r.length, null);
        for (let c = 0; c < r.length; c++) {
          const u = r[c];
          (t.mergedAttrs = ta(t.mergedAttrs, u.hostAttrs)),
            hO(e, t, n, l, u),
            dO(l, u, i),
            null !== u.contentQueries && (t.flags |= 4),
            (null !== u.hostBindings ||
              null !== u.hostAttrs ||
              0 !== u.hostVars) &&
              (t.flags |= 64);
          const d = u.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ?? (e.preOrderHooks = [])).push(t.index),
            (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ?? (e.preOrderCheckHooks = [])).push(
                t.index
              ),
              (a = !0)),
            l++;
        }
        !(function tO(e, n, t) {
          const i = n.directiveEnd,
            o = e.data,
            s = n.attrs,
            a = [];
          let l = null,
            c = null;
          for (let u = n.directiveStart; u < i; u++) {
            const d = o[u],
              f = t ? t.get(d) : null,
              y = f ? f.outputs : null;
            (l = _y(d.inputs, u, l, f ? f.inputs : null)),
              (c = _y(d.outputs, u, c, y));
            const b = null === l || null === s || Zv(n) ? null : mO(l, u, s);
            a.push(b);
          }
          null !== l &&
            (l.hasOwnProperty("class") && (n.flags |= 8),
            l.hasOwnProperty("style") && (n.flags |= 16)),
            (n.initialInputs = a),
            (n.inputs = l),
            (n.outputs = c);
        })(e, t, o);
      }
      function by(e, n, t) {
        const r = t.directiveStart,
          i = t.directiveEnd,
          o = t.index,
          s = (function eT() {
            return le.lFrame.currentDirectiveIndex;
          })();
        try {
          Ai(o);
          for (let a = r; a < i; a++) {
            const l = e.data[a],
              c = n[a];
            nf(a),
              (null !== l.hostBindings ||
                0 !== l.hostVars ||
                null !== l.hostAttrs) &&
                lO(l, c);
          }
        } finally {
          Ai(-1), nf(s);
        }
      }
      function lO(e, n) {
        null !== e.hostBindings && e.hostBindings(1, n);
      }
      function gh(e, n, t) {
        (n.componentOffset = t),
          (e.components ?? (e.components = [])).push(n.index);
      }
      function dO(e, n, t) {
        if (t) {
          if (n.exportAs)
            for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
          Zn(n) && (t[""] = e);
        }
      }
      function hO(e, n, t, r, i) {
        e.data[r] = i;
        const o = i.factory || (i.factory = Oi(i.type)),
          s = new ea(o, Zn(i), _);
        (e.blueprint[r] = s),
          (t[r] = s),
          (function oO(e, n, t, r, i) {
            const o = i.hostBindings;
            if (o) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~n.index;
              (function sO(e) {
                let n = e.length;
                for (; n > 0; ) {
                  const t = e[--n];
                  if ("number" == typeof t && t < 0) return t;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(t, r, o);
            }
          })(e, n, r, _a(e, t, i.hostVars, ce), i);
      }
      function mh(e, n, t, r, i, o, s) {
        if (null == o) e.removeAttribute(n, i, t);
        else {
          const a = null == s ? ae(o) : s(o, r || "", i);
          e.setAttribute(n, i, a, t);
        }
      }
      function gO(e, n, t, r, i, o) {
        const s = o[n];
        if (null !== s) {
          const a = r.setInput;
          for (let l = 0; l < s.length; ) {
            const c = s[l++],
              u = s[l++],
              d = s[l++];
            null !== a ? r.setInput(t, d, c, u) : (t[u] = d);
          }
        }
      }
      function mO(e, n, t) {
        let r = null,
          i = 0;
        for (; i < t.length; ) {
          const o = t[i];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              if (e.hasOwnProperty(o)) {
                null === r && (r = []);
                const s = e[o];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === n) {
                    r.push(o, s[a + 1], t[i + 1]);
                    break;
                  }
              }
              i += 2;
            } else i += 2;
          else i += 4;
        }
        return r;
      }
      function Dy(e, n, t, r) {
        return [e, !0, !1, n, null, 0, r, t, null, null];
      }
      function yO(e, n) {
        const t = dn(n, e);
        if (nc(t)) {
          const r = t[$];
          48 & t[he] ? Mc(r, t, r.template, t[dt]) : t[Ii] > 0 && _h(t);
        }
      }
      function _h(e) {
        for (let r = Of(e); null !== r; r = Af(r))
          for (let i = Xt; i < r.length; i++) {
            const o = r[i];
            if (nc(o))
              if (512 & o[he]) {
                const s = o[$];
                Mc(s, o, s.template, o[dt]);
              } else o[Ii] > 0 && _h(o);
          }
        const t = e[$].components;
        if (null !== t)
          for (let r = 0; r < t.length; r++) {
            const i = dn(t[r], e);
            nc(i) && i[Ii] > 0 && _h(i);
          }
      }
      function bO(e, n) {
        const t = dn(n, e),
          r = t[$];
        (function DO(e, n) {
          for (let t = n.length; t < e.blueprint.length; t++)
            n.push(e.blueprint[t]);
        })(r, t),
          ch(r, t, t[dt]);
      }
      function Tc(e, n) {
        return e[Ys] ? (e[e_][Yn] = n) : (e[Ys] = n), (e[e_] = n), n;
      }
      function Nc(e) {
        for (; e; ) {
          e[he] |= 32;
          const n = ua(e);
          if (PM(e) && !n) return e;
          e = n;
        }
        return null;
      }
      function Ic(e, n, t, r = !0) {
        const i = n[Zl];
        i.begin && i.begin();
        try {
          Mc(e, n, e.template, t);
        } catch (s) {
          throw (r && Sy(n, s), s);
        } finally {
          i.end && i.end();
        }
      }
      function vh(e, n, t) {
        sf(0), n(e, t);
      }
      function Cy(e) {
        return e[yo] || (e[yo] = []);
      }
      function wy(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function Sy(e, n) {
        const t = e[Jl],
          r = t ? t.get(Lo, null) : null;
        r && r.handleError(n);
      }
      function yh(e, n, t, r, i) {
        for (let o = 0; o < t.length; ) {
          const s = t[o++],
            a = t[o++],
            l = n[s],
            c = e.data[s];
          null !== c.setInput ? c.setInput(l, i, r, a) : (l[a] = i);
        }
      }
      function Hr(e, n, t) {
        const r = tc(n, e);
        lv(e[ge], r, t);
      }
      function Oc(e, n, t) {
        let r = t ? e.styles : null,
          i = t ? e.classes : null,
          o = 0;
        if (null !== n)
          for (let s = 0; s < n.length; s++) {
            const a = n[s];
            "number" == typeof a
              ? (o = a)
              : 1 == o
              ? (i = Hd(i, a))
              : 2 == o && (r = Hd(r, a + ": " + n[++s] + ";"));
          }
        t ? (e.styles = r) : (e.stylesWithoutHost = r),
          t ? (e.classes = i) : (e.classesWithoutHost = i);
      }
      function Ac(e, n, t, r, i = !1) {
        for (; null !== t; ) {
          const o = n[t.index];
          if ((null !== o && r.push(Bt(o)), Jn(o)))
            for (let a = Xt; a < o.length; a++) {
              const l = o[a],
                c = l[$].firstChild;
              null !== c && Ac(l[$], l, c, r);
            }
          const s = t.type;
          if (8 & s) Ac(e, n, t.child, r);
          else if (32 & s) {
            const a = If(t, n);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = yv(n, t);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = ua(n[Kt]);
              Ac(l[$], l, a, r, !0);
            }
          }
          t = i ? t.projectionNext : t.next;
        }
        return r;
      }
      class va {
        get rootNodes() {
          const n = this._lView,
            t = n[$];
          return Ac(t, n, t.firstChild, []);
        }
        constructor(n, t) {
          (this._lView = n),
            (this._cdRefInjectingView = t),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[dt];
        }
        set context(n) {
          this._lView[dt] = n;
        }
        get destroyed() {
          return 128 == (128 & this._lView[he]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const n = this._lView[it];
            if (Jn(n)) {
              const t = n[Xl],
                r = t ? t.indexOf(this) : -1;
              r > -1 && (Pf(n, r), dc(t, r));
            }
            this._attachedToViewContainer = !1;
          }
          uv(this._lView[$], this._lView);
        }
        onDestroy(n) {
          my(this._lView[$], this._lView, null, n);
        }
        markForCheck() {
          Nc(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[he] &= -65;
        }
        reattach() {
          this._lView[he] |= 64;
        }
        detectChanges() {
          Ic(this._lView[$], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new B(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function cN(e, n) {
              da(e, n, n[ge], 2, null, null);
            })(this._lView[$], this._lView);
        }
        attachToAppRef(n) {
          if (this._attachedToViewContainer) throw new B(902, !1);
          this._appRef = n;
        }
      }
      class CO extends va {
        constructor(n) {
          super(n), (this._view = n);
        }
        detectChanges() {
          const n = this._view;
          Ic(n[$], n, n[dt], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class My extends ga {
        constructor(n) {
          super(), (this.ngModule = n);
        }
        resolveComponentFactory(n) {
          const t = Ae(n);
          return new ya(t, this.ngModule);
        }
      }
      function Ty(e) {
        const n = [];
        for (let t in e)
          e.hasOwnProperty(t) && n.push({ propName: e[t], templateName: t });
        return n;
      }
      class EO {
        constructor(n, t) {
          (this.injector = n), (this.parentInjector = t);
        }
        get(n, t, r) {
          r = ql(r);
          const i = this.injector.get(n, th, r);
          return i !== th || t === th ? i : this.parentInjector.get(n, t, r);
        }
      }
      class ya extends Wv {
        get inputs() {
          return Ty(this.componentDef.inputs);
        }
        get outputs() {
          return Ty(this.componentDef.outputs);
        }
        constructor(n, t) {
          super(),
            (this.componentDef = n),
            (this.ngModule = t),
            (this.componentType = n.type),
            (this.selector = (function II(e) {
              return e.map(NI).join(",");
            })(n.selectors)),
            (this.ngContentSelectors = n.ngContentSelectors
              ? n.ngContentSelectors
              : []),
            (this.isBoundToModule = !!t);
        }
        create(n, t, r, i) {
          let o = (i = i || this.ngModule) instanceof Hn ? i : i?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new EO(n, o) : n,
            a = s.get(eh, null);
          if (null === a) throw new B(407, !1);
          const l = s.get(lI, null),
            c = a.createRenderer(null, this.componentDef),
            u = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function XI(e, n, t) {
                  return e.selectRootElement(n, t === hr.ShadowDom);
                })(c, r, this.componentDef.encapsulation)
              : xf(
                  c,
                  u,
                  (function wO(e) {
                    const n = e.toLowerCase();
                    return "svg" === n ? "svg" : "math" === n ? "math" : null;
                  })(u)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = hh(0, null, null, 1, 0, null, null, null, null, null),
            y = Sc(null, h, null, f, null, null, a, c, l, s, null);
          let b, w;
          af(y);
          try {
            const S = this.componentDef;
            let O,
              T = null;
            S.findHostDirectiveDefs
              ? ((O = []),
                (T = new Map()),
                S.findHostDirectiveDefs(S, O, T),
                O.push(S))
              : (O = [S]);
            const k = (function MO(e, n) {
                const t = e[$],
                  r = Ye;
                return (e[r] = n), Ho(t, r, 2, "#host", null);
              })(y, d),
              j = (function TO(e, n, t, r, i, o, s, a) {
                const l = i[$];
                !(function NO(e, n, t, r) {
                  for (const i of e)
                    n.mergedAttrs = ta(n.mergedAttrs, i.hostAttrs);
                  null !== n.mergedAttrs &&
                    (Oc(n, n.mergedAttrs, !0), null !== t && Cv(r, t, n));
                })(r, e, n, s);
                const c = o.createRenderer(n, t),
                  u = Sc(
                    i,
                    gy(t),
                    null,
                    t.onPush ? 32 : 16,
                    i[e.index],
                    e,
                    o,
                    c,
                    a || null,
                    null,
                    null
                  );
                return (
                  l.firstCreatePass && gh(l, e, r.length - 1),
                  Tc(i, u),
                  (i[e.index] = u)
                );
              })(k, d, S, O, y, a, c);
            (w = u_(h, Ye)),
              d &&
                (function OO(e, n, t, r) {
                  if (r) df(e, t, ["ng-version", cI.full]);
                  else {
                    const { attrs: i, classes: o } = (function OI(e) {
                      const n = [],
                        t = [];
                      let r = 1,
                        i = 2;
                      for (; r < e.length; ) {
                        let o = e[r];
                        if ("string" == typeof o)
                          2 === i
                            ? "" !== o && n.push(o, e[++r])
                            : 8 === i && t.push(o);
                        else {
                          if (!Qn(i)) break;
                          i = o;
                        }
                        r++;
                      }
                      return { attrs: n, classes: t };
                    })(n.selectors[0]);
                    i && df(e, t, i),
                      o && o.length > 0 && Dv(e, t, o.join(" "));
                  }
                })(c, S, d, r),
              void 0 !== t &&
                (function AO(e, n, t) {
                  const r = (e.projection = []);
                  for (let i = 0; i < n.length; i++) {
                    const o = t[i];
                    r.push(null != o ? Array.from(o) : null);
                  }
                })(w, this.ngContentSelectors, t),
              (b = (function IO(e, n, t, r, i, o) {
                const s = Vt(),
                  a = i[$],
                  l = En(s, i);
                yy(a, i, s, t, null, r);
                for (let u = 0; u < t.length; u++)
                  Yt(Ri(i, a, s.directiveStart + u, s), i);
                by(a, i, s), l && Yt(l, i);
                const c = Ri(i, a, s.directiveStart + s.componentOffset, s);
                if (((e[dt] = i[dt] = c), null !== o))
                  for (const u of o) u(c, n);
                return uh(a, s, e), c;
              })(j, S, O, T, y, [RO])),
              ch(h, y, null);
          } finally {
            lf();
          }
          return new SO(this.componentType, b, Fo(w, y), y, w);
        }
      }
      class SO extends nI {
        constructor(n, t, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.instance = t),
            (this.hostView = this.changeDetectorRef = new CO(i)),
            (this.componentType = n);
        }
        setInput(n, t) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[n])) {
            const o = this._rootLView;
            yh(o[$], o, i, n, t), Nc(dn(this._tNode.index, o));
          }
        }
        get injector() {
          return new Mo(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(n) {
          this.hostView.onDestroy(n);
        }
      }
      function RO() {
        const e = Vt();
        rc(x()[$], e);
      }
      function Re(e) {
        let n = (function Ny(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          t = !0;
        const r = [e];
        for (; n; ) {
          let i;
          if (Zn(e)) i = n.ɵcmp || n.ɵdir;
          else {
            if (n.ɵcmp) throw new B(903, !1);
            i = n.ɵdir;
          }
          if (i) {
            if (t) {
              r.push(i);
              const s = e;
              (s.inputs = bh(e.inputs)),
                (s.declaredInputs = bh(e.declaredInputs)),
                (s.outputs = bh(e.outputs));
              const a = i.hostBindings;
              a && FO(e, a);
              const l = i.viewQuery,
                c = i.contentQueries;
              if (
                (l && PO(e, l),
                c && kO(e, c),
                Vd(e.inputs, i.inputs),
                Vd(e.declaredInputs, i.declaredInputs),
                Vd(e.outputs, i.outputs),
                Zn(i) && i.data.animation)
              ) {
                const u = e.data;
                u.animation = (u.animation || []).concat(i.data.animation);
              }
            }
            const o = i.features;
            if (o)
              for (let s = 0; s < o.length; s++) {
                const a = o[s];
                a && a.ngInherit && a(e), a === Re && (t = !1);
              }
          }
          n = Object.getPrototypeOf(n);
        }
        !(function xO(e) {
          let n = 0,
            t = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const i = e[r];
            (i.hostVars = n += i.hostVars),
              (i.hostAttrs = ta(i.hostAttrs, (t = ta(t, i.hostAttrs))));
          }
        })(r);
      }
      function bh(e) {
        return e === xr ? {} : e === Se ? [] : e;
      }
      function PO(e, n) {
        const t = e.viewQuery;
        e.viewQuery = t
          ? (r, i) => {
              n(r, i), t(r, i);
            }
          : n;
      }
      function kO(e, n) {
        const t = e.contentQueries;
        e.contentQueries = t
          ? (r, i, o) => {
              n(r, i, o), t(r, i, o);
            }
          : n;
      }
      function FO(e, n) {
        const t = e.hostBindings;
        e.hostBindings = t
          ? (r, i) => {
              n(r, i), t(r, i);
            }
          : n;
      }
      function Rc(e) {
        return (
          !!(function Dh(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function vr(e, n, t) {
        return (e[n] = t);
      }
      function Jt(e, n, t) {
        return !Object.is(e[n], t) && ((e[n] = t), !0);
      }
      function Fi(e, n, t, r) {
        const i = Jt(e, n, t);
        return Jt(e, n + 1, r) || i;
      }
      function ve(e, n, t, r) {
        const i = x();
        return (
          Jt(i, Eo(), n) &&
            (be(),
            (function _r(e, n, t, r, i, o) {
              const s = En(e, n);
              mh(n[ge], s, o, e.value, t, r, i);
            })(tt(), i, e, n, t, r)),
          ve
        );
      }
      function $o(e, n, t, r) {
        return Jt(e, Eo(), t) ? n + ae(t) + r : ce;
      }
      function Go(e, n, t, r, i, o) {
        const a = Fi(e, Fr(), t, i);
        return Lr(2), a ? n + ae(t) + r + ae(i) + o : ce;
      }
      function C(e, n, t, r, i, o, s, a) {
        const l = x(),
          c = be(),
          u = e + Ye,
          d = c.firstCreatePass
            ? (function zO(e, n, t, r, i, o, s, a, l) {
                const c = n.consts,
                  u = Ho(n, e, 4, s || null, oi(c, a));
                ph(n, t, u, oi(c, l)), rc(n, u);
                const d = (u.tView = hh(
                  2,
                  u,
                  r,
                  i,
                  o,
                  n.directiveRegistry,
                  n.pipeRegistry,
                  null,
                  n.schemas,
                  c
                ));
                return (
                  null !== n.queries &&
                    (n.queries.template(n, u),
                    (d.queries = n.queries.embeddedTView(u))),
                  u
                );
              })(u, c, l, n, t, r, i, o, s)
            : c.data[u];
        gr(d, !1);
        const f = l[ge].createComment("");
        mc(c, l, f, d),
          Yt(f, l),
          Tc(l, (l[u] = Dy(f, l, f, d))),
          ec(d) && dh(c, l, d),
          null != s && fh(l, d, a);
      }
      function mn(e) {
        return wo(
          (function ZM() {
            return le.lFrame.contextLView;
          })(),
          Ye + e
        );
      }
      function v(e, n, t) {
        const r = x();
        return Jt(r, Eo(), n) && Mn(be(), tt(), r, e, n, r[ge], t, !1), v;
      }
      function Ch(e, n, t, r, i) {
        const s = i ? "class" : "style";
        yh(e, t, n.inputs[s], s, r);
      }
      function p(e, n, t, r) {
        const i = x(),
          o = be(),
          s = Ye + e,
          a = i[ge],
          l = o.firstCreatePass
            ? (function qO(e, n, t, r, i, o) {
                const s = n.consts,
                  l = Ho(n, e, 2, r, oi(s, i));
                return (
                  ph(n, t, l, oi(s, o)),
                  null !== l.attrs && Oc(l, l.attrs, !1),
                  null !== l.mergedAttrs && Oc(l, l.mergedAttrs, !0),
                  null !== n.queries && n.queries.elementStart(n, l),
                  l
                );
              })(s, o, i, n, t, r)
            : o.data[s],
          c = (i[s] = xf(
            a,
            n,
            (function lT() {
              return le.lFrame.currentNamespace;
            })()
          )),
          u = ec(l);
        return (
          gr(l, !0),
          Cv(a, c, l),
          32 != (32 & l.flags) && mc(o, i, c, l),
          0 ===
            (function WM() {
              return le.lFrame.elementDepthCount;
            })() && Yt(c, i),
          (function qM() {
            le.lFrame.elementDepthCount++;
          })(),
          u && (dh(o, i, l), uh(o, l, i)),
          null !== r && fh(i, l),
          p
        );
      }
      function m() {
        let e = Vt();
        ef() ? tf() : ((e = e.parent), gr(e, !1));
        const n = e;
        !(function KM() {
          le.lFrame.elementDepthCount--;
        })();
        const t = be();
        return (
          t.firstCreatePass && (rc(t, e), Zd(e) && t.queries.elementEnd(e)),
          null != n.classesWithoutHost &&
            (function fT(e) {
              return 0 != (8 & e.flags);
            })(n) &&
            Ch(t, n, x(), n.classesWithoutHost, !0),
          null != n.stylesWithoutHost &&
            (function hT(e) {
              return 0 != (16 & e.flags);
            })(n) &&
            Ch(t, n, x(), n.stylesWithoutHost, !1),
          m
        );
      }
      function A(e, n, t, r) {
        return p(e, n, t, r), m(), A;
      }
      function re(e, n, t) {
        const r = x(),
          i = be(),
          o = e + Ye,
          s = i.firstCreatePass
            ? (function KO(e, n, t, r, i) {
                const o = n.consts,
                  s = oi(o, r),
                  a = Ho(n, e, 8, "ng-container", s);
                return (
                  null !== s && Oc(a, s, !0),
                  ph(n, t, a, oi(o, i)),
                  null !== n.queries && n.queries.elementStart(n, a),
                  a
                );
              })(o, i, r, n, t)
            : i.data[o];
        gr(s, !0);
        const a = (r[o] = r[ge].createComment(""));
        return (
          mc(i, r, a, s),
          Yt(a, r),
          ec(s) && (dh(i, r, s), uh(i, s, r)),
          null != t && fh(r, s),
          re
        );
      }
      function ie() {
        let e = Vt();
        const n = be();
        return (
          ef() ? tf() : ((e = e.parent), gr(e, !1)),
          n.firstCreatePass && (rc(n, e), Zd(e) && n.queries.elementEnd(e)),
          ie
        );
      }
      function fe() {
        return x();
      }
      function Ca(e) {
        return !!e && "function" == typeof e.then;
      }
      const wh = function $y(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function P(e, n, t, r) {
        const i = x(),
          o = be(),
          s = Vt();
        return (
          (function jy(e, n, t, r, i, o, s) {
            const a = ec(r),
              c = e.firstCreatePass && wy(e),
              u = n[dt],
              d = Cy(n);
            let f = !0;
            if (3 & r.type || s) {
              const b = En(r, n),
                w = s ? s(b) : b,
                S = d.length,
                O = s ? (k) => s(Bt(k[r.index])) : r.index;
              let T = null;
              if (
                (!s &&
                  a &&
                  (T = (function YO(e, n, t, r) {
                    const i = e.cleanup;
                    if (null != i)
                      for (let o = 0; o < i.length - 1; o += 2) {
                        const s = i[o];
                        if (s === t && i[o + 1] === r) {
                          const a = n[yo],
                            l = i[o + 2];
                          return a.length > l ? a[l] : null;
                        }
                        "string" == typeof s && (o += 2);
                      }
                    return null;
                  })(e, n, i, r.index)),
                null !== T)
              )
                ((T.__ngLastListenerFn__ || T).__ngNextListenerFn__ = o),
                  (T.__ngLastListenerFn__ = o),
                  (f = !1);
              else {
                o = Wy(r, n, u, o, !1);
                const k = t.listen(w, i, o);
                d.push(o, k), c && c.push(i, O, S, S + 1);
              }
            } else o = Wy(r, n, u, o, !1);
            const h = r.outputs;
            let y;
            if (f && null !== h && (y = h[i])) {
              const b = y.length;
              if (b)
                for (let w = 0; w < b; w += 2) {
                  const j = n[y[w]][y[w + 1]].subscribe(o),
                    J = d.length;
                  d.push(o, j), c && c.push(i, r.index, J, -(J + 1));
                }
            }
          })(o, i, i[ge], s, e, n, r),
          P
        );
      }
      function zy(e, n, t, r) {
        try {
          return Bn(6, n, t), !1 !== t(r);
        } catch (i) {
          return Sy(e, i), !1;
        } finally {
          Bn(7, n, t);
        }
      }
      function Wy(e, n, t, r, i) {
        return function o(s) {
          if (s === Function) return r;
          Nc(e.componentOffset > -1 ? dn(e.index, n) : n);
          let l = zy(n, t, r, s),
            c = o.__ngNextListenerFn__;
          for (; c; ) (l = zy(n, t, c, s) && l), (c = c.__ngNextListenerFn__);
          return i && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function M(e = 1) {
        return (function nT(e) {
          return (le.lFrame.contextLView = (function rT(e, n) {
            for (; e > 0; ) (n = n[bo]), e--;
            return n;
          })(e, le.lFrame.contextLView))[dt];
        })(e);
      }
      function JO(e, n) {
        let t = null;
        const r = (function EI(e) {
          const n = e.attrs;
          if (null != n) {
            const t = n.indexOf(5);
            if (!(1 & t)) return n[t + 1];
          }
          return null;
        })(e);
        for (let i = 0; i < n.length; i++) {
          const o = n[i];
          if ("*" !== o) {
            if (null === r ? Qv(e, o, !0) : TI(r, o)) return i;
          } else t = i;
        }
        return t;
      }
      function wa(e) {
        const n = x()[Kt][qt];
        if (!n.projection) {
          const r = (n.projection = ia(e ? e.length : 1, null)),
            i = r.slice();
          let o = n.child;
          for (; null !== o; ) {
            const s = e ? JO(o, e) : 0;
            null !== s &&
              (i[s] ? (i[s].projectionNext = o) : (r[s] = o), (i[s] = o)),
              (o = o.next);
          }
        }
      }
      function Ea(e, n = 0, t) {
        const r = x(),
          i = be(),
          o = Ho(i, Ye + e, 16, null, t || null);
        null === o.projection && (o.projection = n),
          tf(),
          32 != (32 & o.flags) &&
            (function _N(e, n, t) {
              bv(n[ge], 0, n, t, dv(e, t, n), gv(t.parent || n[qt], t, n));
            })(i, r, o);
      }
      function Ur(e, n, t) {
        return Pc(e, "", n, "", t), Ur;
      }
      function Pc(e, n, t, r, i) {
        const o = x(),
          s = $o(o, n, t, r);
        return s !== ce && Mn(be(), tt(), o, e, s, o[ge], i, !1), Pc;
      }
      function kc(e, n) {
        return (e << 17) | (n << 2);
      }
      function ci(e) {
        return (e >> 17) & 32767;
      }
      function Eh(e) {
        return 2 | e;
      }
      function Li(e) {
        return (131068 & e) >> 2;
      }
      function Sh(e, n) {
        return (-131069 & e) | (n << 2);
      }
      function Mh(e) {
        return 1 | e;
      }
      function t1(e, n, t, r, i) {
        const o = e[t + 1],
          s = null === n;
        let a = r ? ci(o) : Li(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const u = e[a + 1];
          nA(e[a], n) && ((l = !0), (e[a + 1] = r ? Mh(u) : Eh(u))),
            (a = r ? ci(u) : Li(u));
        }
        l && (e[t + 1] = r ? Eh(o) : Mh(o));
      }
      function nA(e, n) {
        return (
          null === e ||
          null == n ||
          (Array.isArray(e) ? e[1] : e) === n ||
          (!(!Array.isArray(e) || "string" != typeof n) && Ao(e, n) >= 0)
        );
      }
      const Tt = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function n1(e) {
        return e.substring(Tt.key, Tt.keyEnd);
      }
      function r1(e, n) {
        const t = Tt.textEnd;
        return t === n
          ? -1
          : ((n = Tt.keyEnd =
              (function sA(e, n, t) {
                for (; n < t && e.charCodeAt(n) > 32; ) n++;
                return n;
              })(e, (Tt.key = n), t)),
            Jo(e, n, t));
      }
      function Jo(e, n, t) {
        for (; n < t && e.charCodeAt(n) <= 32; ) n++;
        return n;
      }
      function Zo(e, n, t) {
        return Xn(e, n, t, !1), Zo;
      }
      function te(e, n) {
        return Xn(e, n, null, !0), te;
      }
      function ui(e) {
        er(gA, br, e, !0);
      }
      function br(e, n) {
        for (
          let t = (function iA(e) {
            return (
              (function o1(e) {
                (Tt.key = 0),
                  (Tt.keyEnd = 0),
                  (Tt.value = 0),
                  (Tt.valueEnd = 0),
                  (Tt.textEnd = e.length);
              })(e),
              r1(e, Jo(e, 0, Tt.textEnd))
            );
          })(n);
          t >= 0;
          t = r1(n, t)
        )
          Sn(e, n1(n), !0);
      }
      function Xn(e, n, t, r) {
        const i = x(),
          o = be(),
          s = Lr(2);
        o.firstUpdatePass && c1(o, e, s, r),
          n !== ce &&
            Jt(i, s, n) &&
            d1(
              o,
              o.data[tn()],
              i,
              i[ge],
              e,
              (i[s + 1] = (function _A(e, n) {
                return (
                  null == e ||
                    "" === e ||
                    ("string" == typeof n
                      ? (e += n)
                      : "object" == typeof e && (e = $e(ai(e)))),
                  e
                );
              })(n, t)),
              r,
              s
            );
      }
      function er(e, n, t, r) {
        const i = be(),
          o = Lr(2);
        i.firstUpdatePass && c1(i, null, o, r);
        const s = x();
        if (t !== ce && Jt(s, o, t)) {
          const a = i.data[tn()];
          if (h1(a, r) && !l1(i, o)) {
            let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
            null !== l && (t = Hd(l, t || "")), Ch(i, a, s, t, r);
          } else
            !(function mA(e, n, t, r, i, o, s, a) {
              i === ce && (i = Se);
              let l = 0,
                c = 0,
                u = 0 < i.length ? i[0] : null,
                d = 0 < o.length ? o[0] : null;
              for (; null !== u || null !== d; ) {
                const f = l < i.length ? i[l + 1] : void 0,
                  h = c < o.length ? o[c + 1] : void 0;
                let b,
                  y = null;
                u === d
                  ? ((l += 2), (c += 2), f !== h && ((y = d), (b = h)))
                  : null === d || (null !== u && u < d)
                  ? ((l += 2), (y = u))
                  : ((c += 2), (y = d), (b = h)),
                  null !== y && d1(e, n, t, r, y, b, s, a),
                  (u = l < i.length ? i[l] : null),
                  (d = c < o.length ? o[c] : null);
              }
            })(
              i,
              a,
              s,
              s[ge],
              s[o + 1],
              (s[o + 1] = (function pA(e, n, t) {
                if (null == t || "" === t) return Se;
                const r = [],
                  i = ai(t);
                if (Array.isArray(i))
                  for (let o = 0; o < i.length; o++) e(r, i[o], !0);
                else if ("object" == typeof i)
                  for (const o in i) i.hasOwnProperty(o) && e(r, o, i[o]);
                else "string" == typeof i && n(r, i);
                return r;
              })(e, n, t)),
              r,
              o
            );
        }
      }
      function l1(e, n) {
        return n >= e.expandoStartIndex;
      }
      function c1(e, n, t, r) {
        const i = e.data;
        if (null === i[t + 1]) {
          const o = i[tn()],
            s = l1(e, t);
          h1(o, r) && null === n && !s && (n = !1),
            (n = (function uA(e, n, t, r) {
              const i = (function rf(e) {
                const n = le.lFrame.currentDirectiveIndex;
                return -1 === n ? null : e[n];
              })(e);
              let o = r ? n.residualClasses : n.residualStyles;
              if (null === i)
                0 === (r ? n.classBindings : n.styleBindings) &&
                  ((t = Sa((t = Th(null, e, n, t, r)), n.attrs, r)),
                  (o = null));
              else {
                const s = n.directiveStylingLast;
                if (-1 === s || e[s] !== i)
                  if (((t = Th(i, e, n, t, r)), null === o)) {
                    let l = (function dA(e, n, t) {
                      const r = t ? n.classBindings : n.styleBindings;
                      if (0 !== Li(r)) return e[ci(r)];
                    })(e, n, r);
                    void 0 !== l &&
                      Array.isArray(l) &&
                      ((l = Th(null, e, n, l[1], r)),
                      (l = Sa(l, n.attrs, r)),
                      (function fA(e, n, t, r) {
                        e[ci(t ? n.classBindings : n.styleBindings)] = r;
                      })(e, n, r, l));
                  } else
                    o = (function hA(e, n, t) {
                      let r;
                      const i = n.directiveEnd;
                      for (let o = 1 + n.directiveStylingLast; o < i; o++)
                        r = Sa(r, e[o].hostAttrs, t);
                      return Sa(r, n.attrs, t);
                    })(e, n, r);
              }
              return (
                void 0 !== o &&
                  (r ? (n.residualClasses = o) : (n.residualStyles = o)),
                t
              );
            })(i, o, n, r)),
            (function eA(e, n, t, r, i, o) {
              let s = o ? n.classBindings : n.styleBindings,
                a = ci(s),
                l = Li(s);
              e[r] = t;
              let u,
                c = !1;
              if (
                (Array.isArray(t)
                  ? ((u = t[1]), (null === u || Ao(t, u) > 0) && (c = !0))
                  : (u = t),
                i)
              )
                if (0 !== l) {
                  const f = ci(e[a + 1]);
                  (e[r + 1] = kc(f, a)),
                    0 !== f && (e[f + 1] = Sh(e[f + 1], r)),
                    (e[a + 1] = (function QO(e, n) {
                      return (131071 & e) | (n << 17);
                    })(e[a + 1], r));
                } else
                  (e[r + 1] = kc(a, 0)),
                    0 !== a && (e[a + 1] = Sh(e[a + 1], r)),
                    (a = r);
              else
                (e[r + 1] = kc(l, 0)),
                  0 === a ? (a = r) : (e[l + 1] = Sh(e[l + 1], r)),
                  (l = r);
              c && (e[r + 1] = Eh(e[r + 1])),
                t1(e, u, r, !0),
                t1(e, u, r, !1),
                (function tA(e, n, t, r, i) {
                  const o = i ? e.residualClasses : e.residualStyles;
                  null != o &&
                    "string" == typeof n &&
                    Ao(o, n) >= 0 &&
                    (t[r + 1] = Mh(t[r + 1]));
                })(n, u, e, r, o),
                (s = kc(a, l)),
                o ? (n.classBindings = s) : (n.styleBindings = s);
            })(i, o, n, t, s, r);
        }
      }
      function Th(e, n, t, r, i) {
        let o = null;
        const s = t.directiveEnd;
        let a = t.directiveStylingLast;
        for (
          -1 === a ? (a = t.directiveStart) : a++;
          a < s && ((o = n[a]), (r = Sa(r, o.hostAttrs, i)), o !== e);

        )
          a++;
        return null !== e && (t.directiveStylingLast = a), r;
      }
      function Sa(e, n, t) {
        const r = t ? 1 : 2;
        let i = -1;
        if (null !== n)
          for (let o = 0; o < n.length; o++) {
            const s = n[o];
            "number" == typeof s
              ? (i = s)
              : i === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                Sn(e, s, !!t || n[++o]));
          }
        return void 0 === e ? null : e;
      }
      function gA(e, n, t) {
        const r = String(n);
        "" !== r && !r.includes(" ") && Sn(e, r, t);
      }
      function d1(e, n, t, r, i, o, s, a) {
        if (!(3 & n.type)) return;
        const l = e.data,
          c = l[a + 1],
          u = (function XO(e) {
            return 1 == (1 & e);
          })(c)
            ? f1(l, n, t, i, Li(c), s)
            : void 0;
        Fc(u) ||
          (Fc(o) ||
            ((function ZO(e) {
              return 2 == (2 & e);
            })(c) &&
              (o = f1(l, null, t, i, a, s))),
          (function yN(e, n, t, r, i) {
            if (n) i ? e.addClass(t, r) : e.removeClass(t, r);
            else {
              let o = -1 === r.indexOf("-") ? void 0 : fn.DashCase;
              null == i
                ? e.removeStyle(t, r, o)
                : ("string" == typeof i &&
                    i.endsWith("!important") &&
                    ((i = i.slice(0, -10)), (o |= fn.Important)),
                  e.setStyle(t, r, i, o));
            }
          })(r, s, tc(tn(), t), i, o));
      }
      function f1(e, n, t, r, i, o) {
        const s = null === n;
        let a;
        for (; i > 0; ) {
          const l = e[i],
            c = Array.isArray(l),
            u = c ? l[1] : l,
            d = null === u;
          let f = t[i + 1];
          f === ce && (f = d ? Se : void 0);
          let h = d ? yf(f, r) : u === r ? f : void 0;
          if ((c && !Fc(h) && (h = yf(l, r)), Fc(h) && ((a = h), s))) return a;
          const y = e[i + 1];
          i = s ? ci(y) : Li(y);
        }
        if (null !== n) {
          let l = o ? n.residualClasses : n.residualStyles;
          null != l && (a = yf(l, r));
        }
        return a;
      }
      function Fc(e) {
        return void 0 !== e;
      }
      function h1(e, n) {
        return 0 != (e.flags & (n ? 8 : 16));
      }
      function N(e, n = "") {
        const t = x(),
          r = be(),
          i = e + Ye,
          o = r.firstCreatePass ? Ho(r, i, 1, n, null) : r.data[i],
          s = (t[i] = Rf(t[ge], n));
        mc(r, t, s, o), gr(o, !1);
      }
      function Ue(e) {
        return Je("", e, ""), Ue;
      }
      function Je(e, n, t) {
        const r = x(),
          i = $o(r, e, n, t);
        return i !== ce && Hr(r, tn(), i), Je;
      }
      function $r(e, n, t, r, i) {
        const o = x(),
          s = Go(o, e, n, t, r, i);
        return s !== ce && Hr(o, tn(), s), $r;
      }
      function Tn(e, n, t) {
        const r = x();
        return Jt(r, Eo(), n) && Mn(be(), tt(), r, e, n, r[ge], t, !0), Tn;
      }
      const Bi = void 0;
      var kA = [
        "en",
        [["a", "p"], ["AM", "PM"], Bi],
        [["AM", "PM"], Bi, Bi],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        Bi,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        Bi,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", Bi, "{1} 'at' {0}", Bi],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function PA(e) {
          const t = Math.floor(Math.abs(e)),
            r = e.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === t && 0 === r ? 1 : 5;
        },
      ];
      let Qo = {};
      function nn(e) {
        const n = (function FA(e) {
          return e.toLowerCase().replace(/_/g, "-");
        })(e);
        let t = P1(n);
        if (t) return t;
        const r = n.split("-")[0];
        if (((t = P1(r)), t)) return t;
        if ("en" === r) return kA;
        throw new B(701, !1);
      }
      function P1(e) {
        return (
          e in Qo ||
            (Qo[e] =
              Ke.ng &&
              Ke.ng.common &&
              Ke.ng.common.locales &&
              Ke.ng.common.locales[e]),
          Qo[e]
        );
      }
      var U = (() => (
        ((U = U || {})[(U.LocaleId = 0)] = "LocaleId"),
        (U[(U.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
        (U[(U.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
        (U[(U.DaysFormat = 3)] = "DaysFormat"),
        (U[(U.DaysStandalone = 4)] = "DaysStandalone"),
        (U[(U.MonthsFormat = 5)] = "MonthsFormat"),
        (U[(U.MonthsStandalone = 6)] = "MonthsStandalone"),
        (U[(U.Eras = 7)] = "Eras"),
        (U[(U.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
        (U[(U.WeekendRange = 9)] = "WeekendRange"),
        (U[(U.DateFormat = 10)] = "DateFormat"),
        (U[(U.TimeFormat = 11)] = "TimeFormat"),
        (U[(U.DateTimeFormat = 12)] = "DateTimeFormat"),
        (U[(U.NumberSymbols = 13)] = "NumberSymbols"),
        (U[(U.NumberFormats = 14)] = "NumberFormats"),
        (U[(U.CurrencyCode = 15)] = "CurrencyCode"),
        (U[(U.CurrencySymbol = 16)] = "CurrencySymbol"),
        (U[(U.CurrencyName = 17)] = "CurrencyName"),
        (U[(U.Currencies = 18)] = "Currencies"),
        (U[(U.Directionality = 19)] = "Directionality"),
        (U[(U.PluralCase = 20)] = "PluralCase"),
        (U[(U.ExtraData = 21)] = "ExtraData"),
        U
      ))();
      const LA = ["zero", "one", "two", "few", "many"],
        Xo = "en-US",
        Lc = { marker: "element" },
        Bc = { marker: "ICU" };
      var at = (() => (
        ((at = at || {})[(at.SHIFT = 2)] = "SHIFT"),
        (at[(at.APPEND_EAGERLY = 1)] = "APPEND_EAGERLY"),
        (at[(at.COMMENT = 2)] = "COMMENT"),
        at
      ))();
      let k1 = Xo;
      function F1(e) {
        (function Fn(e, n) {
          null == e && Ne(n, e, null, "!=");
        })(e, "Expected localeId to be defined"),
          "string" == typeof e && (k1 = e.toLowerCase().replace(/_/g, "-"));
      }
      function L1(e, n, t) {
        const r = n.insertBeforeIndex,
          i = Array.isArray(r) ? r[0] : r;
        return null === i ? mv(e, 0, t) : Bt(t[i]);
      }
      function B1(e, n, t, r, i) {
        const o = n.insertBeforeIndex;
        if (Array.isArray(o)) {
          let s = r,
            a = null;
          if (
            (3 & n.type || ((a = s), (s = i)),
            null !== s && -1 === n.componentOffset)
          )
            for (let l = 1; l < o.length; l++) Pi(e, s, t[o[l]], a, !1);
        }
      }
      function V1(e, n) {
        if ((e.push(n), e.length > 1))
          for (let t = e.length - 2; t >= 0; t--) {
            const r = e[t];
            H1(r) || (UA(r, n) && null === $A(r) && GA(r, n.index));
          }
      }
      function H1(e) {
        return !(64 & e.type);
      }
      function UA(e, n) {
        return H1(n) || e.index > n.index;
      }
      function $A(e) {
        const n = e.insertBeforeIndex;
        return Array.isArray(n) ? n[0] : n;
      }
      function GA(e, n) {
        const t = e.insertBeforeIndex;
        Array.isArray(t) ? (t[0] = n) : (vv(L1, B1), (e.insertBeforeIndex = n));
      }
      function Ma(e, n) {
        const t = e.data[n];
        return null === t || "string" == typeof t
          ? null
          : t.hasOwnProperty("currentCaseLViewIndex")
          ? t
          : t.value;
      }
      function WA(e, n, t) {
        const r = lh(e, t, 64, null, null);
        return V1(n, r), r;
      }
      function Vc(e, n) {
        const t = n[e.currentCaseLViewIndex];
        return null === t ? t : t < 0 ? ~t : t;
      }
      function U1(e) {
        return e >>> 17;
      }
      function $1(e) {
        return (131070 & e) >>> 1;
      }
      let Ta = 0,
        Na = 0;
      function j1(e, n, t, r) {
        const i = t[ge];
        let s,
          o = null;
        for (let a = 0; a < n.length; a++) {
          const l = n[a];
          if ("string" == typeof l) {
            const c = n[++a];
            null === t[c] && (t[c] = Rf(i, l));
          } else if ("number" == typeof l)
            switch (1 & l) {
              case 0:
                const c = U1(l);
                let u, d;
                if (
                  (null === o && ((o = c), (s = gc(i, r))),
                  c === o ? ((u = r), (d = s)) : ((u = null), (d = Bt(t[c]))),
                  null !== d)
                ) {
                  const b = $1(l);
                  Pi(i, d, t[b], u, !1);
                  const S = Ma(e, b);
                  if (null !== S && "object" == typeof S) {
                    const O = Vc(S, t);
                    null !== O && j1(e, S.create[O], t, t[S.anchorIdx]);
                  }
                }
                break;
              case 1:
                const h = n[++a],
                  y = n[++a];
                mh(i, tc(l >>> 1, t), null, null, h, y, null);
            }
          else
            switch (l) {
              case Bc:
                const c = n[++a],
                  u = n[++a];
                null === t[u] && Yt((t[u] = sN(i, c)), t);
                break;
              case Lc:
                const d = n[++a],
                  f = n[++a];
                null === t[f] && Yt((t[f] = xf(i, d, null)), t);
            }
        }
      }
      function z1(e, n, t, r, i) {
        for (let o = 0; o < t.length; o++) {
          const s = t[o],
            a = t[++o];
          if (s & i) {
            let l = "";
            for (let c = o + 1; c <= o + a; c++) {
              const u = t[c];
              if ("string" == typeof u) l += u;
              else if ("number" == typeof u)
                if (u < 0) l += ae(n[r - u]);
                else {
                  const d = u >>> 2;
                  switch (3 & u) {
                    case 1:
                      const f = t[++c],
                        h = t[++c],
                        y = e.data[d];
                      "string" == typeof y
                        ? mh(n[ge], n[d], null, y, f, l, h)
                        : Mn(e, y, n, f, l, n[ge], h, !1);
                      break;
                    case 0:
                      const b = n[d];
                      null !== b && lv(n[ge], b, l);
                      break;
                    case 2:
                      ZA(e, Ma(e, d), n, l);
                      break;
                    case 3:
                      W1(e, Ma(e, d), r, n);
                  }
                }
            }
          } else {
            const l = t[o + 1];
            if (l > 0 && 3 == (3 & l)) {
              const u = Ma(e, l >>> 2);
              n[u.currentCaseLViewIndex] < 0 && W1(e, u, r, n);
            }
          }
          o += a;
        }
      }
      function W1(e, n, t, r) {
        let i = r[n.currentCaseLViewIndex];
        if (null !== i) {
          let o = Ta;
          i < 0 && ((i = r[n.currentCaseLViewIndex] = ~i), (o = -1)),
            z1(e, r, n.update[i], t, o);
        }
      }
      function ZA(e, n, t, r) {
        const i = (function QA(e, n) {
          let t = e.cases.indexOf(n);
          if (-1 === t)
            switch (e.type) {
              case 1: {
                const r = (function BA(e, n) {
                  const t = (function x1(e) {
                      return nn(e)[U.PluralCase];
                    })(n)(parseInt(e, 10)),
                    r = LA[t];
                  return void 0 !== r ? r : "other";
                })(
                  n,
                  (function HA() {
                    return k1;
                  })()
                );
                (t = e.cases.indexOf(r)),
                  -1 === t && "other" !== r && (t = e.cases.indexOf("other"));
                break;
              }
              case 0:
                t = e.cases.indexOf("other");
            }
          return -1 === t ? null : t;
        })(n, r);
        if (
          Vc(n, t) !== i &&
          (q1(e, n, t),
          (t[n.currentCaseLViewIndex] = null === i ? null : ~i),
          null !== i)
        ) {
          const s = t[n.anchorIdx];
          s && j1(e, n.create[i], t, s);
        }
      }
      function q1(e, n, t) {
        let r = Vc(n, t);
        if (null !== r) {
          const i = n.remove[r];
          for (let o = 0; o < i.length; o++) {
            const s = i[o];
            if (s > 0) {
              const a = tc(s, t);
              null !== a && Bf(t[ge], a);
            } else q1(e, Ma(e, ~s), t);
          }
        }
      }
      function XA() {
        const e = [];
        let t,
          r,
          n = -1;
        function o(a, l) {
          n = 0;
          const c = Vc(a, l);
          r = null !== c ? a.remove[c] : Se;
        }
        function s() {
          if (n < r.length) {
            const a = r[n++];
            return a > 0 ? t[a] : (e.push(n, r), o(t[$].data[~a], t), s());
          }
          return 0 === e.length ? null : ((r = e.pop()), (n = e.pop()), s());
        }
        return function i(a, l) {
          for (t = l; e.length; ) e.pop();
          return o(a.value, l), s;
        };
      }
      const Hc = /\ufffd(\d+):?\d*\ufffd/gi,
        tR = /\ufffd(\d+)\ufffd/,
        Y1 = /^\s*(\ufffd\d+:?\d*\ufffd)\s*,\s*(select|plural)\s*,/,
        Ia = "\ufffd",
        nR = /\ufffd\/?\*(\d+:\d+)\ufffd/gi,
        rR = /\ufffd(\/?[#*]\d+):?\d*\ufffd/gi,
        iR = /\uE500/g;
      function J1(e, n, t, r, i, o, s) {
        const a = _a(e, r, 1, null);
        let l = a << at.SHIFT,
          c = Xs();
        n === c && (c = null),
          null === c && (l |= at.APPEND_EAGERLY),
          s &&
            ((l |= at.COMMENT),
            (function rN(e) {
              void 0 === Nf && (Nf = e());
            })(XA)),
          i.push(l, null === o ? "" : o);
        const u = lh(e, a, s ? 32 : 1, null === o ? "" : o, null);
        V1(t, u);
        const d = u.index;
        return (
          gr(u, !1),
          null !== c &&
            n !== c &&
            (function zA(e, n) {
              let t = e.insertBeforeIndex;
              null === t
                ? (vv(L1, B1), (t = e.insertBeforeIndex = [null, n]))
                : ((function ii(e, n, t) {
                    e != n && Ne(t, e, n, "==");
                  })(Array.isArray(t), !0, "Expecting array here"),
                  t.push(n));
            })(c, d),
          u
        );
      }
      function aR(e, n, t, r, i, o, s) {
        const a = s.match(Hc),
          l = J1(e, n, t, o, r, a ? null : s, !1);
        a && Oa(i, s, l.index, null, 0, null);
      }
      function Oa(e, n, t, r, i, o) {
        const s = e.length,
          a = s + 1;
        e.push(null, null);
        const l = s + 2,
          c = n.split(Hc);
        let u = 0;
        for (let d = 0; d < c.length; d++) {
          const f = c[d];
          if (1 & d) {
            const h = i + parseInt(f, 10);
            e.push(-1 - h), (u |= Z1(h));
          } else "" !== f && e.push(f);
        }
        return (
          e.push((t << 2) | (r ? 1 : 0)),
          r && e.push(r, o),
          (e[s] = u),
          (e[a] = e.length - l),
          u
        );
      }
      function Z1(e) {
        return 1 << Math.min(e, 31);
      }
      function Q1(e) {
        let n,
          o,
          t = "",
          r = 0,
          i = !1;
        for (; null !== (n = nR.exec(e)); )
          i
            ? n[0] === `${Ia}/*${o}${Ia}` && ((r = n.index), (i = !1))
            : ((t += e.substring(r, n.index + n[0].length)),
              (o = n[1]),
              (i = !0));
        return (t += e.slice(r)), t;
      }
      function X1(e, n, t, r, i, o) {
        let s = 0;
        const a = {
          type: i.type,
          currentCaseLViewIndex: _a(e, n, 1, null),
          anchorIdx: o,
          cases: [],
          create: [],
          remove: [],
          update: [],
        };
        (function gR(e, n, t) {
          e.push(Z1(n.mainBinding), 2, -1 - n.mainBinding, (t << 2) | 2);
        })(t, i, o),
          (function jA(e, n, t) {
            const r = e.data[n];
            null === r ? (e.data[n] = t) : (r.value = t);
          })(e, o, a);
        const l = i.values;
        for (let c = 0; c < l.length; c++) {
          const u = l[c],
            d = [];
          for (let f = 0; f < u.length; f++) {
            const h = u[f];
            if ("string" != typeof h) {
              const y = d.push(h) - 1;
              u[f] = `\x3c!--\ufffd${y}\ufffd--\x3e`;
            }
          }
          s = hR(e, a, n, t, r, i.cases[c], u.join(""), d) | s;
        }
        s &&
          (function mR(e, n, t) {
            e.push(n, 1, (t << 2) | 3);
          })(t, s, o);
      }
      function fR(e) {
        const n = [],
          t = [];
        let r = 1,
          i = 0;
        const o = Nh(
          (e = e.replace(Y1, function (s, a, l) {
            return (
              (r = "select" === l ? 0 : 1), (i = parseInt(a.slice(1), 10)), ""
            );
          }))
        );
        for (let s = 0; s < o.length; ) {
          let a = o[s++].trim();
          1 === r && (a = a.replace(/\s*(?:=)?(\w+)\s*/, "$1")),
            a.length && n.push(a);
          const l = Nh(o[s++]);
          n.length > t.length && t.push(l);
        }
        return { type: r, mainBinding: i, cases: n, values: t };
      }
      function Nh(e) {
        if (!e) return [];
        let n = 0;
        const t = [],
          r = [],
          i = /[{}]/g;
        let o;
        for (i.lastIndex = 0; (o = i.exec(e)); ) {
          const a = o.index;
          if ("}" == o[0]) {
            if ((t.pop(), 0 == t.length)) {
              const l = e.substring(n, a);
              Y1.test(l) ? r.push(fR(l)) : r.push(l), (n = a + 1);
            }
          } else {
            if (0 == t.length) {
              const l = e.substring(n, a);
              r.push(l), (n = a + 1);
            }
            t.push("{");
          }
        }
        const s = e.substring(n);
        return r.push(s), r;
      }
      function hR(e, n, t, r, i, o, s, a) {
        const l = [],
          c = [],
          u = [];
        n.cases.push(o), n.create.push(l), n.remove.push(c), n.update.push(u);
        const f = Nv(wv()).getInertBodyElement(s),
          h = Wf(f) || f;
        return h ? eb(e, n, t, r, l, c, u, h, i, a, 0) : 0;
      }
      function eb(e, n, t, r, i, o, s, a, l, c, u) {
        let d = 0,
          f = a.firstChild;
        for (; f; ) {
          const h = _a(e, t, 1, null);
          switch (f.nodeType) {
            case Node.ELEMENT_NODE:
              const y = f,
                b = y.tagName.toLowerCase();
              if (jf.hasOwnProperty(b)) {
                Ih(i, Lc, b, l, h), (e.data[h] = b);
                const T = y.attributes;
                for (let k = 0; k < T.length; k++) {
                  const j = T.item(k),
                    J = j.name.toLowerCase();
                  j.value.match(Hc)
                    ? Rv.hasOwnProperty(J) &&
                      Oa(s, j.value, h, j.name, 0, zf[J] ? Gf : null)
                    : _R(i, h, j);
                }
                (d = eb(e, n, t, r, i, o, s, f, h, c, u + 1) | d), tb(o, h, u);
              }
              break;
            case Node.TEXT_NODE:
              const w = f.textContent || "",
                S = w.match(Hc);
              Ih(i, null, S ? "" : w, l, h),
                tb(o, h, u),
                S && (d = Oa(s, w, h, null, 0, null) | d);
              break;
            case Node.COMMENT_NODE:
              const O = tR.exec(f.textContent || "");
              if (O) {
                const k = c[parseInt(O[1], 10)];
                Ih(i, Bc, "", l, h), X1(e, t, r, l, k, h), pR(o, h, u);
              }
          }
          f = f.nextSibling;
        }
        return d;
      }
      function tb(e, n, t) {
        0 === t && e.push(n);
      }
      function pR(e, n, t) {
        0 === t && (e.push(~n), e.push(n));
      }
      function Ih(e, n, t, r, i) {
        null !== n && e.push(n),
          e.push(
            t,
            i,
            (function qA(e, n, t) {
              return e | (n << 17) | (t << 1);
            })(0, r, i)
          );
      }
      function _R(e, n, t) {
        e.push((n << 1) | 1, t.name, t.value);
      }
      function rb(e, n, t = -1) {
        const r = be(),
          i = x(),
          o = Ye + e,
          s = oi(r.consts, n),
          a = Xs();
        r.firstCreatePass &&
          (function sR(e, n, t, r, i, o) {
            const s = Xs(),
              a = [],
              l = [],
              c = [[]];
            i = (function dR(e, n) {
              if (
                (function uR(e) {
                  return -1 === e;
                })(n)
              )
                return Q1(e);
              {
                const t = e.indexOf(`:${n}${Ia}`) + 2 + n.toString().length,
                  r = e.search(new RegExp(`${Ia}\\/\\*\\d+:${n}${Ia}`));
                return Q1(e.substring(t, r));
              }
            })(i, o);
            const u = (function oR(e) {
              return e.replace(iR, " ");
            })(i).split(rR);
            for (let d = 0; d < u.length; d++) {
              let f = u[d];
              if (1 & d) {
                const h = 47 === f.charCodeAt(0),
                  b =
                    (f.charCodeAt(h ? 1 : 0),
                    Ye + Number.parseInt(f.substring(h ? 2 : 1)));
                if (h) c.shift(), gr(Xs(), !1);
                else {
                  const w = WA(e, c[0], b);
                  c.unshift([]), gr(w, !0);
                }
              } else {
                const h = Nh(f);
                for (let y = 0; y < h.length; y++) {
                  let b = h[y];
                  if (1 & y) {
                    const w = b;
                    if ("object" != typeof w)
                      throw new Error(
                        `Unable to parse ICU expression in "${i}" message.`
                      );
                    X1(e, t, l, n, w, J1(e, s, c[0], t, a, "", !0).index);
                  } else "" !== b && aR(e, s, c[0], a, l, t, b);
                }
              }
            }
            e.data[r] = { create: a, update: l };
          })(r, null === a ? 0 : a.index, i, o, s, t);
        const l = r.data[o],
          u = fv(r, a === i[qt] ? null : a, i);
        (function JA(e, n, t, r) {
          const i = e[ge];
          for (let o = 0; o < n.length; o++) {
            const s = n[o++],
              a = n[o],
              c = (s & at.APPEND_EAGERLY) === at.APPEND_EAGERLY,
              u = s >>> at.SHIFT;
            let d = e[u];
            null === d &&
              (d = e[u] =
                (s & at.COMMENT) === at.COMMENT
                  ? i.createComment(a)
                  : Rf(i, a)),
              c && null !== t && Pi(i, t, d, r, !1);
          }
        })(i, l.create, u, a && 8 & a.type ? i[a.index] : null),
          __(!0);
      }
      function Ht(e, n, t) {
        rb(e, n, t),
          (function ib() {
            __(!1);
          })();
      }
      function es(e) {
        return (
          (function KA(e) {
            e && (Ta |= 1 << Math.min(Na, 31)), Na++;
          })(Jt(x(), Eo(), e)),
          es
        );
      }
      function Aa(e) {
        !(function YA(e, n, t) {
          if (Na > 0) {
            const r = e.data[t];
            z1(e, n, Array.isArray(r) ? r : r.update, Fr() - Na - 1, Ta);
          }
          (Ta = 0), (Na = 0);
        })(be(), x(), e + Ye);
      }
      function Oh(e, n, t, r, i) {
        if (((e = X(e)), Array.isArray(e)))
          for (let o = 0; o < e.length; o++) Oh(e[o], n, t, r, i);
        else {
          const o = be(),
            s = x();
          let a = ki(e) ? e : X(e.provide),
            l = zv(e);
          const c = Vt(),
            u = 1048575 & c.providerIndexes,
            d = c.directiveStart,
            f = c.providerIndexes >> 20;
          if (ki(e) || !e.multi) {
            const h = new ea(l, i, _),
              y = Rh(a, n, i ? u : u + f, d);
            -1 === y
              ? (gf(cc(c, s), o, a),
                Ah(o, e, n.length),
                n.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                i && (c.providerIndexes += 1048576),
                t.push(h),
                s.push(h))
              : ((t[y] = h), (s[y] = h));
          } else {
            const h = Rh(a, n, u + f, d),
              y = Rh(a, n, u, u + f),
              w = y >= 0 && t[y];
            if ((i && !w) || (!i && !(h >= 0 && t[h]))) {
              gf(cc(c, s), o, a);
              const S = (function AR(e, n, t, r, i) {
                const o = new ea(e, t, _);
                return (
                  (o.multi = []),
                  (o.index = n),
                  (o.componentProviders = 0),
                  ob(o, i, r && !t),
                  o
                );
              })(i ? OR : IR, t.length, i, r, l);
              !i && w && (t[y].providerFactory = S),
                Ah(o, e, n.length, 0),
                n.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                i && (c.providerIndexes += 1048576),
                t.push(S),
                s.push(S);
            } else Ah(o, e, h > -1 ? h : y, ob(t[i ? y : h], l, !i && r));
            !i && r && w && t[y].componentProviders++;
          }
        }
      }
      function Ah(e, n, t, r) {
        const i = ki(n),
          o = (function YN(e) {
            return !!e.useClass;
          })(n);
        if (i || o) {
          const l = (o ? X(n.useClass) : n).prototype.ngOnDestroy;
          if (l) {
            const c = e.destroyHooks || (e.destroyHooks = []);
            if (!i && n.multi) {
              const u = c.indexOf(t);
              -1 === u ? c.push(t, [r, l]) : c[u + 1].push(r, l);
            } else c.push(t, l);
          }
        }
      }
      function ob(e, n, t) {
        return t && e.componentProviders++, e.multi.push(n) - 1;
      }
      function Rh(e, n, t, r) {
        for (let i = t; i < r; i++) if (n[i] === e) return i;
        return -1;
      }
      function IR(e, n, t, r) {
        return xh(this.multi, []);
      }
      function OR(e, n, t, r) {
        const i = this.multi;
        let o;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = Ri(t, t[$], this.providerFactory.index, r);
          (o = a.slice(0, s)), xh(i, o);
          for (let l = s; l < a.length; l++) o.push(a[l]);
        } else (o = []), xh(i, o);
        return o;
      }
      function xh(e, n) {
        for (let t = 0; t < e.length; t++) n.push((0, e[t])());
        return n;
      }
      function Fe(e, n = []) {
        return (t) => {
          t.providersResolver = (r, i) =>
            (function NR(e, n, t) {
              const r = be();
              if (r.firstCreatePass) {
                const i = Zn(e);
                Oh(t, r.data, r.blueprint, i, !0),
                  Oh(n, r.data, r.blueprint, i, !1);
              }
            })(r, i ? i(e) : e, n);
        };
      }
      class ts {}
      class sb {}
      class ab extends ts {
        constructor(n, t) {
          super(),
            (this._parent = t),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new My(this));
          const r = Cn(n);
          (this._bootstrapComponents = Vr(r.bootstrap)),
            (this._r3Injector = oy(
              n,
              t,
              [
                { provide: ts, useValue: this },
                { provide: ga, useValue: this.componentFactoryResolver },
              ],
              $e(n),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(n));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const n = this._r3Injector;
          !n.destroyed && n.destroy(),
            this.destroyCbs.forEach((t) => t()),
            (this.destroyCbs = null);
        }
        onDestroy(n) {
          this.destroyCbs.push(n);
        }
      }
      class Ph extends sb {
        constructor(n) {
          super(), (this.moduleType = n);
        }
        create(n) {
          return new ab(this.moduleType, n);
        }
      }
      class xR extends ts {
        constructor(n, t, r) {
          super(),
            (this.componentFactoryResolver = new My(this)),
            (this.instance = null);
          const i = new jv(
            [
              ...n,
              { provide: ts, useValue: this },
              { provide: ga, useValue: this.componentFactoryResolver },
            ],
            t || wc(),
            r,
            new Set(["environment"])
          );
          (this.injector = i), i.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(n) {
          this.injector.onDestroy(n);
        }
      }
      function Uc(e, n, t = null) {
        return new xR(e, n, t).injector;
      }
      let PR = (() => {
        class e {
          constructor(t) {
            (this._injector = t), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(t) {
            if (!t.standalone) return null;
            if (!this.cachedInjectors.has(t.id)) {
              const r = Hv(0, t.type),
                i =
                  r.length > 0
                    ? Uc([r], this._injector, `Standalone[${t.type.name}]`)
                    : null;
              this.cachedInjectors.set(t.id, i);
            }
            return this.cachedInjectors.get(t.id);
          }
          ngOnDestroy() {
            try {
              for (const t of this.cachedInjectors.values())
                null !== t && t.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (e.ɵprov = F({
            token: e,
            providedIn: "environment",
            factory: () => new e(L(Hn)),
          })),
          e
        );
      })();
      function Nt(e) {
        e.getStandaloneInjector = (n) =>
          n.get(PR).getOrCreateStandaloneInjector(e);
      }
      function xe(e, n, t) {
        const r = en() + e,
          i = x();
        return i[r] === ce
          ? vr(i, r, t ? n.call(t) : n())
          : (function Da(e, n) {
              return e[n];
            })(i, r);
      }
      function Ut(e, n, t, r) {
        return pb(x(), en(), e, n, t, r);
      }
      function Ra(e, n, t, r, i) {
        return gb(x(), en(), e, n, t, r, i);
      }
      function Fh(e, n, t, r, i, o) {
        return mb(x(), en(), e, n, t, r, i, o);
      }
      function xa(e, n) {
        const t = e[n];
        return t === ce ? void 0 : t;
      }
      function pb(e, n, t, r, i, o) {
        const s = n + t;
        return Jt(e, s, i)
          ? vr(e, s + 1, o ? r.call(o, i) : r(i))
          : xa(e, s + 1);
      }
      function gb(e, n, t, r, i, o, s) {
        const a = n + t;
        return Fi(e, a, i, o)
          ? vr(e, a + 2, s ? r.call(s, i, o) : r(i, o))
          : xa(e, a + 2);
      }
      function mb(e, n, t, r, i, o, s, a) {
        const l = n + t;
        return (function xc(e, n, t, r, i) {
          const o = Fi(e, n, t, r);
          return Jt(e, n + 2, i) || o;
        })(e, l, i, o, s)
          ? vr(e, l + 3, a ? r.call(a, i, o, s) : r(i, o, s))
          : xa(e, l + 3);
      }
      function tr(e, n) {
        const t = be();
        let r;
        const i = e + Ye;
        t.firstCreatePass
          ? ((r = (function YR(e, n) {
              if (n)
                for (let t = n.length - 1; t >= 0; t--) {
                  const r = n[t];
                  if (e === r.name) return r;
                }
            })(n, t.pipeRegistry)),
            (t.data[i] = r),
            r.onDestroy &&
              (t.destroyHooks ?? (t.destroyHooks = [])).push(i, r.onDestroy))
          : (r = t.data[i]);
        const o = r.factory || (r.factory = Oi(r.type)),
          s = Ln(_);
        try {
          const a = lc(!1),
            l = o();
          return (
            lc(a),
            (function WO(e, n, t, r) {
              t >= e.data.length &&
                ((e.data[t] = null), (e.blueprint[t] = null)),
                (n[t] = r);
            })(t, x(), i, l),
            l
          );
        } finally {
          Ln(s);
        }
      }
      function Lh(e, n, t, r) {
        const i = e + Ye,
          o = x(),
          s = wo(o, i);
        return Pa(o, i)
          ? gb(o, en(), n, s.transform, t, r, s)
          : s.transform(t, r);
      }
      function di(e, n, t, r, i) {
        const o = e + Ye,
          s = x(),
          a = wo(s, o);
        return Pa(s, o)
          ? mb(s, en(), n, a.transform, t, r, i, a)
          : a.transform(t, r, i);
      }
      function Pa(e, n) {
        return e[$].data[n].pure;
      }
      function Bh(e) {
        return (n) => {
          setTimeout(e, void 0, n);
        };
      }
      const W = class QR extends Pe {
        constructor(n = !1) {
          super(), (this.__isAsync = n);
        }
        emit(n) {
          super.next(n);
        }
        subscribe(n, t, r) {
          let i = n,
            o = t || (() => null),
            s = r;
          if (n && "object" == typeof n) {
            const l = n;
            (i = l.next?.bind(l)),
              (o = l.error?.bind(l)),
              (s = l.complete?.bind(l));
          }
          this.__isAsync && ((o = Bh(o)), i && (i = Bh(i)), s && (s = Bh(s)));
          const a = super.subscribe({ next: i, error: o, complete: s });
          return n instanceof gt && n.add(a), a;
        }
      };
      function XR() {
        return this._results[Symbol.iterator]();
      }
      class Vh {
        get changes() {
          return this._changes || (this._changes = new W());
        }
        constructor(n = !1) {
          (this._emitDistinctChangesOnly = n),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const t = Vh.prototype;
          t[Symbol.iterator] || (t[Symbol.iterator] = XR);
        }
        get(n) {
          return this._results[n];
        }
        map(n) {
          return this._results.map(n);
        }
        filter(n) {
          return this._results.filter(n);
        }
        find(n) {
          return this._results.find(n);
        }
        reduce(n, t) {
          return this._results.reduce(n, t);
        }
        forEach(n) {
          this._results.forEach(n);
        }
        some(n) {
          return this._results.some(n);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(n, t) {
          const r = this;
          r.dirty = !1;
          const i = (function Vn(e) {
            return e.flat(Number.POSITIVE_INFINITY);
          })(n);
          (this._changesDetected = !(function wT(e, n, t) {
            if (e.length !== n.length) return !1;
            for (let r = 0; r < e.length; r++) {
              let i = e[r],
                o = n[r];
              if ((t && ((i = t(i)), (o = t(o))), o !== i)) return !1;
            }
            return !0;
          })(r._results, i, t)) &&
            ((r._results = i),
            (r.length = i.length),
            (r.last = i[this.length - 1]),
            (r.first = i[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      let Ge = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = nx), e;
      })();
      const ex = Ge,
        tx = class extends ex {
          constructor(n, t, r) {
            super(),
              (this._declarationLView = n),
              (this._declarationTContainer = t),
              (this.elementRef = r);
          }
          createEmbeddedView(n, t) {
            const r = this._declarationTContainer.tView,
              i = Sc(
                this._declarationLView,
                r,
                n,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                t || null
              );
            i[Js] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[pr];
            return (
              null !== s && (i[pr] = s.createEmbeddedView(r)),
              ch(r, i, n),
              new va(i)
            );
          }
        };
      function nx() {
        return $c(Vt(), x());
      }
      function $c(e, n) {
        return 4 & e.type ? new tx(n, e, Fo(e, n)) : null;
      }
      let $n = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = rx), e;
      })();
      function rx() {
        return Cb(Vt(), x());
      }
      const ix = $n,
        bb = class extends ix {
          constructor(n, t, r) {
            super(),
              (this._lContainer = n),
              (this._hostTNode = t),
              (this._hostLView = r);
          }
          get element() {
            return Fo(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Mo(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const n = pf(this._hostTNode, this._hostLView);
            if (N_(n)) {
              const t = ac(n, this._hostLView),
                r = sc(n);
              return new Mo(t[$].data[r + 8], t);
            }
            return new Mo(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(n) {
            const t = Db(this._lContainer);
            return (null !== t && t[n]) || null;
          }
          get length() {
            return this._lContainer.length - Xt;
          }
          createEmbeddedView(n, t, r) {
            let i, o;
            "number" == typeof r
              ? (i = r)
              : null != r && ((i = r.index), (o = r.injector));
            const s = n.createEmbeddedView(t || {}, o);
            return this.insert(s, i), s;
          }
          createComponent(n, t, r, i, o) {
            const s =
              n &&
              !(function ra(e) {
                return "function" == typeof e;
              })(n);
            let a;
            if (s) a = t;
            else {
              const d = t || {};
              (a = d.index),
                (r = d.injector),
                (i = d.projectableNodes),
                (o = d.environmentInjector || d.ngModuleRef);
            }
            const l = s ? n : new ya(Ae(n)),
              c = r || this.parentInjector;
            if (!o && null == l.ngModule) {
              const f = (s ? c : this.parentInjector).get(Hn, null);
              f && (o = f);
            }
            const u = l.create(c, i, void 0, o);
            return this.insert(u.hostView, a), u;
          }
          insert(n, t) {
            const r = n._lView,
              i = r[$];
            if (
              (function zM(e) {
                return Jn(e[it]);
              })(r)
            ) {
              const u = this.indexOf(n);
              if (-1 !== u) this.detach(u);
              else {
                const d = r[it],
                  f = new bb(d, d[qt], d[it]);
                f.detach(f.indexOf(n));
              }
            }
            const o = this._adjustIndex(t),
              s = this._lContainer;
            !(function dN(e, n, t, r) {
              const i = Xt + r,
                o = t.length;
              r > 0 && (t[i - 1][Yn] = n),
                r < o - Xt
                  ? ((n[Yn] = t[i]), H_(t, Xt + r, n))
                  : (t.push(n), (n[Yn] = null)),
                (n[it] = t);
              const s = n[Js];
              null !== s &&
                t !== s &&
                (function fN(e, n) {
                  const t = e[Co];
                  n[Kt] !== n[it][it][Kt] && (e[n_] = !0),
                    null === t ? (e[Co] = [n]) : t.push(n);
                })(s, n);
              const a = n[pr];
              null !== a && a.insertView(e), (n[he] |= 64);
            })(i, r, s, o);
            const a = Lf(o, s),
              l = r[ge],
              c = gc(l, s[Ql]);
            return (
              null !== c &&
                (function lN(e, n, t, r, i, o) {
                  (r[kr] = i), (r[qt] = n), da(e, r, t, 1, i, o);
                })(i, s[qt], l, r, c, a),
              n.attachToViewContainerRef(),
              H_(Hh(s), o, n),
              n
            );
          }
          move(n, t) {
            return this.insert(n, t);
          }
          indexOf(n) {
            const t = Db(this._lContainer);
            return null !== t ? t.indexOf(n) : -1;
          }
          remove(n) {
            const t = this._adjustIndex(n, -1),
              r = Pf(this._lContainer, t);
            r && (dc(Hh(this._lContainer), t), uv(r[$], r));
          }
          detach(n) {
            const t = this._adjustIndex(n, -1),
              r = Pf(this._lContainer, t);
            return r && null != dc(Hh(this._lContainer), t) ? new va(r) : null;
          }
          _adjustIndex(n, t = 0) {
            return n ?? this.length + t;
          }
        };
      function Db(e) {
        return e[Xl];
      }
      function Hh(e) {
        return e[Xl] || (e[Xl] = []);
      }
      function Cb(e, n) {
        let t;
        const r = n[e.index];
        if (Jn(r)) t = r;
        else {
          let i;
          if (8 & e.type) i = Bt(r);
          else {
            const o = n[ge];
            i = o.createComment("");
            const s = En(e, n);
            Pi(
              o,
              gc(o, s),
              i,
              (function mN(e, n) {
                return e.nextSibling(n);
              })(o, s),
              !1
            );
          }
          (n[e.index] = t = Dy(r, n, i, e)), Tc(n, t);
        }
        return new bb(t, e, n);
      }
      class Uh {
        constructor(n) {
          (this.queryList = n), (this.matches = null);
        }
        clone() {
          return new Uh(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class $h {
        constructor(n = []) {
          this.queries = n;
        }
        createEmbeddedView(n) {
          const t = n.queries;
          if (null !== t) {
            const r =
                null !== n.contentQueries ? n.contentQueries[0] : t.length,
              i = [];
            for (let o = 0; o < r; o++) {
              const s = t.getByIndex(o);
              i.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new $h(i);
          }
          return null;
        }
        insertView(n) {
          this.dirtyQueriesWithMatches(n);
        }
        detachView(n) {
          this.dirtyQueriesWithMatches(n);
        }
        dirtyQueriesWithMatches(n) {
          for (let t = 0; t < this.queries.length; t++)
            null !== Tb(n, t).matches && this.queries[t].setDirty();
        }
      }
      class wb {
        constructor(n, t, r = null) {
          (this.predicate = n), (this.flags = t), (this.read = r);
        }
      }
      class Gh {
        constructor(n = []) {
          this.queries = n;
        }
        elementStart(n, t) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(n, t);
        }
        elementEnd(n) {
          for (let t = 0; t < this.queries.length; t++)
            this.queries[t].elementEnd(n);
        }
        embeddedTView(n) {
          let t = null;
          for (let r = 0; r < this.length; r++) {
            const i = null !== t ? t.length : 0,
              o = this.getByIndex(r).embeddedTView(n, i);
            o &&
              ((o.indexInDeclarationView = r),
              null !== t ? t.push(o) : (t = [o]));
          }
          return null !== t ? new Gh(t) : null;
        }
        template(n, t) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(n, t);
        }
        getByIndex(n) {
          return this.queries[n];
        }
        get length() {
          return this.queries.length;
        }
        track(n) {
          this.queries.push(n);
        }
      }
      class jh {
        constructor(n, t = -1) {
          (this.metadata = n),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = t);
        }
        elementStart(n, t) {
          this.isApplyingToNode(t) && this.matchTNode(n, t);
        }
        elementEnd(n) {
          this._declarationNodeIndex === n.index &&
            (this._appliesToNextNode = !1);
        }
        template(n, t) {
          this.elementStart(n, t);
        }
        embeddedTView(n, t) {
          return this.isApplyingToNode(n)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-n.index, t),
              new jh(this.metadata))
            : null;
        }
        isApplyingToNode(n) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const t = this._declarationNodeIndex;
            let r = n.parent;
            for (; null !== r && 8 & r.type && r.index !== t; ) r = r.parent;
            return t === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(n, t) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let i = 0; i < r.length; i++) {
              const o = r[i];
              this.matchTNodeWithReadOption(n, t, ox(t, o)),
                this.matchTNodeWithReadOption(n, t, uc(t, n, o, !1, !1));
            }
          else
            r === Ge
              ? 4 & t.type && this.matchTNodeWithReadOption(n, t, -1)
              : this.matchTNodeWithReadOption(n, t, uc(t, n, r, !1, !1));
        }
        matchTNodeWithReadOption(n, t, r) {
          if (null !== r) {
            const i = this.metadata.read;
            if (null !== i)
              if (i === De || i === $n || (i === Ge && 4 & t.type))
                this.addMatch(t.index, -2);
              else {
                const o = uc(t, n, i, !1, !1);
                null !== o && this.addMatch(t.index, o);
              }
            else this.addMatch(t.index, r);
          }
        }
        addMatch(n, t) {
          null === this.matches
            ? (this.matches = [n, t])
            : this.matches.push(n, t);
        }
      }
      function ox(e, n) {
        const t = e.localNames;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) if (t[r] === n) return t[r + 1];
        return null;
      }
      function ax(e, n, t, r) {
        return -1 === t
          ? (function sx(e, n) {
              return 11 & e.type ? Fo(e, n) : 4 & e.type ? $c(e, n) : null;
            })(n, e)
          : -2 === t
          ? (function lx(e, n, t) {
              return t === De
                ? Fo(n, e)
                : t === Ge
                ? $c(n, e)
                : t === $n
                ? Cb(n, e)
                : void 0;
            })(e, n, r)
          : Ri(e, e[$], t, n);
      }
      function Eb(e, n, t, r) {
        const i = n[pr].queries[r];
        if (null === i.matches) {
          const o = e.data,
            s = t.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const c = s[l];
            a.push(c < 0 ? null : ax(n, o[c], s[l + 1], t.metadata.read));
          }
          i.matches = a;
        }
        return i.matches;
      }
      function zh(e, n, t, r) {
        const i = e.queries.getByIndex(t),
          o = i.matches;
        if (null !== o) {
          const s = Eb(e, n, i, t);
          for (let a = 0; a < o.length; a += 2) {
            const l = o[a];
            if (l > 0) r.push(s[a / 2]);
            else {
              const c = o[a + 1],
                u = n[-l];
              for (let d = Xt; d < u.length; d++) {
                const f = u[d];
                f[Js] === f[it] && zh(f[$], f, c, r);
              }
              if (null !== u[Co]) {
                const d = u[Co];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  zh(h[$], h, c, r);
                }
              }
            }
          }
        }
        return r;
      }
      function we(e) {
        const n = x(),
          t = be(),
          r = v_();
        sf(r + 1);
        const i = Tb(t, r);
        if (
          e.dirty &&
          (function jM(e) {
            return 4 == (4 & e[he]);
          })(n) ===
            (2 == (2 & i.metadata.flags))
        ) {
          if (null === i.matches) e.reset([]);
          else {
            const o = i.crossesNgTemplate ? zh(t, n, r, []) : Eb(t, n, i, r);
            e.reset(o, sI), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function Vi(e, n, t) {
        const r = be();
        r.firstCreatePass &&
          (Mb(r, new wb(e, n, t), -1),
          2 == (2 & n) && (r.staticViewQueries = !0)),
          Sb(r, x(), n);
      }
      function je(e, n, t, r) {
        const i = be();
        if (i.firstCreatePass) {
          const o = Vt();
          Mb(i, new wb(n, t, r), o.index),
            (function ux(e, n) {
              const t = e.contentQueries || (e.contentQueries = []);
              n !== (t.length ? t[t.length - 1] : -1) &&
                t.push(e.queries.length - 1, n);
            })(i, e),
            2 == (2 & t) && (i.staticContentQueries = !0);
        }
        Sb(i, x(), t);
      }
      function Ee() {
        return (function cx(e, n) {
          return e[pr].queries[n].queryList;
        })(x(), v_());
      }
      function Sb(e, n, t) {
        const r = new Vh(4 == (4 & t));
        my(e, n, r, r.destroy),
          null === n[pr] && (n[pr] = new $h()),
          n[pr].queries.push(new Uh(r));
      }
      function Mb(e, n, t) {
        null === e.queries && (e.queries = new Gh()),
          e.queries.track(new jh(n, t));
      }
      function Tb(e, n) {
        return e.queries.getByIndex(n);
      }
      function rn(e, n) {
        return $c(e, n);
      }
      function jc(...e) {}
      const zc = new z("Application Initializer");
      let Wc = (() => {
        class e {
          constructor(t) {
            (this.appInits = t),
              (this.resolve = jc),
              (this.reject = jc),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, i) => {
                (this.resolve = r), (this.reject = i);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const t = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let i = 0; i < this.appInits.length; i++) {
                const o = this.appInits[i]();
                if (Ca(o)) t.push(o);
                else if (wh(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  t.push(s);
                }
              }
            Promise.all(t)
              .then(() => {
                r();
              })
              .catch((i) => {
                this.reject(i);
              }),
              0 === t.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(zc, 8));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Fa = new z("AppId", {
        providedIn: "root",
        factory: function zb() {
          return `${Zh()}${Zh()}${Zh()}`;
        },
      });
      function Zh() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Wb = new z("Platform Initializer"),
        qc = new z("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        });
      let Ox = (() => {
        class e {
          log(t) {
            console.log(t);
          }
          warn(t) {
            console.warn(t);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      const Nn = new z("LocaleId", {
        providedIn: "root",
        factory: () =>
          se(Nn, ee.Optional | ee.SkipSelf) ||
          (function Ax() {
            return (typeof $localize < "u" && $localize.locale) || Xo;
          })(),
      });
      class xx {
        constructor(n, t) {
          (this.ngModuleFactory = n), (this.componentFactories = t);
        }
      }
      let qb = (() => {
        class e {
          compileModuleSync(t) {
            return new Ph(t);
          }
          compileModuleAsync(t) {
            return Promise.resolve(this.compileModuleSync(t));
          }
          compileModuleAndAllComponentsSync(t) {
            const r = this.compileModuleSync(t),
              o = Vr(Cn(t).declarations).reduce((s, a) => {
                const l = Ae(a);
                return l && s.push(new ya(l)), s;
              }, []);
            return new xx(r, o);
          }
          compileModuleAndAllComponentsAsync(t) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
          }
          clearCache() {}
          clearCacheFor(t) {}
          getModuleId(t) {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Fx = (() => Promise.resolve(0))();
      function Qh(e) {
        typeof Zone > "u"
          ? Fx.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class Ce {
        constructor({
          enableLongStackTrace: n = !1,
          shouldCoalesceEventChangeDetection: t = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new W(!1)),
            (this.onMicrotaskEmpty = new W(!1)),
            (this.onStable = new W(!1)),
            (this.onError = new W(!1)),
            typeof Zone > "u")
          )
            throw new B(908, !1);
          Zone.assertZonePatched();
          const i = this;
          (i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            n &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && t),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function Lx() {
              let e = Ke.requestAnimationFrame,
                n = Ke.cancelAnimationFrame;
              if (typeof Zone < "u" && e && n) {
                const t = e[Zone.__symbol__("OriginalDelegate")];
                t && (e = t);
                const r = n[Zone.__symbol__("OriginalDelegate")];
                r && (n = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: n,
              };
            })().nativeRequestAnimationFrame),
            (function Hx(e) {
              const n = () => {
                !(function Vx(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(Ke, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                ep(e),
                                (e.isCheckStableRunning = !0),
                                Xh(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    ep(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (t, r, i, o, s, a) => {
                  try {
                    return Jb(e), t.invokeTask(i, o, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === o.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      n(),
                      Zb(e);
                  }
                },
                onInvoke: (t, r, i, o, s, a, l) => {
                  try {
                    return Jb(e), t.invoke(i, o, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && n(), Zb(e);
                  }
                },
                onHasTask: (t, r, i, o) => {
                  t.hasTask(i, o),
                    r === i &&
                      ("microTask" == o.change
                        ? ((e._hasPendingMicrotasks = o.microTask),
                          ep(e),
                          Xh(e))
                        : "macroTask" == o.change &&
                          (e.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (t, r, i, o) => (
                  t.handleError(i, o),
                  e.runOutsideAngular(() => e.onError.emit(o)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!Ce.isInAngularZone()) throw new B(909, !1);
        }
        static assertNotInAngularZone() {
          if (Ce.isInAngularZone()) throw new B(909, !1);
        }
        run(n, t, r) {
          return this._inner.run(n, t, r);
        }
        runTask(n, t, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + i, n, Bx, jc, jc);
          try {
            return o.runTask(s, t, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(n, t, r) {
          return this._inner.runGuarded(n, t, r);
        }
        runOutsideAngular(n) {
          return this._outer.run(n);
        }
      }
      const Bx = {};
      function Xh(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function ep(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Jb(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function Zb(e) {
        e._nesting--, Xh(e);
      }
      class Ux {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new W()),
            (this.onMicrotaskEmpty = new W()),
            (this.onStable = new W()),
            (this.onError = new W());
        }
        run(n, t, r) {
          return n.apply(t, r);
        }
        runGuarded(n, t, r) {
          return n.apply(t, r);
        }
        runOutsideAngular(n) {
          return n();
        }
        runTask(n, t, r, i) {
          return n.apply(t, r);
        }
      }
      const Qb = new z(""),
        Kc = new z("");
      let rp,
        tp = (() => {
          class e {
            constructor(t, r, i) {
              (this._ngZone = t),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                rp ||
                  ((function $x(e) {
                    rp = e;
                  })(i),
                  i.addToWindow(r)),
                this._watchAngularEvents(),
                t.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      Ce.assertNotInAngularZone(),
                        Qh(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Qh(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let t = this._callbacks.pop();
                    clearTimeout(t.timeoutId), t.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let t = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(t) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((t) => ({
                    source: t.source,
                    creationLocation: t.creationLocation,
                    data: t.data,
                  }))
                : [];
            }
            addCallback(t, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== o
                  )),
                    t(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: t, timeoutId: o, updateCb: i });
            }
            whenStable(t, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(t, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(t) {
              this.registry.registerApplication(t, this);
            }
            unregisterApplication(t) {
              this.registry.unregisterApplication(t);
            }
            findProviders(t, r, i) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Ce), L(np), L(Kc));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        np = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(t, r) {
              this._applications.set(t, r);
            }
            unregisterApplication(t) {
              this._applications.delete(t);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(t) {
              return this._applications.get(t) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(t, r = !0) {
              return rp?.findTestabilityInTree(this, t, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })();
      const Gr = !1;
      let fi = null;
      const Xb = new z("AllowMultipleToken"),
        ip = new z("PlatformDestroyListeners"),
        e0 = new z("appBootstrapListener");
      class t0 {
        constructor(n, t) {
          (this.name = n), (this.token = t);
        }
      }
      function r0(e, n, t = []) {
        const r = `Platform: ${n}`,
          i = new z(r);
        return (o = []) => {
          let s = op();
          if (!s || s.injector.get(Xb, !1)) {
            const a = [...t, ...o, { provide: i, useValue: !0 }];
            e
              ? e(a)
              : (function zx(e) {
                  if (fi && !fi.get(Xb, !1)) throw new B(400, !1);
                  fi = e;
                  const n = e.get(s0);
                  (function n0(e) {
                    const n = e.get(Wb, null);
                    n && n.forEach((t) => t());
                  })(e);
                })(
                  (function o0(e = [], n) {
                    return gn.create({
                      name: n,
                      providers: [
                        { provide: Jf, useValue: "platform" },
                        { provide: ip, useValue: new Set([() => (fi = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function qx(e) {
            const n = op();
            if (!n) throw new B(401, !1);
            return n;
          })();
        };
      }
      function op() {
        return fi?.get(s0) ?? null;
      }
      let s0 = (() => {
        class e {
          constructor(t) {
            (this._injector = t),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(t, r) {
            const i = (function l0(e, n) {
                let t;
                return (
                  (t =
                    "noop" === e
                      ? new Ux()
                      : ("zone.js" === e ? void 0 : e) || new Ce(n)),
                  t
                );
              })(
                r?.ngZone,
                (function a0(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              o = [{ provide: Ce, useValue: i }];
            return i.run(() => {
              const s = gn.create({
                  providers: o,
                  parent: this.injector,
                  name: t.moduleType.name,
                }),
                a = t.create(s),
                l = a.injector.get(Lo, null);
              if (!l) throw new B(402, !1);
              return (
                i.runOutsideAngular(() => {
                  const c = i.onError.subscribe({
                    next: (u) => {
                      l.handleError(u);
                    },
                  });
                  a.onDestroy(() => {
                    Yc(this._modules, a), c.unsubscribe();
                  });
                }),
                (function c0(e, n, t) {
                  try {
                    const r = t();
                    return Ca(r)
                      ? r.catch((i) => {
                          throw (
                            (n.runOutsideAngular(() => e.handleError(i)), i)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (n.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(l, i, () => {
                  const c = a.injector.get(Wc);
                  return (
                    c.runInitializers(),
                    c.donePromise.then(
                      () => (
                        F1(a.injector.get(Nn, Xo) || Xo),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(t, r = []) {
            const i = u0({}, r);
            return (function Gx(e, n, t) {
              const r = new Ph(t);
              return Promise.resolve(r);
            })(0, 0, t).then((o) => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(t) {
            const r = t.injector.get(is);
            if (t._bootstrapComponents.length > 0)
              t._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!t.instance.ngDoBootstrap) throw new B(-403, !1);
              t.instance.ngDoBootstrap(r);
            }
            this._modules.push(t);
          }
          onDestroy(t) {
            this._destroyListeners.push(t);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new B(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const t = this._injector.get(ip, null);
            t && (t.forEach((r) => r()), t.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(gn));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function u0(e, n) {
        return Array.isArray(n) ? n.reduce(u0, e) : { ...e, ...n };
      }
      let is = (() => {
        class e {
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          constructor(t, r, i) {
            (this._zone = t),
              (this._injector = r),
              (this._exceptionHandler = i),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const o = new Me((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new Me((a) => {
                let l;
                this._zone.runOutsideAngular(() => {
                  l = this._zone.onStable.subscribe(() => {
                    Ce.assertNotInAngularZone(),
                      Qh(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const c = this._zone.onUnstable.subscribe(() => {
                  Ce.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  l.unsubscribe(), c.unsubscribe();
                };
              });
            this.isStable = $m(
              o,
              s.pipe(
                (function dM(e = {}) {
                  const {
                    connector: n = () => new Pe(),
                    resetOnError: t = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: i = !0,
                  } = e;
                  return (o) => {
                    let s,
                      a,
                      l,
                      c = 0,
                      u = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = l = void 0), (u = d = !1);
                      },
                      y = () => {
                        const b = s;
                        h(), b?.unsubscribe();
                      };
                    return Qe((b, w) => {
                      c++, !d && !u && f();
                      const S = (l = l ?? n());
                      w.add(() => {
                        c--, 0 === c && !d && !u && (a = Bd(y, i));
                      }),
                        S.subscribe(w),
                        !s &&
                          c > 0 &&
                          ((s = new ri({
                            next: (O) => S.next(O),
                            error: (O) => {
                              (d = !0), f(), (a = Bd(h, t, O)), S.error(O);
                            },
                            complete: () => {
                              (u = !0), f(), (a = Bd(h, r)), S.complete();
                            },
                          })),
                          Et(b).subscribe(s));
                    })(o);
                  };
                })()
              )
            );
          }
          bootstrap(t, r) {
            const i = t instanceof Wv;
            if (!this._injector.get(Wc).done) {
              !i &&
                (function vo(e) {
                  const n = Ae(e) || Wt(e) || un(e);
                  return null !== n && n.standalone;
                })(t);
              throw new B(405, Gr);
            }
            let s;
            (s = i ? t : this._injector.get(ga).resolveComponentFactory(t)),
              this.componentTypes.push(s.componentType);
            const a = (function jx(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(ts),
              c = s.create(gn.NULL, [], r || s.selector, a),
              u = c.location.nativeElement,
              d = c.injector.get(Qb, null);
            return (
              d?.registerApplication(u),
              c.onDestroy(() => {
                this.detachView(c.hostView),
                  Yc(this.components, c),
                  d?.unregisterApplication(u);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new B(101, !1);
            try {
              this._runningTick = !0;
              for (let t of this._views) t.detectChanges();
            } catch (t) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(t)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(t) {
            const r = t;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(t) {
            const r = t;
            Yc(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(t) {
            this.attachView(t.hostView), this.tick(), this.components.push(t);
            const r = this._injector.get(e0, []);
            r.push(...this._bootstrapListeners), r.forEach((i) => i(t));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((t) => t()),
                  this._views.slice().forEach((t) => t.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(t) {
            return (
              this._destroyListeners.push(t),
              () => Yc(this._destroyListeners, t)
            );
          }
          destroy() {
            if (this._destroyed) throw new B(406, !1);
            const t = this._injector;
            t.destroy && !t.destroyed && t.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(Ce), L(Hn), L(Lo));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function Yc(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      let _n = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = Yx), e;
      })();
      function Yx(e) {
        return (function Jx(e, n, t) {
          if (Qs(e) && !t) {
            const r = dn(e.index, n);
            return new va(r, r);
          }
          return 47 & e.type ? new va(n[Kt], n) : null;
        })(Vt(), x(), 16 == (16 & e));
      }
      class g0 {
        constructor() {}
        supports(n) {
          return Rc(n);
        }
        create(n) {
          return new nP(n);
        }
      }
      const tP = (e, n) => n;
      class nP {
        constructor(n) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = n || tP);
        }
        forEachItem(n) {
          let t;
          for (t = this._itHead; null !== t; t = t._next) n(t);
        }
        forEachOperation(n) {
          let t = this._itHead,
            r = this._removalsHead,
            i = 0,
            o = null;
          for (; t || r; ) {
            const s = !r || (t && t.currentIndex < _0(r, i, o)) ? t : r,
              a = _0(s, i, o),
              l = s.currentIndex;
            if (s === r) i--, (r = r._nextRemoved);
            else if (((t = t._next), null == s.previousIndex)) i++;
            else {
              o || (o = []);
              const c = a - i,
                u = l - i;
              if (c != u) {
                for (let f = 0; f < c; f++) {
                  const h = f < o.length ? o[f] : (o[f] = 0),
                    y = h + f;
                  u <= y && y < c && (o[f] = h + 1);
                }
                o[s.previousIndex] = u - c;
              }
            }
            a !== l && n(s, a, l);
          }
        }
        forEachPreviousItem(n) {
          let t;
          for (t = this._previousItHead; null !== t; t = t._nextPrevious) n(t);
        }
        forEachAddedItem(n) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) n(t);
        }
        forEachMovedItem(n) {
          let t;
          for (t = this._movesHead; null !== t; t = t._nextMoved) n(t);
        }
        forEachRemovedItem(n) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) n(t);
        }
        forEachIdentityChange(n) {
          let t;
          for (
            t = this._identityChangesHead;
            null !== t;
            t = t._nextIdentityChange
          )
            n(t);
        }
        diff(n) {
          if ((null == n && (n = []), !Rc(n))) throw new B(900, !1);
          return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
          this._reset();
          let i,
            o,
            s,
            t = this._itHead,
            r = !1;
          if (Array.isArray(n)) {
            this.length = n.length;
            for (let a = 0; a < this.length; a++)
              (o = n[a]),
                (s = this._trackByFn(a, o)),
                null !== t && Object.is(t.trackById, s)
                  ? (r && (t = this._verifyReinsertion(t, o, s, a)),
                    Object.is(t.item, o) || this._addIdentityChange(t, o))
                  : ((t = this._mismatch(t, o, s, a)), (r = !0)),
                (t = t._next);
          } else
            (i = 0),
              (function $O(e, n) {
                if (Array.isArray(e))
                  for (let t = 0; t < e.length; t++) n(e[t]);
                else {
                  const t = e[Symbol.iterator]();
                  let r;
                  for (; !(r = t.next()).done; ) n(r.value);
                }
              })(n, (a) => {
                (s = this._trackByFn(i, a)),
                  null !== t && Object.is(t.trackById, s)
                    ? (r && (t = this._verifyReinsertion(t, a, s, i)),
                      Object.is(t.item, a) || this._addIdentityChange(t, a))
                    : ((t = this._mismatch(t, a, s, i)), (r = !0)),
                  (t = t._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(t), (this.collection = n), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let n;
            for (
              n = this._previousItHead = this._itHead;
              null !== n;
              n = n._next
            )
              n._nextPrevious = n._next;
            for (n = this._additionsHead; null !== n; n = n._nextAdded)
              n.previousIndex = n.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                n = this._movesHead;
              null !== n;
              n = n._nextMoved
            )
              n.previousIndex = n.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(n, t, r, i) {
          let o;
          return (
            null === n ? (o = this._itTail) : ((o = n._prev), this._remove(n)),
            null !==
            (n =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
                this._reinsertAfter(n, o, i))
              : null !==
                (n =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, i))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
                this._moveAfter(n, o, i))
              : (n = this._addAfter(new rP(t, r), o, i)),
            n
          );
        }
        _verifyReinsertion(n, t, r, i) {
          let o =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== o
              ? (n = this._reinsertAfter(o, n._prev, i))
              : n.currentIndex != i &&
                ((n.currentIndex = i), this._addToMoves(n, i)),
            n
          );
        }
        _truncate(n) {
          for (; null !== n; ) {
            const t = n._next;
            this._addToRemovals(this._unlink(n)), (n = t);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(n, t, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(n);
          const i = n._prevRemoved,
            o = n._nextRemoved;
          return (
            null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
            null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
            this._insertAfter(n, t, r),
            this._addToMoves(n, r),
            n
          );
        }
        _moveAfter(n, t, r) {
          return (
            this._unlink(n),
            this._insertAfter(n, t, r),
            this._addToMoves(n, r),
            n
          );
        }
        _addAfter(n, t, r) {
          return (
            this._insertAfter(n, t, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = n)
                : (this._additionsTail._nextAdded = n)),
            n
          );
        }
        _insertAfter(n, t, r) {
          const i = null === t ? this._itHead : t._next;
          return (
            (n._next = i),
            (n._prev = t),
            null === i ? (this._itTail = n) : (i._prev = n),
            null === t ? (this._itHead = n) : (t._next = n),
            null === this._linkedRecords && (this._linkedRecords = new m0()),
            this._linkedRecords.put(n),
            (n.currentIndex = r),
            n
          );
        }
        _remove(n) {
          return this._addToRemovals(this._unlink(n));
        }
        _unlink(n) {
          null !== this._linkedRecords && this._linkedRecords.remove(n);
          const t = n._prev,
            r = n._next;
          return (
            null === t ? (this._itHead = r) : (t._next = r),
            null === r ? (this._itTail = t) : (r._prev = t),
            n
          );
        }
        _addToMoves(n, t) {
          return (
            n.previousIndex === t ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = n)
                  : (this._movesTail._nextMoved = n)),
            n
          );
        }
        _addToRemovals(n) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new m0()),
            this._unlinkedRecords.put(n),
            (n.currentIndex = null),
            (n._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = n),
                (n._prevRemoved = null))
              : ((n._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = n)),
            n
          );
        }
        _addIdentityChange(n, t) {
          return (
            (n.item = t),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = n)
                : (this._identityChangesTail._nextIdentityChange = n)),
            n
          );
        }
      }
      class rP {
        constructor(n, t) {
          (this.item = n),
            (this.trackById = t),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class iP {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(n) {
          null === this._head
            ? ((this._head = this._tail = n),
              (n._nextDup = null),
              (n._prevDup = null))
            : ((this._tail._nextDup = n),
              (n._prevDup = this._tail),
              (n._nextDup = null),
              (this._tail = n));
        }
        get(n, t) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === t || t <= r.currentIndex) &&
              Object.is(r.trackById, n)
            )
              return r;
          return null;
        }
        remove(n) {
          const t = n._prevDup,
            r = n._nextDup;
          return (
            null === t ? (this._head = r) : (t._nextDup = r),
            null === r ? (this._tail = t) : (r._prevDup = t),
            null === this._head
          );
        }
      }
      class m0 {
        constructor() {
          this.map = new Map();
        }
        put(n) {
          const t = n.trackById;
          let r = this.map.get(t);
          r || ((r = new iP()), this.map.set(t, r)), r.add(n);
        }
        get(n, t) {
          const i = this.map.get(n);
          return i ? i.get(n, t) : null;
        }
        remove(n) {
          const t = n.trackById;
          return this.map.get(t).remove(n) && this.map.delete(t), n;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function _0(e, n, t) {
        const r = e.previousIndex;
        if (null === r) return r;
        let i = 0;
        return t && r < t.length && (i = t[r]), r + n + i;
      }
      function y0() {
        return new Qc([new g0()]);
      }
      let Qc = (() => {
        class e {
          constructor(t) {
            this.factories = t;
          }
          static create(t, r) {
            if (null != r) {
              const i = r.factories.slice();
              t = t.concat(i);
            }
            return new e(t);
          }
          static extend(t) {
            return {
              provide: e,
              useFactory: (r) => e.create(t, r || y0()),
              deps: [[e, new sa(), new oa()]],
            };
          }
          find(t) {
            const r = this.factories.find((i) => i.supports(t));
            if (null != r) return r;
            throw new B(901, !1);
          }
        }
        return (e.ɵprov = F({ token: e, providedIn: "root", factory: y0 })), e;
      })();
      const cP = r0(null, "core", []);
      let uP = (() => {
        class e {
          constructor(t) {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(is));
          }),
          (e.ɵmod = ke({ type: e })),
          (e.ɵinj = Ie({})),
          e
        );
      })();
      function os(e) {
        return "boolean" == typeof e ? e : null != e && "false" !== e;
      }
      function up(e, n) {
        const t = Ae(e),
          r = n.elementInjector || wc();
        return new ya(t).create(
          r,
          n.projectableNodes,
          n.hostElement,
          n.environmentInjector
        );
      }
      let dp = null;
      function jr() {
        return dp;
      }
      class hP {}
      const lt = new z("DocumentToken");
      let fp = (() => {
        class e {
          historyGo(t) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({
            token: e,
            factory: function () {
              return (function pP() {
                return L(D0);
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const gP = new z("Location Initialized");
      let D0 = (() => {
        class e extends fp {
          constructor(t) {
            super(),
              (this._doc = t),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return jr().getBaseHref(this._doc);
          }
          onPopState(t) {
            const r = jr().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", t, !1),
              () => r.removeEventListener("popstate", t)
            );
          }
          onHashChange(t) {
            const r = jr().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", t, !1),
              () => r.removeEventListener("hashchange", t)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(t) {
            this._location.pathname = t;
          }
          pushState(t, r, i) {
            C0() ? this._history.pushState(t, r, i) : (this._location.hash = i);
          }
          replaceState(t, r, i) {
            C0()
              ? this._history.replaceState(t, r, i)
              : (this._location.hash = i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(t = 0) {
            this._history.go(t);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(lt));
          }),
          (e.ɵprov = F({
            token: e,
            factory: function () {
              return (function mP() {
                return new D0(L(lt));
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function C0() {
        return !!window.history.pushState;
      }
      function hp(e, n) {
        if (0 == e.length) return n;
        if (0 == n.length) return e;
        let t = 0;
        return (
          e.endsWith("/") && t++,
          n.startsWith("/") && t++,
          2 == t ? e + n.substring(1) : 1 == t ? e + n : e + "/" + n
        );
      }
      function w0(e) {
        const n = e.match(/#|\?|$/),
          t = (n && n.index) || e.length;
        return e.slice(0, t - ("/" === e[t - 1] ? 1 : 0)) + e.slice(t);
      }
      function zr(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Ui = (() => {
        class e {
          historyGo(t) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({
            token: e,
            factory: function () {
              return se(S0);
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const E0 = new z("appBaseHref");
      let S0 = (() => {
          class e extends Ui {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  se(lt).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(t) {
              return hp(this._baseHref, t);
            }
            path(t = !1) {
              const r =
                  this._platformLocation.pathname +
                  zr(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && t ? `${r}${i}` : r;
            }
            pushState(t, r, i, o) {
              const s = this.prepareExternalUrl(i + zr(o));
              this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, i, o) {
              const s = this.prepareExternalUrl(i + zr(o));
              this._platformLocation.replaceState(t, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(fp), L(E0, 8));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        _P = (() => {
          class e extends Ui {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(t = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(t) {
              const r = hp(this._baseHref, t);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(t, r, i, o) {
              let s = this.prepareExternalUrl(i + zr(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, i, o) {
              let s = this.prepareExternalUrl(i + zr(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(t, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(fp), L(E0, 8));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        $i = (() => {
          class e {
            constructor(t) {
              (this._subject = new W()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = t);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function bP(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, t] = e.split(/\/\/[^\/]+/);
                  return t;
                }
                return e;
              })(w0(M0(r)))),
                this._locationStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(t = !1) {
              return this.normalize(this._locationStrategy.path(t));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(t, r = "") {
              return this.path() == this.normalize(t + zr(r));
            }
            normalize(t) {
              return e.stripTrailingSlash(
                (function yP(e, n) {
                  if (!e || !n.startsWith(e)) return n;
                  const t = n.substring(e.length);
                  return "" === t || ["/", ";", "?", "#"].includes(t[0])
                    ? t
                    : n;
                })(this._basePath, M0(t))
              );
            }
            prepareExternalUrl(t) {
              return (
                t && "/" !== t[0] && (t = "/" + t),
                this._locationStrategy.prepareExternalUrl(t)
              );
            }
            go(t, r = "", i = null) {
              this._locationStrategy.pushState(i, "", t, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + zr(r)),
                  i
                );
            }
            replaceState(t, r = "", i = null) {
              this._locationStrategy.replaceState(i, "", t, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + zr(r)),
                  i
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(t = 0) {
              this._locationStrategy.historyGo?.(t);
            }
            onUrlChange(t) {
              return (
                this._urlChangeListeners.push(t),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(t);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(t = "", r) {
              this._urlChangeListeners.forEach((i) => i(t, r));
            }
            subscribe(t, r, i) {
              return this._subject.subscribe({
                next: t,
                error: r,
                complete: i,
              });
            }
          }
          return (
            (e.normalizeQueryParams = zr),
            (e.joinWithSlash = hp),
            (e.stripTrailingSlash = w0),
            (e.ɵfac = function (t) {
              return new (t || e)(L(Ui));
            }),
            (e.ɵprov = F({
              token: e,
              factory: function () {
                return (function vP() {
                  return new $i(L(Ui));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function M0(e) {
        return e.replace(/\/index.html$/, "");
      }
      var vn = (() => (
          ((vn = vn || {})[(vn.Decimal = 0)] = "Decimal"),
          (vn[(vn.Percent = 1)] = "Percent"),
          (vn[(vn.Currency = 2)] = "Currency"),
          (vn[(vn.Scientific = 3)] = "Scientific"),
          vn
        ))(),
        Ze = (() => (
          ((Ze = Ze || {})[(Ze.Format = 0)] = "Format"),
          (Ze[(Ze.Standalone = 1)] = "Standalone"),
          Ze
        ))(),
        ue = (() => (
          ((ue = ue || {})[(ue.Narrow = 0)] = "Narrow"),
          (ue[(ue.Abbreviated = 1)] = "Abbreviated"),
          (ue[(ue.Wide = 2)] = "Wide"),
          (ue[(ue.Short = 3)] = "Short"),
          ue
        ))(),
        nt = (() => (
          ((nt = nt || {})[(nt.Short = 0)] = "Short"),
          (nt[(nt.Medium = 1)] = "Medium"),
          (nt[(nt.Long = 2)] = "Long"),
          (nt[(nt.Full = 3)] = "Full"),
          nt
        ))(),
        Q = (() => (
          ((Q = Q || {})[(Q.Decimal = 0)] = "Decimal"),
          (Q[(Q.Group = 1)] = "Group"),
          (Q[(Q.List = 2)] = "List"),
          (Q[(Q.PercentSign = 3)] = "PercentSign"),
          (Q[(Q.PlusSign = 4)] = "PlusSign"),
          (Q[(Q.MinusSign = 5)] = "MinusSign"),
          (Q[(Q.Exponential = 6)] = "Exponential"),
          (Q[(Q.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
          (Q[(Q.PerMille = 8)] = "PerMille"),
          (Q[(Q.Infinity = 9)] = "Infinity"),
          (Q[(Q.NaN = 10)] = "NaN"),
          (Q[(Q.TimeSeparator = 11)] = "TimeSeparator"),
          (Q[(Q.CurrencyDecimal = 12)] = "CurrencyDecimal"),
          (Q[(Q.CurrencyGroup = 13)] = "CurrencyGroup"),
          Q
        ))();
      function N0(e, n, t) {
        const r = nn(e),
          o = jn([r[U.DayPeriodsFormat], r[U.DayPeriodsStandalone]], n);
        return jn(o, t);
      }
      function I0(e, n, t) {
        const r = nn(e),
          o = jn([r[U.DaysFormat], r[U.DaysStandalone]], n);
        return jn(o, t);
      }
      function pp(e, n, t) {
        const r = nn(e),
          o = jn([r[U.MonthsFormat], r[U.MonthsStandalone]], n);
        return jn(o, t);
      }
      function Xc(e, n) {
        return jn(nn(e)[U.DateFormat], n);
      }
      function eu(e, n) {
        return jn(nn(e)[U.TimeFormat], n);
      }
      function tu(e, n) {
        return jn(nn(e)[U.DateTimeFormat], n);
      }
      function Gn(e, n) {
        const t = nn(e),
          r = t[U.NumberSymbols][n];
        if (typeof r > "u") {
          if (n === Q.CurrencyDecimal) return t[U.NumberSymbols][Q.Decimal];
          if (n === Q.CurrencyGroup) return t[U.NumberSymbols][Q.Group];
        }
        return r;
      }
      function O0(e) {
        if (!e[U.ExtraData])
          throw new Error(
            `Missing extra locale data for the locale "${
              e[U.LocaleId]
            }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
          );
      }
      function jn(e, n) {
        for (let t = n; t > -1; t--) if (typeof e[t] < "u") return e[t];
        throw new Error("Locale data API: locale data undefined");
      }
      function mp(e) {
        const [n, t] = e.split(":");
        return { hours: +n, minutes: +t };
      }
      const OP =
          /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
        Ba = {},
        AP =
          /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
      var It = (() => (
          ((It = It || {})[(It.Short = 0)] = "Short"),
          (It[(It.ShortGMT = 1)] = "ShortGMT"),
          (It[(It.Long = 2)] = "Long"),
          (It[(It.Extended = 3)] = "Extended"),
          It
        ))(),
        ne = (() => (
          ((ne = ne || {})[(ne.FullYear = 0)] = "FullYear"),
          (ne[(ne.Month = 1)] = "Month"),
          (ne[(ne.Date = 2)] = "Date"),
          (ne[(ne.Hours = 3)] = "Hours"),
          (ne[(ne.Minutes = 4)] = "Minutes"),
          (ne[(ne.Seconds = 5)] = "Seconds"),
          (ne[(ne.FractionalSeconds = 6)] = "FractionalSeconds"),
          (ne[(ne.Day = 7)] = "Day"),
          ne
        ))(),
        pe = (() => (
          ((pe = pe || {})[(pe.DayPeriods = 0)] = "DayPeriods"),
          (pe[(pe.Days = 1)] = "Days"),
          (pe[(pe.Months = 2)] = "Months"),
          (pe[(pe.Eras = 3)] = "Eras"),
          pe
        ))();
      function A0(e, n, t, r) {
        let i = (function HP(e) {
          if (P0(e)) return e;
          if ("number" == typeof e && !isNaN(e)) return new Date(e);
          if ("string" == typeof e) {
            if (((e = e.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(e))) {
              const [i, o = 1, s = 1] = e.split("-").map((a) => +a);
              return nu(i, o - 1, s);
            }
            const t = parseFloat(e);
            if (!isNaN(e - t)) return new Date(t);
            let r;
            if ((r = e.match(OP)))
              return (function UP(e) {
                const n = new Date(0);
                let t = 0,
                  r = 0;
                const i = e[8] ? n.setUTCFullYear : n.setFullYear,
                  o = e[8] ? n.setUTCHours : n.setHours;
                e[9] &&
                  ((t = Number(e[9] + e[10])), (r = Number(e[9] + e[11]))),
                  i.call(n, Number(e[1]), Number(e[2]) - 1, Number(e[3]));
                const s = Number(e[4] || 0) - t,
                  a = Number(e[5] || 0) - r,
                  l = Number(e[6] || 0),
                  c = Math.floor(1e3 * parseFloat("0." + (e[7] || 0)));
                return o.call(n, s, a, l, c), n;
              })(r);
          }
          const n = new Date(e);
          if (!P0(n)) throw new Error(`Unable to convert "${e}" into a date`);
          return n;
        })(e);
        n = Wr(t, n) || n;
        let a,
          s = [];
        for (; n; ) {
          if (((a = AP.exec(n)), !a)) {
            s.push(n);
            break;
          }
          {
            s = s.concat(a.slice(1));
            const u = s.pop();
            if (!u) break;
            n = u;
          }
        }
        let l = i.getTimezoneOffset();
        r &&
          ((l = x0(r, l)),
          (i = (function VP(e, n, t) {
            const r = t ? -1 : 1,
              i = e.getTimezoneOffset();
            return (function BP(e, n) {
              return (
                (e = new Date(e.getTime())).setMinutes(e.getMinutes() + n), e
              );
            })(e, r * (x0(n, i) - i));
          })(i, r, !0)));
        let c = "";
        return (
          s.forEach((u) => {
            const d = (function LP(e) {
              if (vp[e]) return vp[e];
              let n;
              switch (e) {
                case "G":
                case "GG":
                case "GGG":
                  n = ze(pe.Eras, ue.Abbreviated);
                  break;
                case "GGGG":
                  n = ze(pe.Eras, ue.Wide);
                  break;
                case "GGGGG":
                  n = ze(pe.Eras, ue.Narrow);
                  break;
                case "y":
                  n = yt(ne.FullYear, 1, 0, !1, !0);
                  break;
                case "yy":
                  n = yt(ne.FullYear, 2, 0, !0, !0);
                  break;
                case "yyy":
                  n = yt(ne.FullYear, 3, 0, !1, !0);
                  break;
                case "yyyy":
                  n = yt(ne.FullYear, 4, 0, !1, !0);
                  break;
                case "Y":
                  n = su(1);
                  break;
                case "YY":
                  n = su(2, !0);
                  break;
                case "YYY":
                  n = su(3);
                  break;
                case "YYYY":
                  n = su(4);
                  break;
                case "M":
                case "L":
                  n = yt(ne.Month, 1, 1);
                  break;
                case "MM":
                case "LL":
                  n = yt(ne.Month, 2, 1);
                  break;
                case "MMM":
                  n = ze(pe.Months, ue.Abbreviated);
                  break;
                case "MMMM":
                  n = ze(pe.Months, ue.Wide);
                  break;
                case "MMMMM":
                  n = ze(pe.Months, ue.Narrow);
                  break;
                case "LLL":
                  n = ze(pe.Months, ue.Abbreviated, Ze.Standalone);
                  break;
                case "LLLL":
                  n = ze(pe.Months, ue.Wide, Ze.Standalone);
                  break;
                case "LLLLL":
                  n = ze(pe.Months, ue.Narrow, Ze.Standalone);
                  break;
                case "w":
                  n = _p(1);
                  break;
                case "ww":
                  n = _p(2);
                  break;
                case "W":
                  n = _p(1, !0);
                  break;
                case "d":
                  n = yt(ne.Date, 1);
                  break;
                case "dd":
                  n = yt(ne.Date, 2);
                  break;
                case "c":
                case "cc":
                  n = yt(ne.Day, 1);
                  break;
                case "ccc":
                  n = ze(pe.Days, ue.Abbreviated, Ze.Standalone);
                  break;
                case "cccc":
                  n = ze(pe.Days, ue.Wide, Ze.Standalone);
                  break;
                case "ccccc":
                  n = ze(pe.Days, ue.Narrow, Ze.Standalone);
                  break;
                case "cccccc":
                  n = ze(pe.Days, ue.Short, Ze.Standalone);
                  break;
                case "E":
                case "EE":
                case "EEE":
                  n = ze(pe.Days, ue.Abbreviated);
                  break;
                case "EEEE":
                  n = ze(pe.Days, ue.Wide);
                  break;
                case "EEEEE":
                  n = ze(pe.Days, ue.Narrow);
                  break;
                case "EEEEEE":
                  n = ze(pe.Days, ue.Short);
                  break;
                case "a":
                case "aa":
                case "aaa":
                  n = ze(pe.DayPeriods, ue.Abbreviated);
                  break;
                case "aaaa":
                  n = ze(pe.DayPeriods, ue.Wide);
                  break;
                case "aaaaa":
                  n = ze(pe.DayPeriods, ue.Narrow);
                  break;
                case "b":
                case "bb":
                case "bbb":
                  n = ze(pe.DayPeriods, ue.Abbreviated, Ze.Standalone, !0);
                  break;
                case "bbbb":
                  n = ze(pe.DayPeriods, ue.Wide, Ze.Standalone, !0);
                  break;
                case "bbbbb":
                  n = ze(pe.DayPeriods, ue.Narrow, Ze.Standalone, !0);
                  break;
                case "B":
                case "BB":
                case "BBB":
                  n = ze(pe.DayPeriods, ue.Abbreviated, Ze.Format, !0);
                  break;
                case "BBBB":
                  n = ze(pe.DayPeriods, ue.Wide, Ze.Format, !0);
                  break;
                case "BBBBB":
                  n = ze(pe.DayPeriods, ue.Narrow, Ze.Format, !0);
                  break;
                case "h":
                  n = yt(ne.Hours, 1, -12);
                  break;
                case "hh":
                  n = yt(ne.Hours, 2, -12);
                  break;
                case "H":
                  n = yt(ne.Hours, 1);
                  break;
                case "HH":
                  n = yt(ne.Hours, 2);
                  break;
                case "m":
                  n = yt(ne.Minutes, 1);
                  break;
                case "mm":
                  n = yt(ne.Minutes, 2);
                  break;
                case "s":
                  n = yt(ne.Seconds, 1);
                  break;
                case "ss":
                  n = yt(ne.Seconds, 2);
                  break;
                case "S":
                  n = yt(ne.FractionalSeconds, 1);
                  break;
                case "SS":
                  n = yt(ne.FractionalSeconds, 2);
                  break;
                case "SSS":
                  n = yt(ne.FractionalSeconds, 3);
                  break;
                case "Z":
                case "ZZ":
                case "ZZZ":
                  n = iu(It.Short);
                  break;
                case "ZZZZZ":
                  n = iu(It.Extended);
                  break;
                case "O":
                case "OO":
                case "OOO":
                case "z":
                case "zz":
                case "zzz":
                  n = iu(It.ShortGMT);
                  break;
                case "OOOO":
                case "ZZZZ":
                case "zzzz":
                  n = iu(It.Long);
                  break;
                default:
                  return null;
              }
              return (vp[e] = n), n;
            })(u);
            c += d
              ? d(i, t, l)
              : "''" === u
              ? "'"
              : u.replace(/(^'|'$)/g, "").replace(/''/g, "'");
          }),
          c
        );
      }
      function nu(e, n, t) {
        const r = new Date(0);
        return r.setFullYear(e, n, t), r.setHours(0, 0, 0), r;
      }
      function Wr(e, n) {
        const t = (function DP(e) {
          return nn(e)[U.LocaleId];
        })(e);
        if (((Ba[t] = Ba[t] || {}), Ba[t][n])) return Ba[t][n];
        let r = "";
        switch (n) {
          case "shortDate":
            r = Xc(e, nt.Short);
            break;
          case "mediumDate":
            r = Xc(e, nt.Medium);
            break;
          case "longDate":
            r = Xc(e, nt.Long);
            break;
          case "fullDate":
            r = Xc(e, nt.Full);
            break;
          case "shortTime":
            r = eu(e, nt.Short);
            break;
          case "mediumTime":
            r = eu(e, nt.Medium);
            break;
          case "longTime":
            r = eu(e, nt.Long);
            break;
          case "fullTime":
            r = eu(e, nt.Full);
            break;
          case "short":
            const i = Wr(e, "shortTime"),
              o = Wr(e, "shortDate");
            r = ru(tu(e, nt.Short), [i, o]);
            break;
          case "medium":
            const s = Wr(e, "mediumTime"),
              a = Wr(e, "mediumDate");
            r = ru(tu(e, nt.Medium), [s, a]);
            break;
          case "long":
            const l = Wr(e, "longTime"),
              c = Wr(e, "longDate");
            r = ru(tu(e, nt.Long), [l, c]);
            break;
          case "full":
            const u = Wr(e, "fullTime"),
              d = Wr(e, "fullDate");
            r = ru(tu(e, nt.Full), [u, d]);
        }
        return r && (Ba[t][n] = r), r;
      }
      function ru(e, n) {
        return (
          n &&
            (e = e.replace(/\{([^}]+)}/g, function (t, r) {
              return null != n && r in n ? n[r] : t;
            })),
          e
        );
      }
      function rr(e, n, t = "-", r, i) {
        let o = "";
        (e < 0 || (i && e <= 0)) && (i ? (e = 1 - e) : ((e = -e), (o = t)));
        let s = String(e);
        for (; s.length < n; ) s = "0" + s;
        return r && (s = s.slice(s.length - n)), o + s;
      }
      function yt(e, n, t = 0, r = !1, i = !1) {
        return function (o, s) {
          let a = (function xP(e, n) {
            switch (e) {
              case ne.FullYear:
                return n.getFullYear();
              case ne.Month:
                return n.getMonth();
              case ne.Date:
                return n.getDate();
              case ne.Hours:
                return n.getHours();
              case ne.Minutes:
                return n.getMinutes();
              case ne.Seconds:
                return n.getSeconds();
              case ne.FractionalSeconds:
                return n.getMilliseconds();
              case ne.Day:
                return n.getDay();
              default:
                throw new Error(`Unknown DateType value "${e}".`);
            }
          })(e, o);
          if (((t > 0 || a > -t) && (a += t), e === ne.Hours))
            0 === a && -12 === t && (a = 12);
          else if (e === ne.FractionalSeconds)
            return (function RP(e, n) {
              return rr(e, 3).substring(0, n);
            })(a, n);
          const l = Gn(s, Q.MinusSign);
          return rr(a, n, l, r, i);
        };
      }
      function ze(e, n, t = Ze.Format, r = !1) {
        return function (i, o) {
          return (function PP(e, n, t, r, i, o) {
            switch (t) {
              case pe.Months:
                return pp(n, i, r)[e.getMonth()];
              case pe.Days:
                return I0(n, i, r)[e.getDay()];
              case pe.DayPeriods:
                const s = e.getHours(),
                  a = e.getMinutes();
                if (o) {
                  const c = (function SP(e) {
                      const n = nn(e);
                      return (
                        O0(n),
                        (n[U.ExtraData][2] || []).map((r) =>
                          "string" == typeof r ? mp(r) : [mp(r[0]), mp(r[1])]
                        )
                      );
                    })(n),
                    u = (function MP(e, n, t) {
                      const r = nn(e);
                      O0(r);
                      const o =
                        jn([r[U.ExtraData][0], r[U.ExtraData][1]], n) || [];
                      return jn(o, t) || [];
                    })(n, i, r),
                    d = c.findIndex((f) => {
                      if (Array.isArray(f)) {
                        const [h, y] = f,
                          b = s >= h.hours && a >= h.minutes,
                          w = s < y.hours || (s === y.hours && a < y.minutes);
                        if (h.hours < y.hours) {
                          if (b && w) return !0;
                        } else if (b || w) return !0;
                      } else if (f.hours === s && f.minutes === a) return !0;
                      return !1;
                    });
                  if (-1 !== d) return u[d];
                }
                return N0(n, i, r)[s < 12 ? 0 : 1];
              case pe.Eras:
                return (function CP(e, n) {
                  return jn(nn(e)[U.Eras], n);
                })(n, r)[e.getFullYear() <= 0 ? 0 : 1];
              default:
                throw new Error(`unexpected translation type ${t}`);
            }
          })(i, o, e, n, t, r);
        };
      }
      function iu(e) {
        return function (n, t, r) {
          const i = -1 * r,
            o = Gn(t, Q.MinusSign),
            s = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
          switch (e) {
            case It.Short:
              return (
                (i >= 0 ? "+" : "") + rr(s, 2, o) + rr(Math.abs(i % 60), 2, o)
              );
            case It.ShortGMT:
              return "GMT" + (i >= 0 ? "+" : "") + rr(s, 1, o);
            case It.Long:
              return (
                "GMT" +
                (i >= 0 ? "+" : "") +
                rr(s, 2, o) +
                ":" +
                rr(Math.abs(i % 60), 2, o)
              );
            case It.Extended:
              return 0 === r
                ? "Z"
                : (i >= 0 ? "+" : "") +
                    rr(s, 2, o) +
                    ":" +
                    rr(Math.abs(i % 60), 2, o);
            default:
              throw new Error(`Unknown zone width "${e}"`);
          }
        };
      }
      const kP = 0,
        ou = 4;
      function R0(e) {
        return nu(
          e.getFullYear(),
          e.getMonth(),
          e.getDate() + (ou - e.getDay())
        );
      }
      function _p(e, n = !1) {
        return function (t, r) {
          let i;
          if (n) {
            const o = new Date(t.getFullYear(), t.getMonth(), 1).getDay() - 1,
              s = t.getDate();
            i = 1 + Math.floor((s + o) / 7);
          } else {
            const o = R0(t),
              s = (function FP(e) {
                const n = nu(e, kP, 1).getDay();
                return nu(e, 0, 1 + (n <= ou ? ou : ou + 7) - n);
              })(o.getFullYear()),
              a = o.getTime() - s.getTime();
            i = 1 + Math.round(a / 6048e5);
          }
          return rr(i, e, Gn(r, Q.MinusSign));
        };
      }
      function su(e, n = !1) {
        return function (t, r) {
          return rr(R0(t).getFullYear(), e, Gn(r, Q.MinusSign), n);
        };
      }
      const vp = {};
      function x0(e, n) {
        e = e.replace(/:/g, "");
        const t = Date.parse("Jan 01, 1970 00:00:00 " + e) / 6e4;
        return isNaN(t) ? n : t;
      }
      function P0(e) {
        return e instanceof Date && !isNaN(e.valueOf());
      }
      const $P = /^(\d+)?\.((\d+)(-(\d+))?)?$/,
        k0 = 22,
        au = ".",
        Va = "0",
        GP = ";",
        jP = ",",
        yp = "#";
      function Cp(e) {
        const n = parseInt(e);
        if (isNaN(n))
          throw new Error("Invalid integer literal when parsing " + e);
        return n;
      }
      function B0(e, n) {
        n = encodeURIComponent(n);
        for (const t of e.split(";")) {
          const r = t.indexOf("="),
            [i, o] = -1 == r ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
          if (i.trim() === n) return decodeURIComponent(o);
        }
        return null;
      }
      class tk {
        constructor(n, t, r, i) {
          (this.$implicit = n),
            (this.ngForOf = t),
            (this.index = r),
            (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let Zt = (() => {
        class e {
          set ngForOf(t) {
            (this._ngForOf = t), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(t) {
            this._trackByFn = t;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(t, r, i) {
            (this._viewContainer = t),
              (this._template = r),
              (this._differs = i),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(t) {
            t && (this._template = t);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const t = this._ngForOf;
              !this._differ &&
                t &&
                (this._differ = this._differs
                  .find(t)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const t = this._differ.diff(this._ngForOf);
              t && this._applyChanges(t);
            }
          }
          _applyChanges(t) {
            const r = this._viewContainer;
            t.forEachOperation((i, o, s) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new tk(i.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = r.get(o);
                r.move(a, s), $0(a, i);
              }
            });
            for (let i = 0, o = r.length; i < o; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            t.forEachIdentityChange((i) => {
              $0(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_($n), _(Ge), _(Qc));
          }),
          (e.ɵdir = V({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          e
        );
      })();
      function $0(e, n) {
        e.context.$implicit = n.item;
      }
      let kt = (() => {
        class e {
          constructor(t, r) {
            (this._viewContainer = t),
              (this._context = new rk()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(t) {
            (this._context.$implicit = this._context.ngIf = t),
              this._updateView();
          }
          set ngIfThen(t) {
            G0("ngIfThen", t),
              (this._thenTemplateRef = t),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(t) {
            G0("ngIfElse", t),
              (this._elseTemplateRef = t),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_($n), _(Ge));
          }),
          (e.ɵdir = V({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          e
        );
      })();
      class rk {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function G0(e, n) {
        if (n && !n.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${$e(n)}'.`
          );
      }
      let qr = (() => {
        class e {
          constructor(t) {
            (this._viewContainerRef = t),
              (this._viewRef = null),
              (this.ngTemplateOutletContext = null),
              (this.ngTemplateOutlet = null),
              (this.ngTemplateOutletInjector = null);
          }
          ngOnChanges(t) {
            if (t.ngTemplateOutlet || t.ngTemplateOutletInjector) {
              const r = this._viewContainerRef;
              if (
                (this._viewRef && r.remove(r.indexOf(this._viewRef)),
                this.ngTemplateOutlet)
              ) {
                const {
                  ngTemplateOutlet: i,
                  ngTemplateOutletContext: o,
                  ngTemplateOutletInjector: s,
                } = this;
                this._viewRef = r.createEmbeddedView(
                  i,
                  o,
                  s ? { injector: s } : void 0
                );
              } else this._viewRef = null;
            } else
              this._viewRef &&
                t.ngTemplateOutletContext &&
                this.ngTemplateOutletContext &&
                (this._viewRef.context = this.ngTemplateOutletContext);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_($n));
          }),
          (e.ɵdir = V({
            type: e,
            selectors: [["", "ngTemplateOutlet", ""]],
            inputs: {
              ngTemplateOutletContext: "ngTemplateOutletContext",
              ngTemplateOutlet: "ngTemplateOutlet",
              ngTemplateOutletInjector: "ngTemplateOutletInjector",
            },
            standalone: !0,
            features: [ot],
          })),
          e
        );
      })();
      function ir(e, n) {
        return new B(2100, !1);
      }
      const vk = new z("DATE_PIPE_DEFAULT_TIMEZONE"),
        yk = new z("DATE_PIPE_DEFAULT_OPTIONS");
      let Tp = (() => {
          class e {
            constructor(t, r, i) {
              (this.locale = t),
                (this.defaultTimezone = r),
                (this.defaultOptions = i);
            }
            transform(t, r, i, o) {
              if (null == t || "" === t || t != t) return null;
              try {
                return A0(
                  t,
                  r ?? this.defaultOptions?.dateFormat ?? "mediumDate",
                  o || this.locale,
                  i ??
                    this.defaultOptions?.timezone ??
                    this.defaultTimezone ??
                    void 0
                );
              } catch (s) {
                throw ir();
              }
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Nn, 16), _(vk, 24), _(yk, 24));
            }),
            (e.ɵpipe = cn({ name: "date", type: e, pure: !0, standalone: !0 })),
            e
          );
        })(),
        W0 = (() => {
          class e {
            constructor(t) {
              this._locale = t;
            }
            transform(t, r, i) {
              if (
                !(function Np(e) {
                  return !(null == e || "" === e || e != e);
                })(t)
              )
                return null;
              i = i || this._locale;
              try {
                return (function qP(e, n, t) {
                  return (function bp(e, n, t, r, i, o, s = !1) {
                    let a = "",
                      l = !1;
                    if (isFinite(e)) {
                      let c = (function JP(e) {
                        let r,
                          i,
                          o,
                          s,
                          a,
                          n = Math.abs(e) + "",
                          t = 0;
                        for (
                          (i = n.indexOf(au)) > -1 && (n = n.replace(au, "")),
                            (o = n.search(/e/i)) > 0
                              ? (i < 0 && (i = o),
                                (i += +n.slice(o + 1)),
                                (n = n.substring(0, o)))
                              : i < 0 && (i = n.length),
                            o = 0;
                          n.charAt(o) === Va;
                          o++
                        );
                        if (o === (a = n.length)) (r = [0]), (i = 1);
                        else {
                          for (a--; n.charAt(a) === Va; ) a--;
                          for (i -= o, r = [], s = 0; o <= a; o++, s++)
                            r[s] = Number(n.charAt(o));
                        }
                        return (
                          i > k0 &&
                            ((r = r.splice(0, k0 - 1)), (t = i - 1), (i = 1)),
                          { digits: r, exponent: t, integerLen: i }
                        );
                      })(e);
                      s &&
                        (c = (function YP(e) {
                          if (0 === e.digits[0]) return e;
                          const n = e.digits.length - e.integerLen;
                          return (
                            e.exponent
                              ? (e.exponent += 2)
                              : (0 === n
                                  ? e.digits.push(0, 0)
                                  : 1 === n && e.digits.push(0),
                                (e.integerLen += 2)),
                            e
                          );
                        })(c));
                      let u = n.minInt,
                        d = n.minFrac,
                        f = n.maxFrac;
                      if (o) {
                        const O = o.match($P);
                        if (null === O)
                          throw new Error(`${o} is not a valid digit info`);
                        const T = O[1],
                          k = O[3],
                          j = O[5];
                        null != T && (u = Cp(T)),
                          null != k && (d = Cp(k)),
                          null != j
                            ? (f = Cp(j))
                            : null != k && d > f && (f = d);
                      }
                      !(function ZP(e, n, t) {
                        if (n > t)
                          throw new Error(
                            `The minimum number of digits after fraction (${n}) is higher than the maximum (${t}).`
                          );
                        let r = e.digits,
                          i = r.length - e.integerLen;
                        const o = Math.min(Math.max(n, i), t);
                        let s = o + e.integerLen,
                          a = r[s];
                        if (s > 0) {
                          r.splice(Math.max(e.integerLen, s));
                          for (let d = s; d < r.length; d++) r[d] = 0;
                        } else {
                          (i = Math.max(0, i)),
                            (e.integerLen = 1),
                            (r.length = Math.max(1, (s = o + 1))),
                            (r[0] = 0);
                          for (let d = 1; d < s; d++) r[d] = 0;
                        }
                        if (a >= 5)
                          if (s - 1 < 0) {
                            for (let d = 0; d > s; d--)
                              r.unshift(0), e.integerLen++;
                            r.unshift(1), e.integerLen++;
                          } else r[s - 1]++;
                        for (; i < Math.max(0, o); i++) r.push(0);
                        let l = 0 !== o;
                        const c = n + e.integerLen,
                          u = r.reduceRight(function (d, f, h, y) {
                            return (
                              (y[h] = (f += d) < 10 ? f : f - 10),
                              l && (0 === y[h] && h >= c ? y.pop() : (l = !1)),
                              f >= 10 ? 1 : 0
                            );
                          }, 0);
                        u && (r.unshift(u), e.integerLen++);
                      })(c, d, f);
                      let h = c.digits,
                        y = c.integerLen;
                      const b = c.exponent;
                      let w = [];
                      for (l = h.every((O) => !O); y < u; y++) h.unshift(0);
                      for (; y < 0; y++) h.unshift(0);
                      y > 0
                        ? (w = h.splice(y, h.length))
                        : ((w = h), (h = [0]));
                      const S = [];
                      for (
                        h.length >= n.lgSize &&
                        S.unshift(h.splice(-n.lgSize, h.length).join(""));
                        h.length > n.gSize;

                      )
                        S.unshift(h.splice(-n.gSize, h.length).join(""));
                      h.length && S.unshift(h.join("")),
                        (a = S.join(Gn(t, r))),
                        w.length && (a += Gn(t, i) + w.join("")),
                        b && (a += Gn(t, Q.Exponential) + "+" + b);
                    } else a = Gn(t, Q.Infinity);
                    return (
                      (a =
                        e < 0 && !l
                          ? n.negPre + a + n.negSuf
                          : n.posPre + a + n.posSuf),
                      a
                    );
                  })(
                    e,
                    (function Dp(e, n = "-") {
                      const t = {
                          minInt: 1,
                          minFrac: 0,
                          maxFrac: 0,
                          posPre: "",
                          posSuf: "",
                          negPre: "",
                          negSuf: "",
                          gSize: 0,
                          lgSize: 0,
                        },
                        r = e.split(GP),
                        i = r[0],
                        o = r[1],
                        s =
                          -1 !== i.indexOf(au)
                            ? i.split(au)
                            : [
                                i.substring(0, i.lastIndexOf(Va) + 1),
                                i.substring(i.lastIndexOf(Va) + 1),
                              ],
                        a = s[0],
                        l = s[1] || "";
                      t.posPre = a.substring(0, a.indexOf(yp));
                      for (let u = 0; u < l.length; u++) {
                        const d = l.charAt(u);
                        d === Va
                          ? (t.minFrac = t.maxFrac = u + 1)
                          : d === yp
                          ? (t.maxFrac = u + 1)
                          : (t.posSuf += d);
                      }
                      const c = a.split(jP);
                      if (
                        ((t.gSize = c[1] ? c[1].length : 0),
                        (t.lgSize = c[2] || c[1] ? (c[2] || c[1]).length : 0),
                        o)
                      ) {
                        const u = i.length - t.posPre.length - t.posSuf.length,
                          d = o.indexOf(yp);
                        (t.negPre = o.substring(0, d).replace(/'/g, "")),
                          (t.negSuf = o.slice(d + u).replace(/'/g, ""));
                      } else (t.negPre = n + t.posPre), (t.negSuf = t.posSuf);
                      return t;
                    })(
                      (function gp(e, n) {
                        return nn(e)[U.NumberFormats][n];
                      })(n, vn.Percent),
                      Gn(n, Q.MinusSign)
                    ),
                    n,
                    Q.Group,
                    Q.Decimal,
                    t,
                    !0
                  ).replace(new RegExp("%", "g"), Gn(n, Q.PercentSign));
                })(
                  (function Ip(e) {
                    if (
                      "string" == typeof e &&
                      !isNaN(Number(e) - parseFloat(e))
                    )
                      return Number(e);
                    if ("number" != typeof e)
                      throw new Error(`${e} is not a number`);
                    return e;
                  })(t),
                  i,
                  r
                );
              } catch (o) {
                throw ir();
              }
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Nn, 16));
            }),
            (e.ɵpipe = cn({
              name: "percent",
              type: e,
              pure: !0,
              standalone: !0,
            })),
            e
          );
        })();
      let lu = (() => {
          class e {
            transform(t, r, i) {
              if (null == t) return null;
              if (!this.supports(t)) throw ir();
              return t.slice(r, i);
            }
            supports(t) {
              return "string" == typeof t || Array.isArray(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵpipe = cn({
              name: "slice",
              type: e,
              pure: !1,
              standalone: !0,
            })),
            e
          );
        })(),
        Nk = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({})),
            e
          );
        })();
      const q0 = "browser";
      let xk = (() => {
        class e {}
        return (
          (e.ɵprov = F({
            token: e,
            providedIn: "root",
            factory: () => new Pk(L(lt), window),
          })),
          e
        );
      })();
      class Pk {
        constructor(n, t) {
          (this.document = n), (this.window = t), (this.offset = () => [0, 0]);
        }
        setOffset(n) {
          this.offset = Array.isArray(n) ? () => n : n;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(n) {
          this.supportsScrolling() && this.window.scrollTo(n[0], n[1]);
        }
        scrollToAnchor(n) {
          if (!this.supportsScrolling()) return;
          const t = (function kk(e, n) {
            const t = e.getElementById(n) || e.getElementsByName(n)[0];
            if (t) return t;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s =
                    o.getElementById(n) || o.querySelector(`[name="${n}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, n);
          t && (this.scrollToElement(t), t.focus());
        }
        setHistoryScrollRestoration(n) {
          if (this.supportScrollRestoration()) {
            const t = this.window.history;
            t && t.scrollRestoration && (t.scrollRestoration = n);
          }
        }
        scrollToElement(n) {
          const t = n.getBoundingClientRect(),
            r = t.left + this.window.pageXOffset,
            i = t.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const n =
              K0(this.window.history) ||
              K0(Object.getPrototypeOf(this.window.history));
            return !(!n || (!n.writable && !n.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function K0(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class Y0 {}
      class lF extends hP {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class Rp extends lF {
        static makeCurrent() {
          !(function fP(e) {
            dp || (dp = e);
          })(new Rp());
        }
        onAndCancel(n, t, r) {
          return (
            n.addEventListener(t, r, !1),
            () => {
              n.removeEventListener(t, r, !1);
            }
          );
        }
        dispatchEvent(n, t) {
          n.dispatchEvent(t);
        }
        remove(n) {
          n.parentNode && n.parentNode.removeChild(n);
        }
        createElement(n, t) {
          return (t = t || this.getDefaultDocument()).createElement(n);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(n) {
          return n.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(n) {
          return n instanceof DocumentFragment;
        }
        getGlobalEventTarget(n, t) {
          return "window" === t
            ? window
            : "document" === t
            ? n
            : "body" === t
            ? n.body
            : null;
        }
        getBaseHref(n) {
          const t = (function cF() {
            return (
              (Ua = Ua || document.querySelector("base")),
              Ua ? Ua.getAttribute("href") : null
            );
          })();
          return null == t
            ? null
            : (function uF(e) {
                (du = du || document.createElement("a")),
                  du.setAttribute("href", e);
                const n = du.pathname;
                return "/" === n.charAt(0) ? n : `/${n}`;
              })(t);
        }
        resetBaseElement() {
          Ua = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(n) {
          return B0(document.cookie, n);
        }
      }
      let du,
        Ua = null;
      const eD = new z("TRANSITION_ID"),
        fF = [
          {
            provide: zc,
            useFactory: function dF(e, n, t) {
              return () => {
                t.get(Wc).donePromise.then(() => {
                  const r = jr(),
                    i = n.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let o = 0; o < i.length; o++) r.remove(i[o]);
                });
              };
            },
            deps: [eD, lt, gn],
            multi: !0,
          },
        ];
      let pF = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const fu = new z("EventManagerPlugins");
      let hu = (() => {
        class e {
          constructor(t, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              t.forEach((i) => {
                i.manager = this;
              }),
              (this._plugins = t.slice().reverse());
          }
          addEventListener(t, r, i) {
            return this._findPluginFor(r).addEventListener(t, r, i);
          }
          addGlobalEventListener(t, r, i) {
            return this._findPluginFor(r).addGlobalEventListener(t, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(t) {
            const r = this._eventNameToPlugin.get(t);
            if (r) return r;
            const i = this._plugins;
            for (let o = 0; o < i.length; o++) {
              const s = i[o];
              if (s.supports(t)) return this._eventNameToPlugin.set(t, s), s;
            }
            throw new Error(`No event manager plugin found for event ${t}`);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(fu), L(Ce));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class tD {
        constructor(n) {
          this._doc = n;
        }
        addGlobalEventListener(n, t, r) {
          const i = jr().getGlobalEventTarget(this._doc, n);
          if (!i)
            throw new Error(`Unsupported event target ${i} for event ${t}`);
          return this.addEventListener(i, t, r);
        }
      }
      let nD = (() => {
          class e {
            constructor() {
              this.usageCount = new Map();
            }
            addStyles(t) {
              for (const r of t)
                1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
            }
            removeStyles(t) {
              for (const r of t)
                0 === this.changeUsageCount(r, -1) && this.onStyleRemoved(r);
            }
            onStyleRemoved(t) {}
            onStyleAdded(t) {}
            getAllStyles() {
              return this.usageCount.keys();
            }
            changeUsageCount(t, r) {
              const i = this.usageCount;
              let o = i.get(t) ?? 0;
              return (o += r), o > 0 ? i.set(t, o) : i.delete(t), o;
            }
            ngOnDestroy() {
              for (const t of this.getAllStyles()) this.onStyleRemoved(t);
              this.usageCount.clear();
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        $a = (() => {
          class e extends nD {
            constructor(t) {
              super(),
                (this.doc = t),
                (this.styleRef = new Map()),
                (this.hostNodes = new Set()),
                this.resetHostNodes();
            }
            onStyleAdded(t) {
              for (const r of this.hostNodes) this.addStyleToHost(r, t);
            }
            onStyleRemoved(t) {
              const r = this.styleRef;
              r.get(t)?.forEach((o) => o.remove()), r.delete(t);
            }
            ngOnDestroy() {
              super.ngOnDestroy(), this.styleRef.clear(), this.resetHostNodes();
            }
            addHost(t) {
              this.hostNodes.add(t);
              for (const r of this.getAllStyles()) this.addStyleToHost(t, r);
            }
            removeHost(t) {
              this.hostNodes.delete(t);
            }
            addStyleToHost(t, r) {
              const i = this.doc.createElement("style");
              (i.textContent = r), t.appendChild(i);
              const o = this.styleRef.get(r);
              o ? o.push(i) : this.styleRef.set(r, [i]);
            }
            resetHostNodes() {
              const t = this.hostNodes;
              t.clear(), t.add(this.doc.head);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(lt));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const xp = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Pp = /%COMP%/g,
        oD = new z("RemoveStylesOnCompDestory", {
          providedIn: "root",
          factory: () => !1,
        });
      function sD(e, n) {
        return n.flat(100).map((t) => t.replace(Pp, e));
      }
      function aD(e) {
        return (n) => {
          if ("__ngUnwrap__" === n) return e;
          !1 === e(n) && (n.preventDefault(), (n.returnValue = !1));
        };
      }
      let kp = (() => {
        class e {
          constructor(t, r, i, o) {
            (this.eventManager = t),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.removeStylesOnCompDestory = o),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Fp(t));
          }
          createRenderer(t, r) {
            if (!t || !r) return this.defaultRenderer;
            const i = this.getOrCreateRenderer(t, r);
            return (
              i instanceof uD
                ? i.applyToHost(t)
                : i instanceof Lp && i.applyStyles(),
              i
            );
          }
          getOrCreateRenderer(t, r) {
            const i = this.rendererByCompId;
            let o = i.get(r.id);
            if (!o) {
              const s = this.eventManager,
                a = this.sharedStylesHost,
                l = this.removeStylesOnCompDestory;
              switch (r.encapsulation) {
                case hr.Emulated:
                  o = new uD(s, a, r, this.appId, l);
                  break;
                case hr.ShadowDom:
                  return new DF(s, a, t, r);
                default:
                  o = new Lp(s, a, r, l);
              }
              (o.onDestroy = () => i.delete(r.id)), i.set(r.id, o);
            }
            return o;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(hu), L($a), L(Fa), L(oD));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Fp {
        constructor(n) {
          (this.eventManager = n),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(n, t) {
          return t
            ? document.createElementNS(xp[t] || t, n)
            : document.createElement(n);
        }
        createComment(n) {
          return document.createComment(n);
        }
        createText(n) {
          return document.createTextNode(n);
        }
        appendChild(n, t) {
          (cD(n) ? n.content : n).appendChild(t);
        }
        insertBefore(n, t, r) {
          n && (cD(n) ? n.content : n).insertBefore(t, r);
        }
        removeChild(n, t) {
          n && n.removeChild(t);
        }
        selectRootElement(n, t) {
          let r = "string" == typeof n ? document.querySelector(n) : n;
          if (!r)
            throw new Error(`The selector "${n}" did not match any elements`);
          return t || (r.textContent = ""), r;
        }
        parentNode(n) {
          return n.parentNode;
        }
        nextSibling(n) {
          return n.nextSibling;
        }
        setAttribute(n, t, r, i) {
          if (i) {
            t = i + ":" + t;
            const o = xp[i];
            o ? n.setAttributeNS(o, t, r) : n.setAttribute(t, r);
          } else n.setAttribute(t, r);
        }
        removeAttribute(n, t, r) {
          if (r) {
            const i = xp[r];
            i ? n.removeAttributeNS(i, t) : n.removeAttribute(`${r}:${t}`);
          } else n.removeAttribute(t);
        }
        addClass(n, t) {
          n.classList.add(t);
        }
        removeClass(n, t) {
          n.classList.remove(t);
        }
        setStyle(n, t, r, i) {
          i & (fn.DashCase | fn.Important)
            ? n.style.setProperty(t, r, i & fn.Important ? "important" : "")
            : (n.style[t] = r);
        }
        removeStyle(n, t, r) {
          r & fn.DashCase ? n.style.removeProperty(t) : (n.style[t] = "");
        }
        setProperty(n, t, r) {
          n[t] = r;
        }
        setValue(n, t) {
          n.nodeValue = t;
        }
        listen(n, t, r) {
          return "string" == typeof n
            ? this.eventManager.addGlobalEventListener(n, t, aD(r))
            : this.eventManager.addEventListener(n, t, aD(r));
        }
      }
      function cD(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class DF extends Fp {
        constructor(n, t, r, i) {
          super(n),
            (this.sharedStylesHost = t),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const o = sD(i.id, i.styles);
          for (const s of o) {
            const a = document.createElement("style");
            (a.textContent = s), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(n) {
          return n === this.hostEl ? this.shadowRoot : n;
        }
        appendChild(n, t) {
          return super.appendChild(this.nodeOrShadowRoot(n), t);
        }
        insertBefore(n, t, r) {
          return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
        }
        removeChild(n, t) {
          return super.removeChild(this.nodeOrShadowRoot(n), t);
        }
        parentNode(n) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(n))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class Lp extends Fp {
        constructor(n, t, r, i, o = r.id) {
          super(n),
            (this.sharedStylesHost = t),
            (this.removeStylesOnCompDestory = i),
            (this.rendererUsageCount = 0),
            (this.styles = sD(o, r.styles));
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles),
            this.rendererUsageCount++;
        }
        destroy() {
          this.removeStylesOnCompDestory &&
            (this.sharedStylesHost.removeStyles(this.styles),
            this.rendererUsageCount--,
            0 === this.rendererUsageCount && this.onDestroy?.());
        }
      }
      class uD extends Lp {
        constructor(n, t, r, i, o) {
          const s = i + "-" + r.id;
          super(n, t, r, o, s),
            (this.contentAttr = (function vF(e) {
              return "_ngcontent-%COMP%".replace(Pp, e);
            })(s)),
            (this.hostAttr = (function yF(e) {
              return "_nghost-%COMP%".replace(Pp, e);
            })(s));
        }
        applyToHost(n) {
          this.applyStyles(), this.setAttribute(n, this.hostAttr, "");
        }
        createElement(n, t) {
          const r = super.createElement(n, t);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let CF = (() => {
        class e extends tD {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return !0;
          }
          addEventListener(t, r, i) {
            return (
              t.addEventListener(r, i, !1),
              () => this.removeEventListener(t, r, i)
            );
          }
          removeEventListener(t, r, i) {
            return t.removeEventListener(r, i);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(lt));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const dD = ["alt", "control", "meta", "shift"],
        wF = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        EF = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let SF = (() => {
        class e extends tD {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return null != e.parseEventName(t);
          }
          addEventListener(t, r, i) {
            const o = e.parseEventName(r),
              s = e.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => jr().onAndCancel(t, o.domEventName, s));
          }
          static parseEventName(t) {
            const r = t.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i))
              return null;
            const o = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              dD.forEach((c) => {
                const u = r.indexOf(c);
                u > -1 && (r.splice(u, 1), (s += c + "."));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const l = {};
            return (l.domEventName = i), (l.fullKey = s), l;
          }
          static matchEventFullKeyCode(t, r) {
            let i = wF[t.key] || t.key,
              o = "";
            return (
              r.indexOf("code.") > -1 && ((i = t.code), (o = "code.")),
              !(null == i || !i) &&
                ((i = i.toLowerCase()),
                " " === i ? (i = "space") : "." === i && (i = "dot"),
                dD.forEach((s) => {
                  s !== i && (0, EF[s])(t) && (o += s + ".");
                }),
                (o += i),
                o === r)
            );
          }
          static eventCallback(t, r, i) {
            return (o) => {
              e.matchEventFullKeyCode(o, t) && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(t) {
            return "esc" === t ? "escape" : t;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(lt));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const IF = r0(cP, "browser", [
          { provide: qc, useValue: q0 },
          {
            provide: Wb,
            useValue: function MF() {
              Rp.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: lt,
            useFactory: function NF() {
              return (
                (function EN(e) {
                  Uf = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        pD = new z(""),
        gD = [
          {
            provide: Kc,
            useClass: class hF {
              addToWindow(n) {
                (Ke.getAngularTestability = (r, i = !0) => {
                  const o = n.findTestabilityInTree(r, i);
                  if (null == o)
                    throw new Error("Could not find testability for element.");
                  return o;
                }),
                  (Ke.getAllAngularTestabilities = () =>
                    n.getAllTestabilities()),
                  (Ke.getAllAngularRootElements = () => n.getAllRootElements()),
                  Ke.frameworkStabilizers || (Ke.frameworkStabilizers = []),
                  Ke.frameworkStabilizers.push((r) => {
                    const i = Ke.getAllAngularTestabilities();
                    let o = i.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), o--, 0 == o && r(s);
                    };
                    i.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(n, t, r) {
                return null == t
                  ? null
                  : n.getTestability(t) ??
                      (r
                        ? jr().isShadowRoot(t)
                          ? this.findTestabilityInTree(n, t.host, !0)
                          : this.findTestabilityInTree(n, t.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: Qb, useClass: tp, deps: [Ce, np, Kc] },
          { provide: tp, useClass: tp, deps: [Ce, np, Kc] },
        ],
        mD = [
          { provide: Jf, useValue: "root" },
          {
            provide: Lo,
            useFactory: function TF() {
              return new Lo();
            },
            deps: [],
          },
          { provide: fu, useClass: CF, multi: !0, deps: [lt, Ce, qc] },
          { provide: fu, useClass: SF, multi: !0, deps: [lt] },
          { provide: kp, useClass: kp, deps: [hu, $a, Fa, oD] },
          { provide: eh, useExisting: kp },
          { provide: nD, useExisting: $a },
          { provide: $a, useClass: $a, deps: [lt] },
          { provide: hu, useClass: hu, deps: [fu, Ce] },
          { provide: Y0, useClass: pF, deps: [] },
          [],
        ];
      let OF = (() => {
          class e {
            constructor(t) {}
            static withServerTransition(t) {
              return {
                ngModule: e,
                providers: [
                  { provide: Fa, useValue: t.appId },
                  { provide: eD, useExisting: Fa },
                  fF,
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(pD, 12));
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ providers: [...mD, ...gD], imports: [Nk, uP] })),
            e
          );
        })(),
        _D = (() => {
          class e {
            constructor(t) {
              this._doc = t;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(t) {
              this._doc.title = t || "";
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(lt));
            }),
            (e.ɵprov = F({
              token: e,
              factory: function (t) {
                let r = null;
                return (
                  (r = t
                    ? new t()
                    : (function RF() {
                        return new _D(L(lt));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function q(...e) {
        return mt(e, js(e));
      }
      typeof window < "u" && window;
      const { isArray: BF } = Array;
      function Hp(e) {
        return Z((n) =>
          (function VF(e, n) {
            return BF(n) ? e(...n) : e(n);
          })(e, n)
        );
      }
      const HF = ["addListener", "removeListener"],
        UF = ["addEventListener", "removeEventListener"],
        $F = ["on", "off"];
      function $t(e, n, t, r) {
        if ((_e(t) && ((r = t), (t = void 0)), r))
          return $t(e, n, t).pipe(Hp(r));
        const [i, o] = (function zF(e) {
          return _e(e.addEventListener) && _e(e.removeEventListener);
        })(e)
          ? UF.map((s) => (a) => e[s](n, a, t))
          : (function GF(e) {
              return _e(e.addListener) && _e(e.removeListener);
            })(e)
          ? HF.map(bD(e, n))
          : (function jF(e) {
              return _e(e.on) && _e(e.off);
            })(e)
          ? $F.map(bD(e, n))
          : [];
        if (!i && Fd(e)) return St((s) => $t(s, n, t))(Et(e));
        if (!i) throw new TypeError("Invalid event target");
        return new Me((s) => {
          const a = (...l) => s.next(1 < l.length ? l : l[0]);
          return i(a), () => o(a);
        });
      }
      function bD(e, n) {
        return (t) => (r) => e[t](n, r);
      }
      class WF extends gt {
        constructor(n, t) {
          super();
        }
        schedule(n, t = 0) {
          return this;
        }
      }
      const pu = {
          setInterval(e, n, ...t) {
            const { delegate: r } = pu;
            return r?.setInterval
              ? r.setInterval(e, n, ...t)
              : setInterval(e, n, ...t);
          },
          clearInterval(e) {
            const { delegate: n } = pu;
            return (n?.clearInterval || clearInterval)(e);
          },
          delegate: void 0,
        },
        DD = { now: () => (DD.delegate || Date).now(), delegate: void 0 };
      class Ga {
        constructor(n, t = Ga.now) {
          (this.schedulerActionCtor = n), (this.now = t);
        }
        schedule(n, t = 0, r) {
          return new this.schedulerActionCtor(this, n).schedule(r, t);
        }
      }
      Ga.now = DD.now;
      const YF = new (class KF extends Ga {
        constructor(n, t = Ga.now) {
          super(n, t), (this.actions = []), (this._active = !1);
        }
        flush(n) {
          const { actions: t } = this;
          if (this._active) return void t.push(n);
          let r;
          this._active = !0;
          do {
            if ((r = n.execute(n.state, n.delay))) break;
          } while ((n = t.shift()));
          if (((this._active = !1), r)) {
            for (; (n = t.shift()); ) n.unsubscribe();
            throw r;
          }
        }
      })(
        class qF extends WF {
          constructor(n, t) {
            super(n, t),
              (this.scheduler = n),
              (this.work = t),
              (this.pending = !1);
          }
          schedule(n, t = 0) {
            var r;
            if (this.closed) return this;
            this.state = n;
            const i = this.id,
              o = this.scheduler;
            return (
              null != i && (this.id = this.recycleAsyncId(o, i, t)),
              (this.pending = !0),
              (this.delay = t),
              (this.id =
                null !== (r = this.id) && void 0 !== r
                  ? r
                  : this.requestAsyncId(o, this.id, t)),
              this
            );
          }
          requestAsyncId(n, t, r = 0) {
            return pu.setInterval(n.flush.bind(n, this), r);
          }
          recycleAsyncId(n, t, r = 0) {
            if (null != r && this.delay === r && !1 === this.pending) return t;
            null != t && pu.clearInterval(t);
          }
          execute(n, t) {
            if (this.closed) return new Error("executing a cancelled action");
            this.pending = !1;
            const r = this._execute(n, t);
            if (r) return r;
            !1 === this.pending &&
              null != this.id &&
              (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
          }
          _execute(n, t) {
            let i,
              r = !1;
            try {
              this.work(n);
            } catch (o) {
              (r = !0),
                (i = o || new Error("Scheduled action threw falsy error"));
            }
            if (r) return this.unsubscribe(), i;
          }
          unsubscribe() {
            if (!this.closed) {
              const { id: n, scheduler: t } = this,
                { actions: r } = t;
              (this.work = this.state = this.scheduler = null),
                (this.pending = !1),
                ei(r, this),
                null != n && (this.id = this.recycleAsyncId(t, n, null)),
                (this.delay = null),
                super.unsubscribe();
            }
          }
        }
      );
      function Up(e = 0, n, t = YF) {
        let r = -1;
        return (
          null != n && (Bm(n) ? (t = n) : (r = n)),
          new Me((i) => {
            let o = (function JF(e) {
              return e instanceof Date && !isNaN(e);
            })(e)
              ? +e - t.now()
              : e;
            o < 0 && (o = 0);
            let s = 0;
            return t.schedule(function () {
              i.closed ||
                (i.next(s++), 0 <= r ? this.schedule(void 0, r) : i.complete());
            }, o);
          })
        );
      }
      const { isArray: ZF } = Array;
      function wD(e) {
        return 1 === e.length && ZF(e[0]) ? e[0] : e;
      }
      class Ot extends Pe {
        constructor(n) {
          super(), (this._value = n);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(n) {
          const t = super._subscribe(n);
          return !t.closed && n.next(this._value), t;
        }
        getValue() {
          const { hasError: n, thrownError: t, _value: r } = this;
          if (n) throw t;
          return this._throwIfClosed(), r;
        }
        next(n) {
          super.next((this._value = n));
        }
      }
      const { isArray: XF } = Array,
        { getPrototypeOf: e2, prototype: t2, keys: n2 } = Object;
      function SD(e) {
        if (1 === e.length) {
          const n = e[0];
          if (XF(n)) return { args: n, keys: null };
          if (
            (function r2(e) {
              return e && "object" == typeof e && e2(e) === t2;
            })(n)
          ) {
            const t = n2(n);
            return { args: t.map((r) => n[r]), keys: t };
          }
        }
        return { args: e, keys: null };
      }
      function MD(e, n) {
        return e.reduce((t, r, i) => ((t[r] = n[i]), t), {});
      }
      function gu(...e) {
        const n = js(e),
          t = Ul(e),
          { args: r, keys: i } = SD(e);
        if (0 === r.length) return mt([], n);
        const o = new Me(
          (function i2(e, n, t = Kn) {
            return (r) => {
              TD(
                n,
                () => {
                  const { length: i } = e,
                    o = new Array(i);
                  let s = i,
                    a = i;
                  for (let l = 0; l < i; l++)
                    TD(
                      n,
                      () => {
                        const c = mt(e[l], n);
                        let u = !1;
                        c.subscribe(
                          Be(
                            r,
                            (d) => {
                              (o[l] = d),
                                u || ((u = !0), a--),
                                a || r.next(t(o.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, n, i ? (s) => MD(i, s) : Kn)
        );
        return t ? o.pipe(Hp(t)) : o;
      }
      function TD(e, n, t) {
        e ? Ar(t, e, n) : n();
      }
      const ND = new Me(ni);
      function mu(...e) {
        const n = Ul(e),
          t = wD(e);
        return t.length
          ? new Me((r) => {
              let i = t.map(() => []),
                o = t.map(() => !1);
              r.add(() => {
                i = o = null;
              });
              for (let s = 0; !r.closed && s < t.length; s++)
                Et(t[s]).subscribe(
                  Be(
                    r,
                    (a) => {
                      if ((i[s].push(a), i.every((l) => l.length))) {
                        const l = i.map((c) => c.shift());
                        r.next(n ? n(...l) : l),
                          i.some((c, u) => !c.length && o[u]) && r.complete();
                      }
                    },
                    () => {
                      (o[s] = !0), !i[s].length && r.complete();
                    }
                  )
                );
              return () => {
                i = o = null;
              };
            })
          : kn;
      }
      function ja(...e) {
        return (function o2() {
          return mo(1);
        })()(mt(e, js(e)));
      }
      function ct(e) {
        return Qe((n, t) => {
          Et(e).subscribe(Be(t, () => t.complete(), ni)),
            !t.closed && n.subscribe(t);
        });
      }
      function At(e, n) {
        return Qe((t, r) => {
          let i = 0;
          t.subscribe(Be(r, (o) => e.call(n, o, i++) && r.next(o)));
        });
      }
      function bt(e) {
        return e <= 0
          ? () => kn
          : Qe((n, t) => {
              let r = 0;
              n.subscribe(
                Be(t, (i) => {
                  ++r <= e && (t.next(i), e <= r && t.complete());
                })
              );
            });
      }
      function _u(...e) {
        const n = js(e);
        return Qe((t, r) => {
          (n ? ja(e, t, n) : ja(e, t)).subscribe(r);
        });
      }
      function $p(e, n = Kn) {
        return (
          (e = e ?? a2),
          Qe((t, r) => {
            let i,
              o = !0;
            t.subscribe(
              Be(r, (s) => {
                const a = n(s);
                (o || !e(i, a)) && ((o = !1), (i = a), r.next(s));
              })
            );
          })
        );
      }
      function a2(e, n) {
        return e === n;
      }
      function zn(e, n) {
        return Qe((t, r) => {
          let i = null,
            o = 0,
            s = !1;
          const a = () => s && !i && r.complete();
          t.subscribe(
            Be(
              r,
              (l) => {
                i?.unsubscribe();
                let c = 0;
                const u = o++;
                Et(e(l, u)).subscribe(
                  (i = Be(
                    r,
                    (d) => r.next(n ? n(l, d, u, c++) : d),
                    () => {
                      (i = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function ht(e, n, t) {
        const r = _e(e) || n || t ? { next: e, error: n, complete: t } : e;
        return r
          ? Qe((i, o) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              i.subscribe(
                Be(
                  o,
                  (l) => {
                    var c;
                    null === (c = r.next) || void 0 === c || c.call(r, l),
                      o.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = r.complete) || void 0 === l || l.call(r),
                      o.complete();
                  },
                  (l) => {
                    var c;
                    (a = !1),
                      null === (c = r.error) || void 0 === c || c.call(r, l),
                      o.error(l);
                  },
                  () => {
                    var l, c;
                    a &&
                      (null === (l = r.unsubscribe) ||
                        void 0 === l ||
                        l.call(r)),
                      null === (c = r.finalize) || void 0 === c || c.call(r);
                  }
                )
              );
            })
          : Kn;
      }
      function Gp(...e) {
        const n = Ul(e);
        return Qe((t, r) => {
          const i = e.length,
            o = new Array(i);
          let s = e.map(() => !1),
            a = !1;
          for (let l = 0; l < i; l++)
            Et(e[l]).subscribe(
              Be(
                r,
                (c) => {
                  (o[l] = c),
                    !a &&
                      !s[l] &&
                      ((s[l] = !0), (a = s.every(Kn)) && (s = null));
                },
                ni
              )
            );
          t.subscribe(
            Be(r, (l) => {
              if (a) {
                const c = [l, ...o];
                r.next(n ? n(...c) : c);
              }
            })
          );
        });
      }
      let AD = (() => {
          class e {
            constructor(t, r) {
              (this._renderer = t),
                (this._elementRef = r),
                (this.onChange = (i) => {}),
                (this.onTouched = () => {});
            }
            setProperty(t, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, t, r);
            }
            registerOnTouched(t) {
              this.onTouched = t;
            }
            registerOnChange(t) {
              this.onChange = t;
            }
            setDisabledState(t) {
              this.setProperty("disabled", t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(pn), _(De));
            }),
            (e.ɵdir = V({ type: e })),
            e
          );
        })(),
        Gi = (() => {
          class e extends AD {}
          return (
            (e.ɵfac = (function () {
              let n;
              return function (r) {
                return (n || (n = st(e)))(r || e);
              };
            })()),
            (e.ɵdir = V({ type: e, features: [Re] })),
            e
          );
        })();
      const yn = new z("NgValueAccessor"),
        f2 = { provide: yn, useExisting: oe(() => jp), multi: !0 };
      let jp = (() => {
        class e extends Gi {
          writeValue(t) {
            this.setProperty("checked", t);
          }
        }
        return (
          (e.ɵfac = (function () {
            let n;
            return function (r) {
              return (n || (n = st(e)))(r || e);
            };
          })()),
          (e.ɵdir = V({
            type: e,
            selectors: [
              ["input", "type", "checkbox", "formControlName", ""],
              ["input", "type", "checkbox", "formControl", ""],
              ["input", "type", "checkbox", "ngModel", ""],
            ],
            hostBindings: function (t, r) {
              1 & t &&
                P("change", function (o) {
                  return r.onChange(o.target.checked);
                })("blur", function () {
                  return r.onTouched();
                });
            },
            features: [Fe([f2]), Re],
          })),
          e
        );
      })();
      const h2 = { provide: yn, useExisting: oe(() => Dr), multi: !0 },
        g2 = new z("CompositionEventMode");
      let Dr = (() => {
        class e extends AD {
          constructor(t, r, i) {
            super(t, r),
              (this._compositionMode = i),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function p2() {
                  const e = jr() ? jr().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(t) {
            this.setProperty("value", t ?? "");
          }
          _handleInput(t) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(t);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(t) {
            (this._composing = !1), this._compositionMode && this.onChange(t);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(pn), _(De), _(g2, 8));
          }),
          (e.ɵdir = V({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (t, r) {
              1 & t &&
                P("input", function (o) {
                  return r._handleInput(o.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (o) {
                  return r._compositionEnd(o.target.value);
                });
            },
            features: [Fe([h2]), Re],
          })),
          e
        );
      })();
      const m2 = !1;
      const Gt = new z("NgValidators"),
        gi = new z("NgAsyncValidators");
      function kD(e) {
        return (function pi(e) {
          return (
            null == e ||
            (("string" == typeof e || Array.isArray(e)) && 0 === e.length)
          );
        })(e.value)
          ? { required: !0 }
          : null;
      }
      function vu(e) {
        return null;
      }
      function UD(e) {
        return null != e;
      }
      function $D(e) {
        const n = Ca(e) ? mt(e) : e;
        if (m2 && !wh(n)) {
          let t = "Expected async validator to return Promise or Observable.";
          throw (
            ("object" == typeof e &&
              (t +=
                " Are you using a synchronous validator where an async validator is expected?"),
            new B(-1101, t))
          );
        }
        return n;
      }
      function GD(e) {
        let n = {};
        return (
          e.forEach((t) => {
            n = null != t ? { ...n, ...t } : n;
          }),
          0 === Object.keys(n).length ? null : n
        );
      }
      function jD(e, n) {
        return n.map((t) => t(e));
      }
      function zD(e) {
        return e.map((n) =>
          (function v2(e) {
            return !e.validate;
          })(n)
            ? n
            : (t) => n.validate(t)
        );
      }
      function zp(e) {
        return null != e
          ? (function WD(e) {
              if (!e) return null;
              const n = e.filter(UD);
              return 0 == n.length
                ? null
                : function (t) {
                    return GD(jD(t, n));
                  };
            })(zD(e))
          : null;
      }
      function Wp(e) {
        return null != e
          ? (function qD(e) {
              if (!e) return null;
              const n = e.filter(UD);
              return 0 == n.length
                ? null
                : function (t) {
                    return (function d2(...e) {
                      const n = Ul(e),
                        { args: t, keys: r } = SD(e),
                        i = new Me((o) => {
                          const { length: s } = t;
                          if (!s) return void o.complete();
                          const a = new Array(s);
                          let l = s,
                            c = s;
                          for (let u = 0; u < s; u++) {
                            let d = !1;
                            Et(t[u]).subscribe(
                              Be(
                                o,
                                (f) => {
                                  d || ((d = !0), c--), (a[u] = f);
                                },
                                () => l--,
                                void 0,
                                () => {
                                  (!l || !d) &&
                                    (c || o.next(r ? MD(r, a) : a),
                                    o.complete());
                                }
                              )
                            );
                          }
                        });
                      return n ? i.pipe(Hp(n)) : i;
                    })(jD(t, n).map($D)).pipe(Z(GD));
                  };
            })(zD(e))
          : null;
      }
      function KD(e, n) {
        return null === e ? [n] : Array.isArray(e) ? [...e, n] : [e, n];
      }
      function qp(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function yu(e, n) {
        return Array.isArray(e) ? e.includes(n) : e === n;
      }
      function ZD(e, n) {
        const t = qp(n);
        return (
          qp(e).forEach((i) => {
            yu(t, i) || t.push(i);
          }),
          t
        );
      }
      function QD(e, n) {
        return qp(n).filter((t) => !yu(e, t));
      }
      class XD {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(n) {
          (this._rawValidators = n || []),
            (this._composedValidatorFn = zp(this._rawValidators));
        }
        _setAsyncValidators(n) {
          (this._rawAsyncValidators = n || []),
            (this._composedAsyncValidatorFn = Wp(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(n) {
          this._onDestroyCallbacks.push(n);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((n) => n()),
            (this._onDestroyCallbacks = []);
        }
        reset(n) {
          this.control && this.control.reset(n);
        }
        hasError(n, t) {
          return !!this.control && this.control.hasError(n, t);
        }
        getError(n, t) {
          return this.control ? this.control.getError(n, t) : null;
        }
      }
      class sn extends XD {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class mi extends XD {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class eC {
        constructor(n) {
          this._cd = n;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let _i = (() => {
          class e extends eC {
            constructor(t) {
              super(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(mi, 2));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (t, r) {
                2 & t &&
                  te("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending);
              },
              features: [Re],
            })),
            e
          );
        })(),
        za = (() => {
          class e extends eC {
            constructor(t) {
              super(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(sn, 10));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (t, r) {
                2 & t &&
                  te("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [Re],
            })),
            e
          );
        })();
      function tC(e, n) {
        return e ? `with name: '${n}'` : `at index: ${n}`;
      }
      const Jp = !1,
        Wa = "VALID",
        Du = "INVALID",
        ss = "PENDING",
        qa = "DISABLED";
      function Zp(e) {
        return (Cu(e) ? e.validators : e) || null;
      }
      function Qp(e, n) {
        return (Cu(n) ? n.asyncValidators : e) || null;
      }
      function Cu(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      class iC {
        constructor(n, t) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(n),
            this._assignAsyncValidators(t);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(n) {
          this._rawValidators = this._composedValidatorFn = n;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(n) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = n;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Wa;
        }
        get invalid() {
          return this.status === Du;
        }
        get pending() {
          return this.status == ss;
        }
        get disabled() {
          return this.status === qa;
        }
        get enabled() {
          return this.status !== qa;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(n) {
          this._assignValidators(n);
        }
        setAsyncValidators(n) {
          this._assignAsyncValidators(n);
        }
        addValidators(n) {
          this.setValidators(ZD(n, this._rawValidators));
        }
        addAsyncValidators(n) {
          this.setAsyncValidators(ZD(n, this._rawAsyncValidators));
        }
        removeValidators(n) {
          this.setValidators(QD(n, this._rawValidators));
        }
        removeAsyncValidators(n) {
          this.setAsyncValidators(QD(n, this._rawAsyncValidators));
        }
        hasValidator(n) {
          return yu(this._rawValidators, n);
        }
        hasAsyncValidator(n) {
          return yu(this._rawAsyncValidators, n);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(n = {}) {
          (this.touched = !0),
            this._parent && !n.onlySelf && this._parent.markAsTouched(n);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((n) => n.markAllAsTouched());
        }
        markAsUntouched(n = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((t) => {
              t.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !n.onlySelf && this._parent._updateTouched(n);
        }
        markAsDirty(n = {}) {
          (this.pristine = !1),
            this._parent && !n.onlySelf && this._parent.markAsDirty(n);
        }
        markAsPristine(n = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((t) => {
              t.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !n.onlySelf && this._parent._updatePristine(n);
        }
        markAsPending(n = {}) {
          (this.status = ss),
            !1 !== n.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !n.onlySelf && this._parent.markAsPending(n);
        }
        disable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = qa),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...n, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== n.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = Wa),
            this._forEachChild((r) => {
              r.enable({ ...n, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: n.emitEvent,
            }),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(n) {
          this._parent &&
            !n.onlySelf &&
            (this._parent.updateValueAndValidity(n),
            n.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(n) {
          this._parent = n;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(n = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Wa || this.status === ss) &&
                this._runAsyncValidator(n.emitEvent)),
            !1 !== n.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !n.onlySelf &&
              this._parent.updateValueAndValidity(n);
        }
        _updateTreeValidity(n = { emitEvent: !0 }) {
          this._forEachChild((t) => t._updateTreeValidity(n)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? qa : Wa;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(n) {
          if (this.asyncValidator) {
            (this.status = ss), (this._hasOwnPendingAsyncValidator = !0);
            const t = $D(this.asyncValidator(this));
            this._asyncValidationSubscription = t.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: n });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(n, t = {}) {
          (this.errors = n), this._updateControlsErrors(!1 !== t.emitEvent);
        }
        get(n) {
          let t = n;
          return null == t ||
            (Array.isArray(t) || (t = t.split(".")), 0 === t.length)
            ? null
            : t.reduce((r, i) => r && r._find(i), this);
        }
        getError(n, t) {
          const r = t ? this.get(t) : this;
          return r && r.errors ? r.errors[n] : null;
        }
        hasError(n, t) {
          return !!this.getError(n, t);
        }
        get root() {
          let n = this;
          for (; n._parent; ) n = n._parent;
          return n;
        }
        _updateControlsErrors(n) {
          (this.status = this._calculateStatus()),
            n && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(n);
        }
        _initObservables() {
          (this.valueChanges = new W()), (this.statusChanges = new W());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? qa
            : this.errors
            ? Du
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(ss)
            ? ss
            : this._anyControlsHaveStatus(Du)
            ? Du
            : Wa;
        }
        _anyControlsHaveStatus(n) {
          return this._anyControls((t) => t.status === n);
        }
        _anyControlsDirty() {
          return this._anyControls((n) => n.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((n) => n.touched);
        }
        _updatePristine(n = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !n.onlySelf && this._parent._updatePristine(n);
        }
        _updateTouched(n = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !n.onlySelf && this._parent._updateTouched(n);
        }
        _registerOnCollectionChange(n) {
          this._onCollectionChange = n;
        }
        _setUpdateStrategy(n) {
          Cu(n) && null != n.updateOn && (this._updateOn = n.updateOn);
        }
        _parentMarkedDirty(n) {
          return (
            !n &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(n) {
          return null;
        }
        _assignValidators(n) {
          (this._rawValidators = Array.isArray(n) ? n.slice() : n),
            (this._composedValidatorFn = (function S2(e) {
              return Array.isArray(e) ? zp(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(n) {
          (this._rawAsyncValidators = Array.isArray(n) ? n.slice() : n),
            (this._composedAsyncValidatorFn = (function M2(e) {
              return Array.isArray(e) ? Wp(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      class Xp extends iC {
        constructor(n, t, r) {
          super(Zp(t), Qp(r, t)),
            (this.controls = n),
            this._initObservables(),
            this._setUpdateStrategy(t),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(n, t) {
          return this.controls[n]
            ? this.controls[n]
            : ((this.controls[n] = t),
              t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange),
              t);
        }
        addControl(n, t, r = {}) {
          this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(n, t = {}) {
          this.controls[n] &&
            this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        setControl(n, t, r = {}) {
          this.controls[n] &&
            this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            t && this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(n) {
          return this.controls.hasOwnProperty(n) && this.controls[n].enabled;
        }
        setValue(n, t = {}) {
          (function rC(e, n, t) {
            e._forEachChild((r, i) => {
              if (void 0 === t[i])
                throw new B(
                  1002,
                  Jp
                    ? (function E2(e, n) {
                        return `Must supply a value for form control ${tC(
                          e,
                          n
                        )}`;
                      })(n, i)
                    : ""
                );
            });
          })(this, !0, n),
            Object.keys(n).forEach((r) => {
              (function nC(e, n, t) {
                const r = e.controls;
                if (!(n ? Object.keys(r) : r).length)
                  throw new B(
                    1e3,
                    Jp
                      ? (function C2(e) {
                          return `\n    There are no form controls registered with this ${
                            e ? "group" : "array"
                          } yet. If you're using ngModel,\n    you may want to check next tick (e.g. use setTimeout).\n  `;
                        })(n)
                      : ""
                  );
                if (!r[t])
                  throw new B(
                    1001,
                    Jp
                      ? (function w2(e, n) {
                          return `Cannot find form control ${tC(e, n)}`;
                        })(n, t)
                      : ""
                  );
              })(this, !0, r),
                this.controls[r].setValue(n[r], {
                  onlySelf: !0,
                  emitEvent: t.emitEvent,
                });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (Object.keys(n).forEach((r) => {
              const i = this.controls[r];
              i && i.patchValue(n[r], { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = {}, t = {}) {
          this._forEachChild((r, i) => {
            r.reset(n[i], { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (n, t, r) => ((n[r] = t.getRawValue()), n)
          );
        }
        _syncPendingControls() {
          let n = this._reduceChildren(
            !1,
            (t, r) => !!r._syncPendingControls() || t
          );
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          Object.keys(this.controls).forEach((t) => {
            const r = this.controls[t];
            r && n(r, t);
          });
        }
        _setUpControls() {
          this._forEachChild((n) => {
            n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(n) {
          for (const [t, r] of Object.entries(this.controls))
            if (this.contains(t) && n(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (t, r, i) => ((r.enabled || this.disabled) && (t[i] = r.value), t)
          );
        }
        _reduceChildren(n, t) {
          let r = n;
          return (
            this._forEachChild((i, o) => {
              r = t(r, i, o);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const n of Object.keys(this.controls))
            if (this.controls[n].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(n) {
          return this.controls.hasOwnProperty(n) ? this.controls[n] : null;
        }
      }
      const as = new z("CallSetDisabledState", {
          providedIn: "root",
          factory: () => wu,
        }),
        wu = "always";
      function Ka(e, n, t = wu) {
        eg(e, n),
          n.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === t) &&
            n.valueAccessor.setDisabledState?.(e.disabled),
          (function I2(e, n) {
            n.valueAccessor.registerOnChange((t) => {
              (e._pendingValue = t),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && oC(e, n);
            });
          })(e, n),
          (function A2(e, n) {
            const t = (r, i) => {
              n.valueAccessor.writeValue(r), i && n.viewToModelUpdate(r);
            };
            e.registerOnChange(t),
              n._registerOnDestroy(() => {
                e._unregisterOnChange(t);
              });
          })(e, n),
          (function O2(e, n) {
            n.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && oC(e, n),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, n),
          (function N2(e, n) {
            if (n.valueAccessor.setDisabledState) {
              const t = (r) => {
                n.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(t),
                n._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(t);
                });
            }
          })(e, n);
      }
      function Mu(e, n) {
        e.forEach((t) => {
          t.registerOnValidatorChange && t.registerOnValidatorChange(n);
        });
      }
      function eg(e, n) {
        const t = (function YD(e) {
          return e._rawValidators;
        })(e);
        null !== n.validator
          ? e.setValidators(KD(t, n.validator))
          : "function" == typeof t && e.setValidators([t]);
        const r = (function JD(e) {
          return e._rawAsyncValidators;
        })(e);
        null !== n.asyncValidator
          ? e.setAsyncValidators(KD(r, n.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const i = () => e.updateValueAndValidity();
        Mu(n._rawValidators, i), Mu(n._rawAsyncValidators, i);
      }
      function oC(e, n) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          n.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      const F2 = { provide: sn, useExisting: oe(() => ji) },
        Ya = (() => Promise.resolve())();
      let ji = (() => {
        class e extends sn {
          constructor(t, r, i) {
            super(),
              (this.callSetDisabledState = i),
              (this.submitted = !1),
              (this._directives = new Set()),
              (this.ngSubmit = new W()),
              (this.form = new Xp({}, zp(t), Wp(r)));
          }
          ngAfterViewInit() {
            this._setUpdateStrategy();
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          get controls() {
            return this.form.controls;
          }
          addControl(t) {
            Ya.then(() => {
              const r = this._findContainer(t.path);
              (t.control = r.registerControl(t.name, t.control)),
                Ka(t.control, t, this.callSetDisabledState),
                t.control.updateValueAndValidity({ emitEvent: !1 }),
                this._directives.add(t);
            });
          }
          getControl(t) {
            return this.form.get(t.path);
          }
          removeControl(t) {
            Ya.then(() => {
              const r = this._findContainer(t.path);
              r && r.removeControl(t.name), this._directives.delete(t);
            });
          }
          addFormGroup(t) {
            Ya.then(() => {
              const r = this._findContainer(t.path),
                i = new Xp({});
              (function sC(e, n) {
                eg(e, n);
              })(i, t),
                r.registerControl(t.name, i),
                i.updateValueAndValidity({ emitEvent: !1 });
            });
          }
          removeFormGroup(t) {
            Ya.then(() => {
              const r = this._findContainer(t.path);
              r && r.removeControl(t.name);
            });
          }
          getFormGroup(t) {
            return this.form.get(t.path);
          }
          updateModel(t, r) {
            Ya.then(() => {
              this.form.get(t.path).setValue(r);
            });
          }
          setValue(t) {
            this.control.setValue(t);
          }
          onSubmit(t) {
            return (
              (this.submitted = !0),
              (function aC(e, n) {
                e._syncPendingControls(),
                  n.forEach((t) => {
                    const r = t.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (t.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this._directives),
              this.ngSubmit.emit(t),
              "dialog" === t?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(t) {
            this.form.reset(t), (this.submitted = !1);
          }
          _setUpdateStrategy() {
            this.options &&
              null != this.options.updateOn &&
              (this.form._updateOn = this.options.updateOn);
          }
          _findContainer(t) {
            return t.pop(), t.length ? this.form.get(t) : this.form;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(Gt, 10), _(gi, 10), _(as, 8));
          }),
          (e.ɵdir = V({
            type: e,
            selectors: [
              ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
              ["ng-form"],
              ["", "ngForm", ""],
            ],
            hostBindings: function (t, r) {
              1 & t &&
                P("submit", function (o) {
                  return r.onSubmit(o);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { options: ["ngFormOptions", "options"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [Fe([F2]), Re],
          })),
          e
        );
      })();
      function lC(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      function cC(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const uC = class extends iC {
          constructor(n = null, t, r) {
            super(Zp(t), Qp(r, t)),
              (this.defaultValue = null),
              (this._onChange = []),
              (this._pendingChange = !1),
              this._applyFormState(n),
              this._setUpdateStrategy(t),
              this._initObservables(),
              this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: !!this.asyncValidator,
              }),
              Cu(t) &&
                (t.nonNullable || t.initialValueIsDefault) &&
                (this.defaultValue = cC(n) ? n.value : n);
          }
          setValue(n, t = {}) {
            (this.value = this._pendingValue = n),
              this._onChange.length &&
                !1 !== t.emitModelToViewChange &&
                this._onChange.forEach((r) =>
                  r(this.value, !1 !== t.emitViewToModelChange)
                ),
              this.updateValueAndValidity(t);
          }
          patchValue(n, t = {}) {
            this.setValue(n, t);
          }
          reset(n = this.defaultValue, t = {}) {
            this._applyFormState(n),
              this.markAsPristine(t),
              this.markAsUntouched(t),
              this.setValue(this.value, t),
              (this._pendingChange = !1);
          }
          _updateValue() {}
          _anyControls(n) {
            return !1;
          }
          _allControlsDisabled() {
            return this.disabled;
          }
          registerOnChange(n) {
            this._onChange.push(n);
          }
          _unregisterOnChange(n) {
            lC(this._onChange, n);
          }
          registerOnDisabledChange(n) {
            this._onDisabledChange.push(n);
          }
          _unregisterOnDisabledChange(n) {
            lC(this._onDisabledChange, n);
          }
          _forEachChild(n) {}
          _syncPendingControls() {
            return !(
              "submit" !== this.updateOn ||
              (this._pendingDirty && this.markAsDirty(),
              this._pendingTouched && this.markAsTouched(),
              !this._pendingChange) ||
              (this.setValue(this._pendingValue, {
                onlySelf: !0,
                emitModelToViewChange: !1,
              }),
              0)
            );
          }
          _applyFormState(n) {
            cC(n)
              ? ((this.value = this._pendingValue = n.value),
                n.disabled
                  ? this.disable({ onlySelf: !0, emitEvent: !1 })
                  : this.enable({ onlySelf: !0, emitEvent: !1 }))
              : (this.value = this._pendingValue = n);
          }
        },
        V2 = { provide: mi, useExisting: oe(() => Kr) },
        hC = (() => Promise.resolve())();
      let Kr = (() => {
          class e extends mi {
            constructor(t, r, i, o, s, a) {
              super(),
                (this._changeDetectorRef = s),
                (this.callSetDisabledState = a),
                (this.control = new uC()),
                (this._registered = !1),
                (this.update = new W()),
                (this._parent = t),
                this._setValidators(r),
                this._setAsyncValidators(i),
                (this.valueAccessor = (function rg(e, n) {
                  if (!n) return null;
                  let t, r, i;
                  return (
                    Array.isArray(n),
                    n.forEach((o) => {
                      o.constructor === Dr
                        ? (t = o)
                        : (function P2(e) {
                            return Object.getPrototypeOf(e.constructor) === Gi;
                          })(o)
                        ? (r = o)
                        : (i = o);
                    }),
                    i || r || t || null
                  );
                })(0, o));
            }
            ngOnChanges(t) {
              if ((this._checkForErrors(), !this._registered || "name" in t)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = t.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in t && this._updateDisabled(t),
                (function ng(e, n) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const t = e.model;
                  return !!t.isFirstChange() || !Object.is(n, t.currentValue);
                })(t, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(t) {
              (this.viewModel = t), this.update.emit(t);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              Ka(this.control, this, this.callSetDisabledState),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(t) {
              hC.then(() => {
                this.control.setValue(t, { emitViewToModelChange: !1 }),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _updateDisabled(t) {
              const r = t.isDisabled.currentValue,
                i = 0 !== r && os(r);
              hC.then(() => {
                i && !this.control.disabled
                  ? this.control.disable()
                  : !i && this.control.disabled && this.control.enable(),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _getPath(t) {
              return this._parent
                ? (function Eu(e, n) {
                    return [...n.path, e];
                  })(t, this._parent)
                : [t];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(
                _(sn, 9),
                _(Gt, 10),
                _(gi, 10),
                _(yn, 10),
                _(_n, 8),
                _(as, 8)
              );
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [Fe([V2]), Re, ot],
            })),
            e
          );
        })(),
        Ja = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            e
          );
        })(),
        gC = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({})),
            e
          );
        })(),
        zi = (() => {
          class e {
            constructor() {
              this._validator = vu;
            }
            ngOnChanges(t) {
              if (this.inputName in t) {
                const r = this.normalizeInput(t[this.inputName].currentValue);
                (this._enabled = this.enabled(r)),
                  (this._validator = this._enabled
                    ? this.createValidator(r)
                    : vu),
                  this._onChange && this._onChange();
              }
            }
            validate(t) {
              return this._validator(t);
            }
            registerOnValidatorChange(t) {
              this._onChange = t;
            }
            enabled(t) {
              return null != t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = V({ type: e, features: [ot] })),
            e
          );
        })();
      const rL = { provide: Gt, useExisting: oe(() => Nu), multi: !0 };
      let Nu = (() => {
          class e extends zi {
            constructor() {
              super(...arguments),
                (this.inputName = "required"),
                (this.normalizeInput = os),
                (this.createValidator = (t) => kD);
            }
            enabled(t) {
              return t;
            }
          }
          return (
            (e.ɵfac = (function () {
              let n;
              return function (r) {
                return (n || (n = st(e)))(r || e);
              };
            })()),
            (e.ɵdir = V({
              type: e,
              selectors: [
                [
                  "",
                  "required",
                  "",
                  "formControlName",
                  "",
                  3,
                  "type",
                  "checkbox",
                ],
                ["", "required", "", "formControl", "", 3, "type", "checkbox"],
                ["", "required", "", "ngModel", "", 3, "type", "checkbox"],
              ],
              hostVars: 1,
              hostBindings: function (t, r) {
                2 & t && ve("required", r._enabled ? "" : null);
              },
              inputs: { required: "required" },
              features: [Fe([rL]), Re],
            })),
            e
          );
        })(),
        cL = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [gC] })),
            e
          );
        })(),
        dL = (() => {
          class e {
            static withConfig(t) {
              return {
                ngModule: e,
                providers: [
                  { provide: as, useValue: t.callSetDisabledState ?? wu },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [cL] })),
            e
          );
        })();
      function gB(e, n) {}
      function mB(e, n) {
        if (
          (1 & e &&
            (p(0, "button", 3), N(1), C(2, gB, 0, 0, "ng-template", 4), m()),
          2 & e)
        ) {
          const t = n.$implicit;
          v("ngbPanelToggle", t),
            g(1),
            Je(" ", t.title, " "),
            g(1),
            v(
              "ngTemplateOutlet",
              null == t.titleTpl ? null : t.titleTpl.templateRef
            );
        }
      }
      function _B(e, n) {}
      function vB(e, n) {}
      function yB(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "div", 8),
            P("ngbRef", function (i) {
              return K(t), Y((M().$implicit.panelDiv = i));
            }),
            p(1, "div", 9),
            C(2, vB, 0, 0, "ng-template", 4),
            m()();
        }
        if (2 & e) {
          const t = M().$implicit;
          Ur("id", t.id),
            ve("aria-labelledby", t.id + "-header"),
            g(2),
            v(
              "ngTemplateOutlet",
              (null == t.contentTpl ? null : t.contentTpl.templateRef) || null
            );
        }
      }
      Math, Math, Math;
      const bB = function (e, n) {
        return { $implicit: e, opened: n };
      };
      function DB(e, n) {
        if (
          (1 & e &&
            (p(0, "div")(1, "div", 5),
            C(2, _B, 0, 0, "ng-template", 6),
            m(),
            C(3, yB, 3, 3, "div", 7),
            m()),
          2 & e)
        ) {
          const t = n.$implicit,
            r = M(),
            i = mn(1);
          ui("accordion-item " + (t.cardClass || "")),
            g(1),
            ui(
              "accordion-header " +
                (t.type ? "bg-" + t.type : r.type ? "bg-" + r.type : "")
            ),
            Pc("id", "", t.id, "-header"),
            g(1),
            v(
              "ngTemplateOutlet",
              (null == t.headerTpl ? null : t.headerTpl.templateRef) || i
            )("ngTemplateOutletContext", Ra(8, bB, t, t.isOpen)),
            g(1),
            v("ngIf", !r.destroyOnHide || t.isOpen || t.transitionRunning);
        }
      }
      function CB(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 1),
            P("click", function () {
              return K(t), Y(M().close());
            }),
            m();
        }
      }
      const xu = ["*"];
      function wB(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 6),
            P("click", function () {
              const o = K(t).$implicit,
                s = M();
              return (
                s.focus(), Y(s.select(o.id, s.NgbSlideEventSource.INDICATOR))
              );
            }),
            m();
        }
        if (2 & e) {
          const t = n.$implicit,
            r = M();
          te("active", t.id === r.activeId),
            ve("aria-labelledby", "slide-" + t.id)(
              "aria-controls",
              "slide-" + t.id
            )("aria-selected", t.id === r.activeId);
        }
      }
      function EB(e, n) {}
      function SB(e, n) {
        if (
          (1 & e &&
            (p(0, "div", 7)(1, "span", 8),
            Ht(2, 9),
            m(),
            C(3, EB, 0, 0, "ng-template", 10),
            m()),
          2 & e)
        ) {
          const t = n.$implicit,
            r = n.index,
            i = n.count;
          v("id", "slide-" + t.id),
            g(2),
            es(r + 1)(i),
            Aa(2),
            g(1),
            v("ngTemplateOutlet", t.tplRef);
        }
      }
      function MB(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 11),
            P("click", function () {
              return K(t), Y(M().arrowLeft());
            }),
            A(1, "span", 12),
            p(2, "span", 8),
            Ht(3, 13),
            m()();
        }
      }
      function TB(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 14),
            P("click", function () {
              return K(t), Y(M().arrowRight());
            }),
            A(1, "span", 15),
            p(2, "span", 8),
            Ht(3, 16),
            m()();
        }
      }
      const NB = ["ngbDatepickerDayView", ""],
        IB = ["month"],
        OB = ["year"];
      function AB(e, n) {
        if ((1 & e && (p(0, "option", 5), N(1), m()), 2 & e)) {
          const t = n.$implicit,
            r = M();
          v("value", t),
            ve("aria-label", r.i18n.getMonthFullName(t, r.date.year)),
            g(1),
            Ue(r.i18n.getMonthShortName(t, r.date.year));
        }
      }
      function RB(e, n) {
        if ((1 & e && (p(0, "option", 5), N(1), m()), 2 & e)) {
          const t = n.$implicit,
            r = M();
          v("value", t), g(1), Ue(r.i18n.getYearNumerals(t));
        }
      }
      function xB(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "ngb-datepicker-navigation-select", 7),
            P("select", function (i) {
              return K(t), Y(M().select.emit(i));
            }),
            m();
        }
        if (2 & e) {
          const t = M();
          v("date", t.date)("disabled", t.disabled)(
            "months",
            t.selectBoxes.months
          )("years", t.selectBoxes.years);
        }
      }
      function PB(e, n) {
        1 & e && A(0, "div", 0);
      }
      function kB(e, n) {
        1 & e && A(0, "div", 0);
      }
      function FB(e, n) {
        if (
          (1 & e &&
            (C(0, PB, 1, 0, "div", 9),
            p(1, "div", 10),
            N(2),
            m(),
            C(3, kB, 1, 0, "div", 9)),
          2 & e)
        ) {
          const t = n.$implicit,
            r = n.index,
            i = M(2);
          v("ngIf", r > 0),
            g(2),
            Je(" ", i.i18n.getMonthLabel(t.firstDate), " "),
            g(1),
            v("ngIf", r !== i.months.length - 1);
        }
      }
      function LB(e, n) {
        1 & e && C(0, FB, 4, 3, "ng-template", 8),
          2 & e && v("ngForOf", M().months);
      }
      function BB(e, n) {
        if ((1 & e && (p(0, "div", 5), N(1), m()), 2 & e)) {
          const t = M(2);
          g(1), Ue(t.i18n.getWeekLabel());
        }
      }
      function VB(e, n) {
        if ((1 & e && (p(0, "div", 6), N(1), m()), 2 & e)) {
          const t = n.$implicit;
          g(1), Ue(t);
        }
      }
      function HB(e, n) {
        if (
          (1 & e &&
            (p(0, "div", 2),
            C(1, BB, 2, 1, "div", 3),
            C(2, VB, 2, 1, "div", 4),
            m()),
          2 & e)
        ) {
          const t = M();
          g(1),
            v("ngIf", t.datepicker.showWeekNumbers),
            g(1),
            v("ngForOf", t.viewModel.weekdays);
        }
      }
      function UB(e, n) {
        if ((1 & e && (p(0, "div", 11), N(1), m()), 2 & e)) {
          const t = M(2).$implicit,
            r = M();
          g(1), Ue(r.i18n.getWeekNumerals(t.number));
        }
      }
      function $B(e, n) {}
      function GB(e, n) {
        if ((1 & e && C(0, $B, 0, 0, "ng-template", 14), 2 & e)) {
          const t = M().$implicit;
          v("ngTemplateOutlet", M(3).datepicker.dayTemplate)(
            "ngTemplateOutletContext",
            t.context
          );
        }
      }
      function jB(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "div", 12),
            P("click", function (i) {
              const s = K(t).$implicit;
              return M(3).doSelect(s), Y(i.preventDefault());
            }),
            C(1, GB, 1, 2, "ng-template", 13),
            m();
        }
        if (2 & e) {
          const t = n.$implicit;
          te("disabled", t.context.disabled)("hidden", t.hidden)(
            "ngb-dp-today",
            t.context.today
          ),
            v("tabindex", t.tabindex),
            ve("aria-label", t.ariaLabel),
            g(1),
            v("ngIf", !t.hidden);
        }
      }
      function zB(e, n) {
        if (
          (1 & e &&
            (p(0, "div", 8),
            C(1, UB, 2, 1, "div", 9),
            C(2, jB, 2, 9, "div", 10),
            m()),
          2 & e)
        ) {
          const t = M().$implicit,
            r = M();
          g(1),
            v("ngIf", r.datepicker.showWeekNumbers),
            g(1),
            v("ngForOf", t.days);
        }
      }
      function WB(e, n) {
        1 & e && C(0, zB, 3, 2, "div", 7),
          2 & e && v("ngIf", !n.$implicit.collapsed);
      }
      const qB = ["defaultDayTemplate"],
        KB = ["content"];
      function YB(e, n) {
        if ((1 & e && A(0, "div", 8), 2 & e)) {
          const r = n.currentMonth,
            i = n.selected,
            o = n.disabled,
            s = n.focused;
          v("date", n.date)("currentMonth", r)("selected", i)("disabled", o)(
            "focused",
            s
          );
        }
      }
      function JB(e, n) {
        if ((1 & e && (p(0, "div", 13), N(1), m()), 2 & e)) {
          const t = M().$implicit,
            r = M(2);
          g(1), Je(" ", r.i18n.getMonthLabel(t.firstDate), " ");
        }
      }
      function ZB(e, n) {
        if (
          (1 & e &&
            (p(0, "div", 10),
            C(1, JB, 2, 1, "div", 11),
            A(2, "ngb-datepicker-month", 12),
            m()),
          2 & e)
        ) {
          const t = n.$implicit,
            r = M(2);
          g(1),
            v(
              "ngIf",
              "none" === r.navigation ||
                (r.displayMonths > 1 && "select" === r.navigation)
            ),
            g(1),
            v("month", t.firstDate);
        }
      }
      function QB(e, n) {
        1 & e && C(0, ZB, 3, 2, "div", 9),
          2 & e && v("ngForOf", M().model.months);
      }
      function XB(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "ngb-datepicker-navigation", 14),
            P("navigate", function (i) {
              return K(t), Y(M().onNavigateEvent(i));
            })("select", function (i) {
              return K(t), Y(M().onNavigateDateSelect(i));
            }),
            m();
        }
        if (2 & e) {
          const t = M();
          v("date", t.model.firstDate)("months", t.model.months)(
            "disabled",
            t.model.disabled
          )("showSelect", "select" === t.model.navigation)(
            "prevDisabled",
            t.model.prevDisabled
          )("nextDisabled", t.model.nextDisabled)(
            "selectBoxes",
            t.model.selectBoxes
          );
        }
      }
      function eV(e, n) {}
      function tV(e, n) {}
      const YC = function (e) {
          return { $implicit: e };
        },
        nV = ["dialog"],
        rV = ["ngbNavOutlet", ""];
      function iV(e, n) {}
      function oV(e, n) {
        if (
          (1 & e && (p(0, "div", 2), C(1, iV, 0, 0, "ng-template", 3), m()),
          2 & e)
        ) {
          const t = M().$implicit,
            r = M();
          v("item", t)("nav", r.nav)("role", r.paneRole),
            g(1),
            v(
              "ngTemplateOutlet",
              (null == t.contentTpl ? null : t.contentTpl.templateRef) || null
            )(
              "ngTemplateOutletContext",
              Ut(5, YC, t.active || r.isPanelTransitioning(t))
            );
        }
      }
      function sV(e, n) {
        if ((1 & e && C(0, oV, 2, 7, "div", 1), 2 & e)) {
          const t = n.$implicit,
            r = M();
          v("ngIf", t.isPanelInDom() || r.isPanelTransitioning(t));
        }
      }
      function aV(e, n) {
        1 & e && (p(0, "span", 9), Ht(1, 10), m());
      }
      function lV(e, n) {
        1 & e && (p(0, "span", 9), Ht(1, 11), m());
      }
      function cV(e, n) {
        1 & e && (p(0, "span", 9), Ht(1, 12), m());
      }
      function uV(e, n) {
        1 & e && (p(0, "span", 9), Ht(1, 13), m());
      }
      function dV(e, n) {
        1 & e && N(0, "...");
      }
      function fV(e, n) {
        1 & e && N(0), 2 & e && Ue(n.$implicit);
      }
      function hV(e, n) {}
      const pV = function (e) {
        return { disabled: !0, currentPage: e };
      };
      function gV(e, n) {
        if (
          (1 & e && (p(0, "a", 18), C(1, hV, 0, 0, "ng-template", 8), m()),
          2 & e)
        ) {
          const t = M(2).$implicit,
            r = M(),
            i = mn(9);
          g(1),
            v(
              "ngTemplateOutlet",
              (null == r.tplEllipsis ? null : r.tplEllipsis.templateRef) || i
            )("ngTemplateOutletContext", Ut(2, pV, t));
        }
      }
      function mV(e, n) {}
      const _V = function (e, n, t) {
        return { disabled: e, $implicit: n, currentPage: t };
      };
      function vV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "a", 19),
            P("click", function (i) {
              K(t);
              const o = M().$implicit;
              return M(2).selectPage(o), Y(i.preventDefault());
            }),
            C(1, mV, 0, 0, "ng-template", 8),
            m();
        }
        if (2 & e) {
          const t = M().$implicit,
            r = M(),
            i = r.disabled,
            o = r.$implicit,
            s = M(),
            a = mn(11);
          ve("tabindex", i ? "-1" : null)("aria-disabled", i ? "true" : null),
            g(1),
            v(
              "ngTemplateOutlet",
              (null == s.tplNumber ? null : s.tplNumber.templateRef) || a
            )("ngTemplateOutletContext", Fh(4, _V, i, t, o));
        }
      }
      function yV(e, n) {
        if (
          (1 & e &&
            (p(0, "li", 15),
            C(1, gV, 2, 4, "a", 16),
            C(2, vV, 2, 8, "a", 17),
            m()),
          2 & e)
        ) {
          const t = n.$implicit,
            r = M(),
            i = r.$implicit,
            o = r.disabled,
            s = M();
          te("active", t === i)("disabled", s.isEllipsis(t) || o),
            ve("aria-current", t === i ? "page" : null),
            g(1),
            v("ngIf", s.isEllipsis(t)),
            g(1),
            v("ngIf", !s.isEllipsis(t));
        }
      }
      function bV(e, n) {
        1 & e && C(0, yV, 3, 7, "li", 14), 2 & e && v("ngForOf", n.pages);
      }
      function DV(e, n) {}
      const yg = function (e, n) {
        return { disabled: e, currentPage: n };
      };
      function CV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "li", 15)(1, "a", 20),
            P("click", function (i) {
              return K(t), M().selectPage(1), Y(i.preventDefault());
            }),
            C(2, DV, 0, 0, "ng-template", 8),
            m()();
        }
        if (2 & e) {
          const t = M(),
            r = mn(1);
          te("disabled", t.previousDisabled()),
            g(1),
            ve("tabindex", t.previousDisabled() ? "-1" : null)(
              "aria-disabled",
              t.previousDisabled() ? "true" : null
            ),
            g(1),
            v(
              "ngTemplateOutlet",
              (null == t.tplFirst ? null : t.tplFirst.templateRef) || r
            )(
              "ngTemplateOutletContext",
              Ra(6, yg, t.previousDisabled(), t.page)
            );
        }
      }
      function wV(e, n) {}
      const EV = function (e) {
        return { disabled: e };
      };
      function SV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "li", 15)(1, "a", 21),
            P("click", function (i) {
              K(t);
              const o = M();
              return o.selectPage(o.page - 1), Y(i.preventDefault());
            }),
            C(2, wV, 0, 0, "ng-template", 8),
            m()();
        }
        if (2 & e) {
          const t = M(),
            r = mn(3);
          te("disabled", t.previousDisabled()),
            g(1),
            ve("tabindex", t.previousDisabled() ? "-1" : null)(
              "aria-disabled",
              t.previousDisabled() ? "true" : null
            ),
            g(1),
            v(
              "ngTemplateOutlet",
              (null == t.tplPrevious ? null : t.tplPrevious.templateRef) || r
            )("ngTemplateOutletContext", Ut(6, EV, t.previousDisabled()));
        }
      }
      function MV(e, n) {}
      function TV(e, n) {}
      function NV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "li", 15)(1, "a", 22),
            P("click", function (i) {
              K(t);
              const o = M();
              return o.selectPage(o.page + 1), Y(i.preventDefault());
            }),
            C(2, TV, 0, 0, "ng-template", 8),
            m()();
        }
        if (2 & e) {
          const t = M(),
            r = mn(5);
          te("disabled", t.nextDisabled()),
            g(1),
            ve("tabindex", t.nextDisabled() ? "-1" : null)(
              "aria-disabled",
              t.nextDisabled() ? "true" : null
            ),
            g(1),
            v(
              "ngTemplateOutlet",
              (null == t.tplNext ? null : t.tplNext.templateRef) || r
            )("ngTemplateOutletContext", Ra(6, yg, t.nextDisabled(), t.page));
        }
      }
      function IV(e, n) {}
      function OV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "li", 15)(1, "a", 23),
            P("click", function (i) {
              K(t);
              const o = M();
              return o.selectPage(o.pageCount), Y(i.preventDefault());
            }),
            C(2, IV, 0, 0, "ng-template", 8),
            m()();
        }
        if (2 & e) {
          const t = M(),
            r = mn(7);
          te("disabled", t.nextDisabled()),
            g(1),
            ve("tabindex", t.nextDisabled() ? "-1" : null)(
              "aria-disabled",
              t.nextDisabled() ? "true" : null
            ),
            g(1),
            v(
              "ngTemplateOutlet",
              (null == t.tplLast ? null : t.tplLast.templateRef) || r
            )("ngTemplateOutletContext", Ra(6, yg, t.nextDisabled(), t.page));
        }
      }
      const AV = function (e, n, t) {
        return { $implicit: e, pages: n, disabled: t };
      };
      function PV(e, n) {
        if ((1 & e && (p(0, "span"), Ht(1, 1), tr(2, "percent"), m()), 2 & e)) {
          const t = M();
          g(2),
            es(
              (function yb(e, n, t) {
                const r = e + Ye,
                  i = x(),
                  o = wo(i, r);
                return Pa(i, r)
                  ? pb(i, en(), n, o.transform, t, o)
                  : o.transform(t);
              })(2, 1, t.getValue() / t.max)
            ),
            Aa(1);
        }
      }
      function kV(e, n) {
        1 & e && N(0), 2 & e && Ue(100 === n.fill ? "\u2605" : "\u2606");
      }
      function FV(e, n) {}
      function LV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "span", 2),
            N(1),
            m(),
            p(2, "span", 3),
            P("mouseenter", function () {
              const o = K(t).index;
              return Y(M().enter(o + 1));
            })("click", function () {
              const o = K(t).index;
              return Y(M().handleClick(o + 1));
            }),
            C(3, FV, 0, 0, "ng-template", 4),
            m();
        }
        if (2 & e) {
          const t = n.index,
            r = M(),
            i = mn(1);
          g(1),
            Je("(", t < r.nextRate ? "*" : " ", ")"),
            g(1),
            Zo("cursor", r.isInteractive() ? "pointer" : "default"),
            g(1),
            v(
              "ngTemplateOutlet",
              r.starTemplate || r.starTemplateFromContent || i
            )("ngTemplateOutletContext", r.contexts[t]);
        }
      }
      function BV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 11),
            P("click", function () {
              K(t);
              const i = M();
              return Y(i.changeHour(i.hourStep));
            }),
            A(1, "span", 12),
            p(2, "span", 13),
            Ht(3, 14),
            m()();
        }
        if (2 & e) {
          const t = M();
          te("btn-sm", t.isSmallSize)("btn-lg", t.isLargeSize)(
            "disabled",
            t.disabled
          ),
            v("disabled", t.disabled);
        }
      }
      function VV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 11),
            P("click", function () {
              K(t);
              const i = M();
              return Y(i.changeHour(-i.hourStep));
            }),
            A(1, "span", 15),
            p(2, "span", 13),
            Ht(3, 16),
            m()();
        }
        if (2 & e) {
          const t = M();
          te("btn-sm", t.isSmallSize)("btn-lg", t.isLargeSize)(
            "disabled",
            t.disabled
          ),
            v("disabled", t.disabled);
        }
      }
      function HV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 11),
            P("click", function () {
              K(t);
              const i = M();
              return Y(i.changeMinute(i.minuteStep));
            }),
            A(1, "span", 12),
            p(2, "span", 13),
            Ht(3, 17),
            m()();
        }
        if (2 & e) {
          const t = M();
          te("btn-sm", t.isSmallSize)("btn-lg", t.isLargeSize)(
            "disabled",
            t.disabled
          ),
            v("disabled", t.disabled);
        }
      }
      function UV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 11),
            P("click", function () {
              K(t);
              const i = M();
              return Y(i.changeMinute(-i.minuteStep));
            }),
            A(1, "span", 15),
            p(2, "span", 13),
            Ht(3, 18),
            m()();
        }
        if (2 & e) {
          const t = M();
          te("btn-sm", t.isSmallSize)("btn-lg", t.isLargeSize)(
            "disabled",
            t.disabled
          ),
            v("disabled", t.disabled);
        }
      }
      function $V(e, n) {
        1 & e && (p(0, "div", 5), N(1, ":"), m());
      }
      function GV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 11),
            P("click", function () {
              K(t);
              const i = M(2);
              return Y(i.changeSecond(i.secondStep));
            }),
            A(1, "span", 12),
            p(2, "span", 13),
            Ht(3, 21),
            m()();
        }
        if (2 & e) {
          const t = M(2);
          te("btn-sm", t.isSmallSize)("btn-lg", t.isLargeSize)(
            "disabled",
            t.disabled
          ),
            v("disabled", t.disabled);
        }
      }
      function jV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 11),
            P("click", function () {
              K(t);
              const i = M(2);
              return Y(i.changeSecond(-i.secondStep));
            }),
            A(1, "span", 15),
            p(2, "span", 13),
            Ht(3, 22),
            m()();
        }
        if (2 & e) {
          const t = M(2);
          te("btn-sm", t.isSmallSize)("btn-lg", t.isLargeSize)(
            "disabled",
            t.disabled
          ),
            v("disabled", t.disabled);
        }
      }
      function zV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "div", 19),
            C(1, GV, 4, 7, "button", 3),
            p(2, "input", 20),
            P("change", function (i) {
              return K(t), Y(M().updateSecond(i.target.value));
            })("blur", function () {
              return K(t), Y(M().handleBlur());
            })("input", function (i) {
              return K(t), Y(M().formatInput(i.target));
            })("keydown.ArrowUp", function (i) {
              K(t);
              const o = M();
              return o.changeSecond(o.secondStep), Y(i.preventDefault());
            })("keydown.ArrowDown", function (i) {
              K(t);
              const o = M();
              return o.changeSecond(-o.secondStep), Y(i.preventDefault());
            }),
            m(),
            C(3, jV, 4, 7, "button", 3),
            m();
        }
        if (2 & e) {
          const t = M();
          g(1),
            v("ngIf", t.spinners),
            g(1),
            te("form-control-sm", t.isSmallSize)(
              "form-control-lg",
              t.isLargeSize
            ),
            v("value", t.formatMinSec(null == t.model ? null : t.model.second))(
              "readOnly",
              t.readonlyInputs
            )("disabled", t.disabled),
            g(1),
            v("ngIf", t.spinners);
        }
      }
      function WV(e, n) {
        1 & e && A(0, "div", 5);
      }
      function qV(e, n) {
        if ((1 & e && (re(0), Ht(1, 27), ie()), 2 & e)) {
          const t = M(2);
          g(1), es(t.i18n.getAfternoonPeriod()), Aa(1);
        }
      }
      function KV(e, n) {
        1 & e && Ht(0, 28), 2 & e && (es(M(2).i18n.getMorningPeriod()), Aa(0));
      }
      function YV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "div", 23)(1, "button", 24),
            P("click", function () {
              return K(t), Y(M().toggleMeridian());
            }),
            C(2, qV, 2, 1, "ng-container", 25),
            C(3, KV, 1, 1, "ng-template", null, 26, rn),
            m()();
        }
        if (2 & e) {
          const t = mn(4),
            r = M();
          g(1),
            te("btn-sm", r.isSmallSize)("btn-lg", r.isLargeSize)(
              "disabled",
              r.disabled
            ),
            v("disabled", r.disabled),
            g(1),
            v("ngIf", r.model && r.model.hour >= 12)("ngIfElse", t);
        }
      }
      function JV(e, n) {
        if ((1 & e && (p(0, "strong", 3), N(1), m()), 2 & e)) {
          const t = M();
          g(1), Ue(t.header);
        }
      }
      function ZV(e, n) {}
      function QV(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "div", 4),
            C(1, ZV, 0, 0, "ng-template", 5),
            p(2, "button", 6),
            P("click", function () {
              return K(t), Y(M().hide());
            }),
            m()();
        }
        if (2 & e) {
          const t = M(),
            r = mn(1);
          g(1), v("ngTemplateOutlet", t.contentHeaderTpl || r);
        }
      }
      function XV(e, n) {
        if ((1 & e && (p(0, "span"), N(1), m()), 2 & e)) {
          const t = M().$implicit;
          ui(M().highlightClass), g(1), Ue(t);
        }
      }
      function eH(e, n) {
        1 & e && N(0), 2 & e && Ue(M().$implicit);
      }
      function tH(e, n) {
        if (
          (1 & e &&
            (C(0, XV, 2, 3, "span", 1),
            C(1, eH, 1, 1, "ng-template", null, 2, rn)),
          2 & e)
        ) {
          const t = n.odd,
            r = mn(2);
          v("ngIf", t)("ngIfElse", r);
        }
      }
      function jt(e) {
        return parseInt(`${e}`, 10);
      }
      function JC(e) {
        return null != e ? `${e}` : "";
      }
      function Pu(e, n, t = 0) {
        return Math.max(Math.min(e, n), t);
      }
      function fs(e) {
        return "string" == typeof e;
      }
      function ut(e) {
        return !isNaN(jt(e));
      }
      function rt(e) {
        return "number" == typeof e && isFinite(e) && Math.floor(e) === e;
      }
      function Ki(e) {
        return null != e;
      }
      function hs(e) {
        return ut(e) ? `0${e}`.slice(-2) : "";
      }
      function QC(e, n) {
        return (
          e &&
          e.className &&
          e.className.split &&
          e.className.split(/\s+/).indexOf(n) >= 0
        );
      }
      function ps(e) {
        return (e || document.body).getBoundingClientRect();
      }
      function XC(e) {
        return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
      const ew = { animation: !0, transitionTimerDelayMs: 5 },
        lH = () => {},
        { transitionTimerDelayMs: cH } = ew,
        rl = new Map(),
        Rt = (e, n, t, r) => {
          let i = r.context || {};
          const o = rl.get(n);
          if (o)
            switch (r.runningTransition) {
              case "continue":
                return kn;
              case "stop":
                e.run(() => o.transition$.complete()),
                  (i = Object.assign(o.context, i)),
                  rl.delete(n);
            }
          const s = t(n, r.animation, i) || lH;
          if (
            !r.animation ||
            "none" === window.getComputedStyle(n).transitionProperty
          )
            return (
              e.run(() => s()),
              q(void 0).pipe(
                (function sH(e) {
                  return (n) =>
                    new Me((t) =>
                      n.subscribe({
                        next: (s) => e.run(() => t.next(s)),
                        error: (s) => e.run(() => t.error(s)),
                        complete: () => e.run(() => t.complete()),
                      })
                    );
                })(e)
              )
            );
          const a = new Pe(),
            l = new Pe(),
            c = a.pipe(
              (function s2(...e) {
                return (n) => ja(n, q(...e));
              })(!0)
            );
          rl.set(n, {
            transition$: a,
            complete: () => {
              l.next(), l.complete();
            },
            context: i,
          });
          const u = (function aH(e) {
            const { transitionDelay: n, transitionDuration: t } =
              window.getComputedStyle(e);
            return 1e3 * (parseFloat(n) + parseFloat(t));
          })(n);
          return (
            e.runOutsideAngular(() => {
              const d = $t(n, "transitionend").pipe(
                ct(c),
                At(({ target: h }) => h === n)
              );
              (function ED(...e) {
                return 1 === (e = wD(e)).length
                  ? Et(e[0])
                  : new Me(
                      (function QF(e) {
                        return (n) => {
                          let t = [];
                          for (let r = 0; t && !n.closed && r < e.length; r++)
                            t.push(
                              Et(e[r]).subscribe(
                                Be(n, (i) => {
                                  if (t) {
                                    for (let o = 0; o < t.length; o++)
                                      o !== r && t[o].unsubscribe();
                                    t = null;
                                  }
                                  n.next(i);
                                })
                              )
                            );
                        };
                      })(e)
                    );
              })(Up(u + cH).pipe(ct(c)), d, l)
                .pipe(ct(c))
                .subscribe(() => {
                  rl.delete(n),
                    e.run(() => {
                      s(), a.next(), a.complete();
                    });
                });
            }),
            a.asObservable()
          );
        },
        bg = (e, n, t) => {
          let { direction: r, maxSize: i, dimension: o } = t;
          const { classList: s } = e;
          function a() {
            s.add("collapse"), "show" === r ? s.add("show") : s.remove("show");
          }
          if (n)
            return (
              i ||
                ((i = (function dH(e, n) {
                  if (typeof navigator > "u") return "0px";
                  const { classList: t } = e,
                    r = t.contains("show");
                  r || t.add("show"), (e.style[n] = "");
                  const i = e.getBoundingClientRect()[n] + "px";
                  return r || t.remove("show"), i;
                })(e, o)),
                (t.maxSize = i),
                (e.style[o] = "show" !== r ? i : "0px"),
                s.remove("collapse"),
                s.remove("collapsing"),
                s.remove("show"),
                ps(e),
                s.add("collapsing")),
              (e.style[o] = "show" === r ? i : "0px"),
              () => {
                a(), s.remove("collapsing"), (e.style[o] = "");
              }
            );
          a();
        };
      let Yi = (() => {
          class e {
            constructor() {
              this.animation = ew.animation;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        tw = (() => {
          class e {
            constructor(t) {
              (this._ngbConfig = t), (this.closeOthers = !1);
            }
            get animation() {
              return void 0 === this._animation
                ? this._ngbConfig.animation
                : this._animation;
            }
            set animation(t) {
              this._animation = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Yi));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        fH = 0,
        Dg = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPanelHeader", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        nw = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPanelTitle", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        rw = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPanelContent", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        Cg = (() => {
          class e {
            constructor() {
              (this.disabled = !1),
                (this.id = "ngb-panel-" + fH++),
                (this.isOpen = !1),
                (this.initClassDone = !1),
                (this.transitionRunning = !1),
                (this.shown = new W()),
                (this.hidden = new W());
            }
            ngAfterContentChecked() {
              (this.titleTpl = this.titleTpls.first),
                (this.headerTpl = this.headerTpls.first),
                (this.contentTpl = this.contentTpls.first);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ngb-panel"]],
              contentQueries: function (t, r, i) {
                if (
                  (1 & t && (je(i, nw, 4), je(i, Dg, 4), je(i, rw, 4)), 2 & t)
                ) {
                  let o;
                  we((o = Ee())) && (r.titleTpls = o),
                    we((o = Ee())) && (r.headerTpls = o),
                    we((o = Ee())) && (r.contentTpls = o);
                }
              },
              inputs: {
                disabled: "disabled",
                id: "id",
                title: "title",
                type: "type",
                cardClass: "cardClass",
              },
              outputs: { shown: "shown", hidden: "hidden" },
              standalone: !0,
            })),
            e
          );
        })(),
        hH = (() => {
          class e {
            constructor(t) {
              (this._El = t), (this.ngbRef = new W());
            }
            ngOnInit() {
              this.ngbRef.emit(this._El.nativeElement);
            }
            ngOnDestroy() {
              this.ngbRef.emit(null);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(De));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["", "ngbRef", ""]],
              outputs: { ngbRef: "ngbRef" },
              standalone: !0,
            })),
            e
          );
        })(),
        iw = (() => {
          class e {
            constructor(t, r) {
              (this.accordion = t), (this.panel = r);
            }
            set ngbPanelToggle(t) {
              t && (this.panel = t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(oe(() => wg)), _(Cg, 9));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["button", "ngbPanelToggle", ""]],
              hostAttrs: ["type", "button"],
              hostVars: 5,
              hostBindings: function (t, r) {
                1 & t &&
                  P("click", function () {
                    return r.accordion.toggle(r.panel.id);
                  }),
                  2 & t &&
                    (Tn("disabled", r.panel.disabled),
                    ve("aria-expanded", r.panel.isOpen)(
                      "aria-controls",
                      r.panel.id
                    ),
                    te("collapsed", !r.panel.isOpen));
              },
              inputs: { ngbPanelToggle: "ngbPanelToggle" },
              standalone: !0,
            })),
            e
          );
        })(),
        wg = (() => {
          class e {
            constructor(t, r, i) {
              (this._ngZone = r),
                (this._changeDetector = i),
                (this.activeIds = []),
                (this.destroyOnHide = !0),
                (this.panelChange = new W()),
                (this.shown = new W()),
                (this.hidden = new W()),
                (this.animation = t.animation),
                (this.type = t.type),
                (this.closeOtherPanels = t.closeOthers);
            }
            isExpanded(t) {
              return this.activeIds.indexOf(t) > -1;
            }
            expand(t) {
              this._changeOpenState(this._findPanelById(t), !0);
            }
            expandAll() {
              this.closeOtherPanels
                ? 0 === this.activeIds.length &&
                  this.panels.length &&
                  this._changeOpenState(this.panels.first, !0)
                : this.panels.forEach((t) => this._changeOpenState(t, !0));
            }
            collapse(t) {
              this._changeOpenState(this._findPanelById(t), !1);
            }
            collapseAll() {
              this.panels.forEach((t) => {
                this._changeOpenState(t, !1);
              });
            }
            toggle(t) {
              const r = this._findPanelById(t);
              r && this._changeOpenState(r, !r.isOpen);
            }
            ngAfterContentChecked() {
              fs(this.activeIds) &&
                (this.activeIds = this.activeIds.split(/\s*,\s*/)),
                this.panels.forEach((t) => {
                  t.isOpen = !t.disabled && this.activeIds.indexOf(t.id) > -1;
                }),
                this.activeIds.length > 1 &&
                  this.closeOtherPanels &&
                  (this._closeOthers(this.activeIds[0], !1),
                  this._updateActiveIds()),
                this._ngZone.onStable.pipe(bt(1)).subscribe(() => {
                  this.panels.forEach((t) => {
                    const r = t.panelDiv;
                    r
                      ? t.initClassDone ||
                        ((t.initClassDone = !0),
                        Rt(this._ngZone, r, bg, {
                          animation: !1,
                          runningTransition: "continue",
                          context: {
                            direction: t.isOpen ? "show" : "hide",
                            dimension: "height",
                          },
                        }))
                      : (t.initClassDone = !1);
                  });
                });
            }
            _changeOpenState(t, r) {
              if (null != t && !t.disabled && t.isOpen !== r) {
                let i = !1;
                this.panelChange.emit({
                  panelId: t.id,
                  nextState: r,
                  preventDefault: () => {
                    i = !0;
                  },
                }),
                  i ||
                    ((t.isOpen = r),
                    (t.transitionRunning = !0),
                    r && this.closeOtherPanels && this._closeOthers(t.id),
                    this._updateActiveIds(),
                    this._runTransitions(this.animation));
              }
            }
            _closeOthers(t, r = !0) {
              this.panels.forEach((i) => {
                i.id !== t &&
                  i.isOpen &&
                  ((i.isOpen = !1), (i.transitionRunning = r));
              });
            }
            _findPanelById(t) {
              return this.panels.find((r) => r.id === t) || null;
            }
            _updateActiveIds() {
              this.activeIds = this.panels
                .filter((t) => t.isOpen && !t.disabled)
                .map((t) => t.id);
            }
            _runTransitions(t) {
              this._changeDetector.detectChanges(),
                this.panels.forEach((r) => {
                  r.transitionRunning &&
                    Rt(this._ngZone, r.panelDiv, bg, {
                      animation: t,
                      runningTransition: "stop",
                      context: {
                        direction: r.isOpen ? "show" : "hide",
                        dimension: "height",
                      },
                    }).subscribe(() => {
                      r.transitionRunning = !1;
                      const { id: o } = r;
                      r.isOpen
                        ? (r.shown.emit(), this.shown.emit(o))
                        : (r.hidden.emit(), this.hidden.emit(o));
                    });
                });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(tw), _(Ce), _(_n));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-accordion"]],
              contentQueries: function (t, r, i) {
                if ((1 & t && je(i, Cg, 4), 2 & t)) {
                  let o;
                  we((o = Ee())) && (r.panels = o);
                }
              },
              hostAttrs: ["role", "tablist", 1, "accordion"],
              hostVars: 1,
              hostBindings: function (t, r) {
                2 & t && ve("aria-multiselectable", !r.closeOtherPanels);
              },
              inputs: {
                animation: "animation",
                activeIds: "activeIds",
                closeOtherPanels: ["closeOthers", "closeOtherPanels"],
                destroyOnHide: "destroyOnHide",
                type: "type",
              },
              outputs: {
                panelChange: "panelChange",
                shown: "shown",
                hidden: "hidden",
              },
              exportAs: ["ngbAccordion"],
              standalone: !0,
              features: [Nt],
              decls: 3,
              vars: 1,
              consts: [
                ["ngbPanelHeader", ""],
                ["t", ""],
                ["ngFor", "", 3, "ngForOf"],
                [1, "accordion-button", 3, "ngbPanelToggle"],
                [3, "ngTemplateOutlet"],
                ["role", "tab", 3, "id"],
                [3, "ngTemplateOutlet", "ngTemplateOutletContext"],
                ["role", "tabpanel", 3, "id", "ngbRef", 4, "ngIf"],
                ["role", "tabpanel", 3, "id", "ngbRef"],
                [1, "accordion-body"],
              ],
              template: function (t, r) {
                1 & t &&
                  (C(0, mB, 3, 3, "ng-template", 0, 1, rn),
                  C(2, DB, 4, 11, "ng-template", 2)),
                  2 & t && (g(2), v("ngForOf", r.panels));
              },
              dependencies: [Zt, qr, iw, hH, Dg, kt],
              encapsulation: 2,
            })),
            e
          );
        })(),
        lw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [wg] })),
            e
          );
        })();
      const yH = ({ classList: e }) => {
        e.remove("show");
      };
      let bH = (() => {
          class e {
            constructor(t) {
              (this._ngbConfig = t),
                (this.dismissible = !0),
                (this.type = "warning");
            }
            get animation() {
              return void 0 === this._animation
                ? this._ngbConfig.animation
                : this._animation;
            }
            set animation(t) {
              this._animation = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Yi));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        DH = (() => {
          class e {
            constructor(t, r, i, o) {
              (this._renderer = r),
                (this._element = i),
                (this._zone = o),
                (this.closed = new W()),
                (this.dismissible = t.dismissible),
                (this.type = t.type),
                (this.animation = t.animation);
            }
            close() {
              const t = Rt(this._zone, this._element.nativeElement, yH, {
                animation: this.animation,
                runningTransition: "continue",
              });
              return t.subscribe(() => this.closed.emit()), t;
            }
            ngOnChanges(t) {
              const r = t.type;
              r &&
                !r.firstChange &&
                (this._renderer.removeClass(
                  this._element.nativeElement,
                  `alert-${r.previousValue}`
                ),
                this._renderer.addClass(
                  this._element.nativeElement,
                  `alert-${r.currentValue}`
                ));
            }
            ngOnInit() {
              this._renderer.addClass(
                this._element.nativeElement,
                `alert-${this.type}`
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(bH), _(pn), _(De), _(Ce));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-alert"]],
              hostAttrs: ["role", "alert", 1, "alert", "show"],
              hostVars: 4,
              hostBindings: function (t, r) {
                2 & t &&
                  te("fade", r.animation)("alert-dismissible", r.dismissible);
              },
              inputs: {
                animation: "animation",
                dismissible: "dismissible",
                type: "type",
              },
              outputs: { closed: "closed" },
              exportAs: ["ngbAlert"],
              standalone: !0,
              features: [ot, Nt],
              ngContentSelectors: xu,
              decls: 2,
              vars: 1,
              consts: function () {
                let n;
                return (
                  (n = $localize`:@@ngb.alert.close:Close`),
                  [
                    [
                      "type",
                      "button",
                      "class",
                      "btn-close",
                      "aria-label",
                      n,
                      3,
                      "click",
                      4,
                      "ngIf",
                    ],
                    [
                      "type",
                      "button",
                      "aria-label",
                      n,
                      1,
                      "btn-close",
                      3,
                      "click",
                    ],
                  ]
                );
              },
              template: function (t, r) {
                1 & t && (wa(), Ea(0), C(1, CB, 1, 0, "button", 0)),
                  2 & t && (g(1), v("ngIf", r.dismissible));
              },
              dependencies: [kt],
              styles: ["ngb-alert{display:block}\n"],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })(),
        cw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [DH] })),
            e
          );
        })();
      var yi = (() => {
        return ((e = yi || (yi = {})).START = "start"), (e.END = "end"), yi;
        var e;
      })();
      const uw = ({ classList: e }) =>
          e.contains("carousel-item-start") || e.contains("carousel-item-end"),
        il = (e) => {
          e.remove("carousel-item-start"), e.remove("carousel-item-end");
        },
        ku = (e) => {
          il(e), e.remove("carousel-item-prev"), e.remove("carousel-item-next");
        },
        CH = (e, n, { direction: t }) => {
          const { classList: r } = e;
          return n
            ? (uw(e)
                ? il(r)
                : (r.add("carousel-item-" + (t === yi.START ? "next" : "prev")),
                  ps(e),
                  r.add("carousel-item-" + t)),
              () => {
                ku(r), r.add("active");
              })
            : (il(r), ku(r), void r.add("active"));
        },
        wH = (e, n, { direction: t }) => {
          const { classList: r } = e;
          return n
            ? (uw(e) ? il(r) : r.add("carousel-item-" + t),
              () => {
                ku(r), r.remove("active");
              })
            : (il(r), ku(r), void r.remove("active"));
        };
      let EH = (() => {
          class e {
            constructor(t) {
              (this._ngbConfig = t),
                (this.interval = 5e3),
                (this.wrap = !0),
                (this.keyboard = !0),
                (this.pauseOnHover = !0),
                (this.pauseOnFocus = !0),
                (this.showNavigationArrows = !0),
                (this.showNavigationIndicators = !0);
            }
            get animation() {
              return void 0 === this._animation
                ? this._ngbConfig.animation
                : this._animation;
            }
            set animation(t) {
              this._animation = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Yi));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        SH = 0,
        MH = (() => {
          class e {
            constructor(t) {
              (this.tplRef = t),
                (this.id = "ngb-slide-" + SH++),
                (this.slid = new W());
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbSlide", ""]],
              inputs: { id: "id" },
              outputs: { slid: "slid" },
              standalone: !0,
            })),
            e
          );
        })(),
        TH = (() => {
          class e {
            constructor(t, r, i, o, s) {
              (this._platformId = r),
                (this._ngZone = i),
                (this._cd = o),
                (this._container = s),
                (this.NgbSlideEventSource = Zi),
                (this._destroy$ = new Pe()),
                (this._interval$ = new Ot(0)),
                (this._mouseHover$ = new Ot(!1)),
                (this._focused$ = new Ot(!1)),
                (this._pauseOnHover$ = new Ot(!1)),
                (this._pauseOnFocus$ = new Ot(!1)),
                (this._pause$ = new Ot(!1)),
                (this._wrap$ = new Ot(!1)),
                (this.slide = new W()),
                (this.slid = new W()),
                (this._transitionIds = null),
                (this.animation = t.animation),
                (this.interval = t.interval),
                (this.wrap = t.wrap),
                (this.keyboard = t.keyboard),
                (this.pauseOnHover = t.pauseOnHover),
                (this.pauseOnFocus = t.pauseOnFocus),
                (this.showNavigationArrows = t.showNavigationArrows),
                (this.showNavigationIndicators = t.showNavigationIndicators);
            }
            set interval(t) {
              this._interval$.next(t);
            }
            get interval() {
              return this._interval$.value;
            }
            set wrap(t) {
              this._wrap$.next(t);
            }
            get wrap() {
              return this._wrap$.value;
            }
            set pauseOnHover(t) {
              this._pauseOnHover$.next(t);
            }
            get pauseOnHover() {
              return this._pauseOnHover$.value;
            }
            set pauseOnFocus(t) {
              this._pauseOnFocus$.next(t);
            }
            get pauseOnFocus() {
              return this._pauseOnFocus$.value;
            }
            set mouseHover(t) {
              this._mouseHover$.next(t);
            }
            get mouseHover() {
              return this._mouseHover$.value;
            }
            set focused(t) {
              this._focused$.next(t);
            }
            get focused() {
              return this._focused$.value;
            }
            arrowLeft() {
              this.focus(), this.prev(Zi.ARROW_LEFT);
            }
            arrowRight() {
              this.focus(), this.next(Zi.ARROW_RIGHT);
            }
            ngAfterContentInit() {
              (function Rk(e) {
                return e === q0;
              })(this._platformId) &&
                this._ngZone.runOutsideAngular(() => {
                  const t = gu([
                    this.slide.pipe(
                      Z((r) => r.current),
                      _u(this.activeId)
                    ),
                    this._wrap$,
                    this.slides.changes.pipe(_u(null)),
                  ]).pipe(
                    Z(([r, i]) => {
                      const o = this.slides.toArray(),
                        s = this._getSlideIdxById(r);
                      return i ? o.length > 1 : s < o.length - 1;
                    }),
                    $p()
                  );
                  gu([
                    this._pause$,
                    this._pauseOnHover$,
                    this._mouseHover$,
                    this._pauseOnFocus$,
                    this._focused$,
                    this._interval$,
                    t,
                  ])
                    .pipe(
                      Z(([r, i, o, s, a, l, c]) =>
                        r || (i && o) || (s && a) || !c ? 0 : l
                      ),
                      $p(),
                      zn((r) => (r > 0 ? Up(r, r) : ND)),
                      ct(this._destroy$)
                    )
                    .subscribe(() =>
                      this._ngZone.run(() => this.next(Zi.TIMER))
                    );
                }),
                this.slides.changes.pipe(ct(this._destroy$)).subscribe(() => {
                  this._transitionIds?.forEach((t) =>
                    ((e) => {
                      rl.get(e)?.complete();
                    })(this._getSlideElement(t))
                  ),
                    (this._transitionIds = null),
                    this._cd.markForCheck(),
                    this._ngZone.onStable.pipe(bt(1)).subscribe(() => {
                      for (const { id: t } of this.slides) {
                        const r = this._getSlideElement(t);
                        t === this.activeId
                          ? r.classList.add("active")
                          : r.classList.remove("active");
                      }
                    });
                });
            }
            ngAfterContentChecked() {
              let t = this._getSlideById(this.activeId);
              this.activeId = t
                ? t.id
                : this.slides.length
                ? this.slides.first.id
                : "";
            }
            ngAfterViewInit() {
              if (this.activeId) {
                const t = this._getSlideElement(this.activeId);
                t && t.classList.add("active");
              }
            }
            ngOnDestroy() {
              this._destroy$.next();
            }
            select(t, r) {
              this._cycleToSelected(
                t,
                this._getSlideEventDirection(this.activeId, t),
                r
              );
            }
            prev(t) {
              this._cycleToSelected(
                this._getPrevSlide(this.activeId),
                yi.END,
                t
              );
            }
            next(t) {
              this._cycleToSelected(
                this._getNextSlide(this.activeId),
                yi.START,
                t
              );
            }
            pause() {
              this._pause$.next(!0);
            }
            cycle() {
              this._pause$.next(!1);
            }
            focus() {
              this._container.nativeElement.focus();
            }
            _cycleToSelected(t, r, i) {
              const o = this._transitionIds;
              if (o && (o[0] !== t || o[1] !== this.activeId)) return;
              let s = this._getSlideById(t);
              if (s && s.id !== this.activeId) {
                (this._transitionIds = [this.activeId, t]),
                  this.slide.emit({
                    prev: this.activeId,
                    current: s.id,
                    direction: r,
                    paused: this._pause$.value,
                    source: i,
                  });
                const a = {
                    animation: this.animation,
                    runningTransition: "stop",
                    context: { direction: r },
                  },
                  l = [],
                  c = this._getSlideById(this.activeId);
                if (c) {
                  const h = Rt(
                    this._ngZone,
                    this._getSlideElement(c.id),
                    wH,
                    a
                  );
                  h.subscribe(() => {
                    c.slid.emit({ isShown: !1, direction: r, source: i });
                  }),
                    l.push(h);
                }
                const u = this.activeId;
                this.activeId = s.id;
                const d = this._getSlideById(this.activeId),
                  f = Rt(this._ngZone, this._getSlideElement(s.id), CH, a);
                f.subscribe(() => {
                  d?.slid.emit({ isShown: !0, direction: r, source: i });
                }),
                  l.push(f),
                  mu(...l)
                    .pipe(bt(1))
                    .subscribe(() => {
                      (this._transitionIds = null),
                        this.slid.emit({
                          prev: u,
                          current: s.id,
                          direction: r,
                          paused: this._pause$.value,
                          source: i,
                        });
                    });
              }
              this._cd.markForCheck();
            }
            _getSlideEventDirection(t, r) {
              return this._getSlideIdxById(t) > this._getSlideIdxById(r)
                ? yi.END
                : yi.START;
            }
            _getSlideById(t) {
              return this.slides.find((r) => r.id === t) || null;
            }
            _getSlideIdxById(t) {
              const r = this._getSlideById(t);
              return null != r ? this.slides.toArray().indexOf(r) : -1;
            }
            _getNextSlide(t) {
              const r = this.slides.toArray(),
                i = this._getSlideIdxById(t);
              return i === r.length - 1
                ? this.wrap
                  ? r[0].id
                  : r[r.length - 1].id
                : r[i + 1].id;
            }
            _getPrevSlide(t) {
              const r = this.slides.toArray(),
                i = this._getSlideIdxById(t);
              return 0 === i
                ? this.wrap
                  ? r[r.length - 1].id
                  : r[0].id
                : r[i - 1].id;
            }
            _getSlideElement(t) {
              return this._container.nativeElement.querySelector(`#slide-${t}`);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(EH), _(qc), _(Ce), _(_n), _(De));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-carousel"]],
              contentQueries: function (t, r, i) {
                if ((1 & t && je(i, MH, 4), 2 & t)) {
                  let o;
                  we((o = Ee())) && (r.slides = o);
                }
              },
              hostAttrs: ["tabIndex", "0", 1, "carousel", "slide"],
              hostVars: 3,
              hostBindings: function (t, r) {
                1 & t &&
                  P("keydown.arrowLeft", function () {
                    return r.keyboard && r.arrowLeft();
                  })("keydown.arrowRight", function () {
                    return r.keyboard && r.arrowRight();
                  })("mouseenter", function () {
                    return (r.mouseHover = !0);
                  })("mouseleave", function () {
                    return (r.mouseHover = !1);
                  })("focusin", function () {
                    return (r.focused = !0);
                  })("focusout", function () {
                    return (r.focused = !1);
                  }),
                  2 & t &&
                    (ve("aria-activedescendant", "slide-" + r.activeId),
                    Zo("display", "block"));
              },
              inputs: {
                animation: "animation",
                activeId: "activeId",
                interval: "interval",
                wrap: "wrap",
                keyboard: "keyboard",
                pauseOnHover: "pauseOnHover",
                pauseOnFocus: "pauseOnFocus",
                showNavigationArrows: "showNavigationArrows",
                showNavigationIndicators: "showNavigationIndicators",
              },
              outputs: { slide: "slide", slid: "slid" },
              exportAs: ["ngbCarousel"],
              standalone: !0,
              features: [Nt],
              decls: 6,
              vars: 6,
              consts: function () {
                let n, t, r;
                return (
                  (n = $localize`:Currently selected slide number read by screen reader@@ngb.carousel.slide-number: Slide ${"\ufffd0\ufffd"}:INTERPOLATION: of ${"\ufffd1\ufffd"}:INTERPOLATION_1: `),
                  (t = $localize`:@@ngb.carousel.previous:Previous`),
                  (r = $localize`:@@ngb.carousel.next:Next`),
                  [
                    ["role", "tablist", 1, "carousel-indicators"],
                    [
                      "type",
                      "button",
                      "data-bs-target",
                      "",
                      "role",
                      "tab",
                      3,
                      "active",
                      "click",
                      4,
                      "ngFor",
                      "ngForOf",
                    ],
                    [1, "carousel-inner"],
                    [
                      "class",
                      "carousel-item",
                      "role",
                      "tabpanel",
                      3,
                      "id",
                      4,
                      "ngFor",
                      "ngForOf",
                    ],
                    [
                      "class",
                      "carousel-control-prev",
                      "type",
                      "button",
                      3,
                      "click",
                      4,
                      "ngIf",
                    ],
                    [
                      "class",
                      "carousel-control-next",
                      "type",
                      "button",
                      3,
                      "click",
                      4,
                      "ngIf",
                    ],
                    [
                      "type",
                      "button",
                      "data-bs-target",
                      "",
                      "role",
                      "tab",
                      3,
                      "click",
                    ],
                    ["role", "tabpanel", 1, "carousel-item", 3, "id"],
                    [1, "visually-hidden"],
                    n,
                    [3, "ngTemplateOutlet"],
                    ["type", "button", 1, "carousel-control-prev", 3, "click"],
                    ["aria-hidden", "true", 1, "carousel-control-prev-icon"],
                    t,
                    ["type", "button", 1, "carousel-control-next", 3, "click"],
                    ["aria-hidden", "true", 1, "carousel-control-next-icon"],
                    r,
                  ]
                );
              },
              template: function (t, r) {
                1 & t &&
                  (p(0, "div", 0),
                  C(1, wB, 1, 5, "button", 1),
                  m(),
                  p(2, "div", 2),
                  C(3, SB, 4, 4, "div", 3),
                  m(),
                  C(4, MB, 4, 0, "button", 4),
                  C(5, TB, 4, 0, "button", 5)),
                  2 & t &&
                    (te("visually-hidden", !r.showNavigationIndicators),
                    g(1),
                    v("ngForOf", r.slides),
                    g(2),
                    v("ngForOf", r.slides),
                    g(1),
                    v("ngIf", r.showNavigationArrows),
                    g(1),
                    v("ngIf", r.showNavigationArrows));
              },
              dependencies: [Zt, qr, kt],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })();
      var Zi = (() => {
        return (
          ((e = Zi || (Zi = {})).TIMER = "timer"),
          (e.ARROW_LEFT = "arrowLeft"),
          (e.ARROW_RIGHT = "arrowRight"),
          (e.INDICATOR = "indicator"),
          Zi
        );
        var e;
      })();
      let dw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [TH] })),
            e
          );
        })(),
        fw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({})),
            e
          );
        })();
      class xt {
        constructor(n, t, r) {
          (this.year = rt(n) ? n : null),
            (this.month = rt(t) ? t : null),
            (this.day = rt(r) ? r : null);
        }
        static from(n) {
          return n instanceof xt
            ? n
            : n
            ? new xt(n.year, n.month, n.day)
            : null;
        }
        equals(n) {
          return (
            null != n &&
            this.year === n.year &&
            this.month === n.month &&
            this.day === n.day
          );
        }
        before(n) {
          return (
            !!n &&
            (this.year === n.year
              ? this.month === n.month
                ? this.day !== n.day && this.day < n.day
                : this.month < n.month
              : this.year < n.year)
          );
        }
        after(n) {
          return (
            !!n &&
            (this.year === n.year
              ? this.month === n.month
                ? this.day !== n.day && this.day > n.day
                : this.month > n.month
              : this.year > n.year)
          );
        }
      }
      function gs(e, n) {
        return !(function NH(e, n) {
          return (!e && !n) || (!!e && !!n && e.equals(n));
        })(e, n);
      }
      function hw(e, n) {
        return !(
          (!e && !n) ||
          (e && n && e.year === n.year && e.month === n.month)
        );
      }
      function Fu(e, n, t) {
        return e && n && e.before(n) ? n : e && t && e.after(t) ? t : e || null;
      }
      function Sg(e, n) {
        const { minDate: t, maxDate: r, disabled: i, markDisabled: o } = n;
        return !(
          null == e ||
          i ||
          (o && o(e, { year: e.year, month: e.month })) ||
          (t && e.before(t)) ||
          (r && e.after(r))
        );
      }
      function pw(e) {
        return new xt(e.getFullYear(), e.getMonth() + 1, e.getDate());
      }
      function Lu(e) {
        const n = new Date(e.year, e.month - 1, e.day, 12);
        return isNaN(n.getTime()) || n.setFullYear(e.year), n;
      }
      let Bu = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function () {
                return (function LH() {
                  return new BH();
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        BH = (() => {
          class e extends Bu {
            getDaysPerWeek() {
              return 7;
            }
            getMonths() {
              return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            }
            getWeeksPerMonth() {
              return 6;
            }
            getNext(t, r = "d", i = 1) {
              let o = Lu(t),
                s = !0,
                a = o.getMonth();
              switch (r) {
                case "y":
                  o.setFullYear(o.getFullYear() + i);
                  break;
                case "m":
                  (a += i), o.setMonth(a), (a %= 12), a < 0 && (a += 12);
                  break;
                case "d":
                  o.setDate(o.getDate() + i), (s = !1);
                  break;
                default:
                  return t;
              }
              return s && o.getMonth() !== a && o.setDate(0), pw(o);
            }
            getPrev(t, r = "d", i = 1) {
              return this.getNext(t, r, -i);
            }
            getWeekday(t) {
              let i = Lu(t).getDay();
              return 0 === i ? 7 : i;
            }
            getWeekNumber(t, r) {
              7 === r && (r = 0);
              const s = Lu(t[(11 - r) % 7]);
              s.setDate(s.getDate() + 4 - (s.getDay() || 7));
              const a = s.getTime();
              return (
                s.setMonth(0),
                s.setDate(1),
                Math.floor(Math.round((a - s.getTime()) / 864e5) / 7) + 1
              );
            }
            getToday() {
              return pw(new Date());
            }
            isValid(t) {
              if (
                !(t && rt(t.year) && rt(t.month) && rt(t.day) && 0 !== t.year)
              )
                return !1;
              const r = Lu(t);
              return (
                !isNaN(r.getTime()) &&
                r.getFullYear() === t.year &&
                r.getMonth() + 1 === t.month &&
                r.getDate() === t.day
              );
            }
          }
          return (
            (e.ɵfac = (function () {
              let n;
              return function (r) {
                return (n || (n = st(e)))(r || e);
              };
            })()),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Qi = (() => {
          class e {
            getMonthLabel(t) {
              return `${this.getMonthFullName(
                t.month,
                t.year
              )} ${this.getYearNumerals(t.year)}`;
            }
            getDayNumerals(t) {
              return `${t.day}`;
            }
            getWeekNumerals(t) {
              return `${t}`;
            }
            getYearNumerals(t) {
              return `${t}`;
            }
            getWeekLabel() {
              return "";
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function (t) {
                let r = null;
                return (
                  (r = t
                    ? new t()
                    : (function VH(e) {
                        return new HH(e);
                      })(L(Nn))),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        HH = (() => {
          class e extends Qi {
            constructor(t) {
              super(),
                (this._locale = t),
                (this._monthsShort = pp(t, Ze.Standalone, ue.Abbreviated)),
                (this._monthsFull = pp(t, Ze.Standalone, ue.Wide));
            }
            getWeekdayLabel(t, r) {
              const i = I0(
                this._locale,
                Ze.Standalone,
                void 0 === r ? ue.Short : r
              );
              return i.map((s, a) => i[(a + 1) % 7])[t - 1] || "";
            }
            getMonthShortName(t) {
              return this._monthsShort[t - 1] || "";
            }
            getMonthFullName(t) {
              return this._monthsFull[t - 1] || "";
            }
            getDayAriaLabel(t) {
              return A0(
                new Date(t.year, t.month - 1, t.day),
                "fullDate",
                this._locale
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Nn));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Mg = (() => {
          class e {
            constructor(t, r) {
              (this._calendar = t),
                (this._i18n = r),
                (this._VALIDATORS = {
                  dayTemplateData: (i) => {
                    if (this._state.dayTemplateData !== i)
                      return { dayTemplateData: i };
                  },
                  displayMonths: (i) => {
                    if (
                      rt((i = jt(i))) &&
                      i > 0 &&
                      this._state.displayMonths !== i
                    )
                      return { displayMonths: i };
                  },
                  disabled: (i) => {
                    if (this._state.disabled !== i) return { disabled: i };
                  },
                  firstDayOfWeek: (i) => {
                    if (
                      rt((i = jt(i))) &&
                      i >= 0 &&
                      this._state.firstDayOfWeek !== i
                    )
                      return { firstDayOfWeek: i };
                  },
                  focusVisible: (i) => {
                    if (this._state.focusVisible !== i && !this._state.disabled)
                      return { focusVisible: i };
                  },
                  markDisabled: (i) => {
                    if (this._state.markDisabled !== i)
                      return { markDisabled: i };
                  },
                  maxDate: (i) => {
                    const o = this.toValidDate(i, null);
                    if (gs(this._state.maxDate, o)) return { maxDate: o };
                  },
                  minDate: (i) => {
                    const o = this.toValidDate(i, null);
                    if (gs(this._state.minDate, o)) return { minDate: o };
                  },
                  navigation: (i) => {
                    if (this._state.navigation !== i) return { navigation: i };
                  },
                  outsideDays: (i) => {
                    if (this._state.outsideDays !== i)
                      return { outsideDays: i };
                  },
                  weekdays: (i) => {
                    const o = !0 === i || !1 === i ? ue.Short : i,
                      s = (!0 !== i && !1 !== i) || i;
                    if (
                      this._state.weekdayWidth !== o ||
                      this._state.weekdaysVisible !== s
                    )
                      return { weekdayWidth: o, weekdaysVisible: s };
                  },
                }),
                (this._model$ = new Pe()),
                (this._dateSelect$ = new Pe()),
                (this._state = {
                  dayTemplateData: null,
                  markDisabled: null,
                  maxDate: null,
                  minDate: null,
                  disabled: !1,
                  displayMonths: 1,
                  firstDate: null,
                  firstDayOfWeek: 1,
                  lastDate: null,
                  focusDate: null,
                  focusVisible: !1,
                  months: [],
                  navigation: "select",
                  outsideDays: "visible",
                  prevDisabled: !1,
                  nextDisabled: !1,
                  selectedDate: null,
                  selectBoxes: { years: [], months: [] },
                  weekdayWidth: ue.Short,
                  weekdaysVisible: !0,
                });
            }
            get model$() {
              return this._model$.pipe(At((t) => t.months.length > 0));
            }
            get dateSelect$() {
              return this._dateSelect$.pipe(At((t) => null !== t));
            }
            set(t) {
              let r = Object.keys(t)
                .map((i) => this._VALIDATORS[i](t[i]))
                .reduce((i, o) => ({ ...i, ...o }), {});
              Object.keys(r).length > 0 && this._nextState(r);
            }
            focus(t) {
              const r = this.toValidDate(t, null);
              null != r &&
                !this._state.disabled &&
                gs(this._state.focusDate, r) &&
                this._nextState({ focusDate: t });
            }
            focusSelect() {
              Sg(this._state.focusDate, this._state) &&
                this.select(this._state.focusDate, { emitEvent: !0 });
            }
            open(t) {
              const r = this.toValidDate(t, this._calendar.getToday());
              null != r &&
                !this._state.disabled &&
                (!this._state.firstDate || hw(this._state.firstDate, r)) &&
                this._nextState({ firstDate: r });
            }
            select(t, r = {}) {
              const i = this.toValidDate(t, null);
              null != i &&
                !this._state.disabled &&
                (gs(this._state.selectedDate, i) &&
                  this._nextState({ selectedDate: i }),
                r.emitEvent && Sg(i, this._state) && this._dateSelect$.next(i));
            }
            toValidDate(t, r) {
              const i = xt.from(t);
              return (
                void 0 === r && (r = this._calendar.getToday()),
                this._calendar.isValid(i) ? i : r
              );
            }
            getMonth(t) {
              for (let r of this._state.months)
                if (t.month === r.number && t.year === r.year) return r;
              throw new Error(`month ${t.month} of year ${t.year} not found`);
            }
            _nextState(t) {
              const r = this._updateState(t);
              this._patchContexts(r),
                (this._state = r),
                this._model$.next(this._state);
            }
            _patchContexts(t) {
              const {
                months: r,
                displayMonths: i,
                selectedDate: o,
                focusDate: s,
                focusVisible: a,
                disabled: l,
                outsideDays: c,
              } = t;
              t.months.forEach((u) => {
                u.weeks.forEach((d) => {
                  d.days.forEach((f) => {
                    s && (f.context.focused = s.equals(f.date) && a),
                      (f.tabindex =
                        !l && s && f.date.equals(s) && s.month === u.number
                          ? 0
                          : -1),
                      !0 === l && (f.context.disabled = !0),
                      void 0 !== o &&
                        (f.context.selected = null !== o && o.equals(f.date)),
                      u.number !== f.date.month &&
                        (f.hidden =
                          "hidden" === c ||
                          "collapsed" === c ||
                          (i > 1 &&
                            f.date.after(r[0].firstDate) &&
                            f.date.before(r[i - 1].lastDate)));
                  });
                });
              });
            }
            _updateState(t) {
              const r = Object.assign({}, this._state, t);
              let i = r.firstDate;
              if (
                (("minDate" in t || "maxDate" in t) &&
                  ((function IH(e, n) {
                    if (n && e && n.before(e))
                      throw new Error(
                        `'maxDate' ${n} should be greater than 'minDate' ${e}`
                      );
                  })(r.minDate, r.maxDate),
                  (r.focusDate = Fu(r.focusDate, r.minDate, r.maxDate)),
                  (r.firstDate = Fu(r.firstDate, r.minDate, r.maxDate)),
                  (i = r.focusDate)),
                "disabled" in t && (r.focusVisible = !1),
                "selectedDate" in t &&
                  0 === this._state.months.length &&
                  (i = r.selectedDate),
                "focusVisible" in t ||
                  ("focusDate" in t &&
                    ((r.focusDate = Fu(r.focusDate, r.minDate, r.maxDate)),
                    (i = r.focusDate),
                    0 !== r.months.length &&
                      r.focusDate &&
                      !r.focusDate.before(r.firstDate) &&
                      !r.focusDate.after(r.lastDate))))
              )
                return r;
              if (
                ("firstDate" in t &&
                  ((r.firstDate = Fu(r.firstDate, r.minDate, r.maxDate)),
                  (i = r.firstDate)),
                i)
              ) {
                const s = (function PH(e, n, t, r, i) {
                  const { displayMonths: o, months: s } = t,
                    a = s.splice(0, s.length);
                  return (
                    Array.from({ length: o }, (c, u) => {
                      const d = Object.assign(e.getNext(n, "m", u), { day: 1 });
                      if (((s[u] = null), !i)) {
                        const f = a.findIndex((h) => h.firstDate.equals(d));
                        -1 !== f && (s[u] = a.splice(f, 1)[0]);
                      }
                      return d;
                    }).forEach((c, u) => {
                      null === s[u] &&
                        (s[u] = (function kH(e, n, t, r, i = {}) {
                          const {
                              dayTemplateData: o,
                              minDate: s,
                              maxDate: a,
                              firstDayOfWeek: l,
                              markDisabled: c,
                              outsideDays: u,
                              weekdayWidth: d,
                              weekdaysVisible: f,
                            } = t,
                            h = e.getToday();
                          (i.firstDate = null),
                            (i.lastDate = null),
                            (i.number = n.month),
                            (i.year = n.year),
                            (i.weeks = i.weeks || []),
                            (i.weekdays = i.weekdays || []),
                            (n = (function FH(e, n, t) {
                              const r = e.getDaysPerWeek(),
                                i = new xt(n.year, n.month, 1),
                                o = e.getWeekday(i) % r;
                              return e.getPrev(i, "d", (r + o - t) % r);
                            })(e, n, l)),
                            f || (i.weekdays.length = 0);
                          for (let y = 0; y < e.getWeeksPerMonth(); y++) {
                            let b = i.weeks[y];
                            b ||
                              (b = i.weeks[y] =
                                { number: 0, days: [], collapsed: !0 });
                            const w = b.days;
                            for (let S = 0; S < e.getDaysPerWeek(); S++) {
                              0 === y &&
                                f &&
                                (i.weekdays[S] = r.getWeekdayLabel(
                                  e.getWeekday(n),
                                  d
                                ));
                              const O = new xt(n.year, n.month, n.day),
                                T = e.getNext(O),
                                k = r.getDayAriaLabel(O);
                              let j = !!(
                                (s && O.before(s)) ||
                                (a && O.after(a))
                              );
                              !j &&
                                c &&
                                (j = c(O, { month: i.number, year: i.year }));
                              let J = O.equals(h),
                                We = o
                                  ? o(O, { month: i.number, year: i.year })
                                  : void 0;
                              null === i.firstDate &&
                                O.month === i.number &&
                                (i.firstDate = O),
                                O.month === i.number &&
                                  T.month !== i.number &&
                                  (i.lastDate = O);
                              let qe = w[S];
                              qe || (qe = w[S] = {}),
                                (qe.date = O),
                                (qe.context = Object.assign(qe.context || {}, {
                                  $implicit: O,
                                  date: O,
                                  data: We,
                                  currentMonth: i.number,
                                  currentYear: i.year,
                                  disabled: j,
                                  focused: !1,
                                  selected: !1,
                                  today: J,
                                })),
                                (qe.tabindex = -1),
                                (qe.ariaLabel = k),
                                (qe.hidden = !1),
                                (n = T);
                            }
                            (b.number = e.getWeekNumber(
                              w.map((S) => S.date),
                              l
                            )),
                              (b.collapsed =
                                "collapsed" === u &&
                                w[0].date.month !== i.number &&
                                w[w.length - 1].date.month !== i.number);
                          }
                          return i;
                        })(e, c, t, r, a.shift() || {}));
                    }),
                    s
                  );
                })(
                  this._calendar,
                  i,
                  r,
                  this._i18n,
                  "dayTemplateData" in t ||
                    "firstDayOfWeek" in t ||
                    "markDisabled" in t ||
                    "minDate" in t ||
                    "maxDate" in t ||
                    "disabled" in t ||
                    "outsideDays" in t ||
                    "weekdaysVisible" in t
                );
                (r.months = s),
                  (r.firstDate = s[0].firstDate),
                  (r.lastDate = s[s.length - 1].lastDate),
                  "selectedDate" in t &&
                    !Sg(r.selectedDate, r) &&
                    (r.selectedDate = null),
                  "firstDate" in t &&
                    (!r.focusDate ||
                      r.focusDate.before(r.firstDate) ||
                      r.focusDate.after(r.lastDate)) &&
                    (r.focusDate = i);
                const a =
                    !this._state.firstDate ||
                    this._state.firstDate.year !== r.firstDate.year,
                  l =
                    !this._state.firstDate ||
                    this._state.firstDate.month !== r.firstDate.month;
                "select" === r.navigation
                  ? (("minDate" in t ||
                      "maxDate" in t ||
                      0 === r.selectBoxes.years.length ||
                      a) &&
                      (r.selectBoxes.years = (function AH(e, n, t) {
                        if (!e) return [];
                        const r = n
                            ? Math.max(n.year, e.year - 500)
                            : e.year - 10,
                          o =
                            (t ? Math.min(t.year, e.year + 500) : e.year + 10) -
                            r +
                            1,
                          s = Array(o);
                        for (let a = 0; a < o; a++) s[a] = r + a;
                        return s;
                      })(r.firstDate, r.minDate, r.maxDate)),
                    ("minDate" in t ||
                      "maxDate" in t ||
                      0 === r.selectBoxes.months.length ||
                      a) &&
                      (r.selectBoxes.months = (function OH(e, n, t, r) {
                        if (!n) return [];
                        let i = e.getMonths(n.year);
                        if (t && n.year === t.year) {
                          const o = i.findIndex((s) => s === t.month);
                          i = i.slice(o);
                        }
                        if (r && n.year === r.year) {
                          const o = i.findIndex((s) => s === r.month);
                          i = i.slice(0, o + 1);
                        }
                        return i;
                      })(this._calendar, r.firstDate, r.minDate, r.maxDate)))
                  : (r.selectBoxes = { years: [], months: [] }),
                  ("arrows" === r.navigation || "select" === r.navigation) &&
                    (l ||
                      a ||
                      "minDate" in t ||
                      "maxDate" in t ||
                      "disabled" in t) &&
                    ((r.prevDisabled =
                      r.disabled ||
                      (function xH(e, n, t) {
                        const r = Object.assign(e.getPrev(n, "m"), { day: 1 });
                        return (
                          null != t &&
                          ((r.year === t.year && r.month < t.month) ||
                            (r.year < t.year && 1 === t.month))
                        );
                      })(this._calendar, r.firstDate, r.minDate)),
                    (r.nextDisabled =
                      r.disabled ||
                      (function RH(e, n, t) {
                        const r = Object.assign(e.getNext(n, "m"), { day: 1 });
                        return null != t && r.after(t);
                      })(this._calendar, r.lastDate, r.maxDate)));
              }
              return r;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Bu), L(Qi));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      var ms = (() => {
        return (
          ((e = ms || (ms = {}))[(e.PREV = 0)] = "PREV"),
          (e[(e.NEXT = 1)] = "NEXT"),
          ms
        );
        var e;
      })();
      let UH = (() => {
          class e {
            constructor(t) {
              this.i18n = t;
            }
            isMuted() {
              return (
                !this.selected &&
                (this.date.month !== this.currentMonth || this.disabled)
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Qi));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["", "ngbDatepickerDayView", ""]],
              hostAttrs: [1, "btn-light"],
              hostVars: 10,
              hostBindings: function (t, r) {
                2 & t &&
                  te("bg-primary", r.selected)("text-white", r.selected)(
                    "text-muted",
                    r.isMuted()
                  )("outside", r.isMuted())("active", r.focused);
              },
              inputs: {
                currentMonth: "currentMonth",
                date: "date",
                disabled: "disabled",
                focused: "focused",
                selected: "selected",
              },
              standalone: !0,
              features: [Nt],
              attrs: NB,
              decls: 1,
              vars: 1,
              template: function (t, r) {
                1 & t && N(0), 2 & t && Ue(r.i18n.getDayNumerals(r.date));
              },
              styles: [
                "[ngbDatepickerDayView]{text-align:center;width:2rem;height:2rem;line-height:2rem;border-radius:.25rem;background:transparent}[ngbDatepickerDayView]:hover:not(.bg-primary),[ngbDatepickerDayView].active:not(.bg-primary){background-color:var(--bs-btn-bg);outline:1px solid var(--bs-border-color)}[ngbDatepickerDayView].outside{opacity:.5}\n",
              ],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })(),
        $H = (() => {
          class e {
            constructor(t, r) {
              (this.i18n = t),
                (this._renderer = r),
                (this.select = new W()),
                (this._month = -1),
                (this._year = -1);
            }
            changeMonth(t) {
              this.select.emit(new xt(this.date.year, jt(t), 1));
            }
            changeYear(t) {
              this.select.emit(new xt(jt(t), this.date.month, 1));
            }
            ngAfterViewChecked() {
              this.date &&
                (this.date.month !== this._month &&
                  ((this._month = this.date.month),
                  this._renderer.setProperty(
                    this.monthSelect.nativeElement,
                    "value",
                    this._month
                  )),
                this.date.year !== this._year &&
                  ((this._year = this.date.year),
                  this._renderer.setProperty(
                    this.yearSelect.nativeElement,
                    "value",
                    this._year
                  )));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Qi), _(pn));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-datepicker-navigation-select"]],
              viewQuery: function (t, r) {
                if ((1 & t && (Vi(IB, 7, De), Vi(OB, 7, De)), 2 & t)) {
                  let i;
                  we((i = Ee())) && (r.monthSelect = i.first),
                    we((i = Ee())) && (r.yearSelect = i.first);
                }
              },
              inputs: {
                date: "date",
                disabled: "disabled",
                months: "months",
                years: "years",
              },
              outputs: { select: "select" },
              standalone: !0,
              features: [Nt],
              decls: 6,
              vars: 4,
              consts: function () {
                let n, t, r, i;
                return (
                  (n = $localize`:@@ngb.datepicker.select-month:Select month`),
                  (t = $localize`:@@ngb.datepicker.select-month:Select month`),
                  (r = $localize`:@@ngb.datepicker.select-year:Select year`),
                  (i = $localize`:@@ngb.datepicker.select-year:Select year`),
                  [
                    [
                      "aria-label",
                      n,
                      "title",
                      t,
                      1,
                      "form-select",
                      3,
                      "disabled",
                      "change",
                    ],
                    ["month", ""],
                    [3, "value", 4, "ngFor", "ngForOf"],
                    [
                      "aria-label",
                      r,
                      "title",
                      i,
                      1,
                      "form-select",
                      3,
                      "disabled",
                      "change",
                    ],
                    ["year", ""],
                    [3, "value"],
                  ]
                );
              },
              template: function (t, r) {
                1 & t &&
                  (p(0, "select", 0, 1),
                  P("change", function (o) {
                    return r.changeMonth(o.target.value);
                  }),
                  C(2, AB, 2, 3, "option", 2),
                  m(),
                  p(3, "select", 3, 4),
                  P("change", function (o) {
                    return r.changeYear(o.target.value);
                  }),
                  C(5, RB, 2, 2, "option", 2),
                  m()),
                  2 & t &&
                    (v("disabled", r.disabled),
                    g(2),
                    v("ngForOf", r.months),
                    g(1),
                    v("disabled", r.disabled),
                    g(2),
                    v("ngForOf", r.years));
              },
              dependencies: [Zt],
              styles: [
                "ngb-datepicker-navigation-select>.form-select{flex:1 1 auto;padding:0 .5rem;font-size:.875rem;height:1.85rem}ngb-datepicker-navigation-select>.form-select:focus{z-index:1}ngb-datepicker-navigation-select>.form-select::-ms-value{background-color:transparent!important}\n",
              ],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })(),
        GH = (() => {
          class e {
            constructor(t) {
              (this.i18n = t),
                (this.navigation = ms),
                (this.months = []),
                (this.navigate = new W()),
                (this.select = new W());
            }
            onClickPrev(t) {
              t.currentTarget.focus(), this.navigate.emit(this.navigation.PREV);
            }
            onClickNext(t) {
              t.currentTarget.focus(), this.navigate.emit(this.navigation.NEXT);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Qi));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-datepicker-navigation"]],
              inputs: {
                date: "date",
                disabled: "disabled",
                months: "months",
                showSelect: "showSelect",
                prevDisabled: "prevDisabled",
                nextDisabled: "nextDisabled",
                selectBoxes: "selectBoxes",
              },
              outputs: { navigate: "navigate", select: "select" },
              standalone: !0,
              features: [Nt],
              decls: 8,
              vars: 4,
              consts: function () {
                let n, t, r, i;
                return (
                  (n = $localize`:@@ngb.datepicker.previous-month:Previous month`),
                  (t = $localize`:@@ngb.datepicker.previous-month:Previous month`),
                  (r = $localize`:@@ngb.datepicker.next-month:Next month`),
                  (i = $localize`:@@ngb.datepicker.next-month:Next month`),
                  [
                    [1, "ngb-dp-arrow"],
                    [
                      "type",
                      "button",
                      "aria-label",
                      n,
                      "title",
                      t,
                      1,
                      "btn",
                      "btn-link",
                      "ngb-dp-arrow-btn",
                      3,
                      "disabled",
                      "click",
                    ],
                    [1, "ngb-dp-navigation-chevron"],
                    [
                      "class",
                      "ngb-dp-navigation-select",
                      3,
                      "date",
                      "disabled",
                      "months",
                      "years",
                      "select",
                      4,
                      "ngIf",
                    ],
                    [4, "ngIf"],
                    [1, "ngb-dp-arrow", "right"],
                    [
                      "type",
                      "button",
                      "aria-label",
                      r,
                      "title",
                      i,
                      1,
                      "btn",
                      "btn-link",
                      "ngb-dp-arrow-btn",
                      3,
                      "disabled",
                      "click",
                    ],
                    [
                      1,
                      "ngb-dp-navigation-select",
                      3,
                      "date",
                      "disabled",
                      "months",
                      "years",
                      "select",
                    ],
                    ["ngFor", "", 3, "ngForOf"],
                    ["class", "ngb-dp-arrow", 4, "ngIf"],
                    [1, "ngb-dp-month-name"],
                  ]
                );
              },
              template: function (t, r) {
                1 & t &&
                  (p(0, "div", 0)(1, "button", 1),
                  P("click", function (o) {
                    return r.onClickPrev(o);
                  }),
                  A(2, "span", 2),
                  m()(),
                  C(3, xB, 1, 4, "ngb-datepicker-navigation-select", 3),
                  C(4, LB, 1, 1, null, 4),
                  p(5, "div", 5)(6, "button", 6),
                  P("click", function (o) {
                    return r.onClickNext(o);
                  }),
                  A(7, "span", 2),
                  m()()),
                  2 & t &&
                    (g(1),
                    v("disabled", r.prevDisabled),
                    g(2),
                    v("ngIf", r.showSelect),
                    g(1),
                    v("ngIf", !r.showSelect),
                    g(2),
                    v("disabled", r.nextDisabled));
              },
              dependencies: [kt, Zt, $H],
              styles: [
                "ngb-datepicker-navigation{display:flex;align-items:center}.ngb-dp-navigation-chevron{border-style:solid;border-width:.2em .2em 0 0;display:inline-block;width:.75em;height:.75em;margin-left:.25em;margin-right:.15em;transform:rotate(-135deg)}.ngb-dp-arrow{display:flex;flex:1 1 auto;padding-right:0;padding-left:0;margin:0;width:2rem;height:2rem}.ngb-dp-arrow.right{justify-content:flex-end}.ngb-dp-arrow.right .ngb-dp-navigation-chevron{transform:rotate(45deg);margin-left:.15em;margin-right:.25em}.ngb-dp-arrow-btn{padding:0 .25rem;margin:0 .5rem;border:none;background-color:transparent;z-index:1}.ngb-dp-arrow-btn:focus{outline-width:1px;outline-style:auto}@media all and (-ms-high-contrast: none),(-ms-high-contrast: active){.ngb-dp-arrow-btn:focus{outline-style:solid}}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center}.ngb-dp-navigation-select{display:flex;flex:1 1 9rem}\n",
              ],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })();
      var ye = (() => {
        return (
          ((e = ye || (ye = {}))[(e.Tab = 9)] = "Tab"),
          (e[(e.Enter = 13)] = "Enter"),
          (e[(e.Escape = 27)] = "Escape"),
          (e[(e.Space = 32)] = "Space"),
          (e[(e.PageUp = 33)] = "PageUp"),
          (e[(e.PageDown = 34)] = "PageDown"),
          (e[(e.End = 35)] = "End"),
          (e[(e.Home = 36)] = "Home"),
          (e[(e.ArrowLeft = 37)] = "ArrowLeft"),
          (e[(e.ArrowUp = 38)] = "ArrowUp"),
          (e[(e.ArrowRight = 39)] = "ArrowRight"),
          (e[(e.ArrowDown = 40)] = "ArrowDown"),
          ye
        );
        var e;
      })();
      let jH = (() => {
          class e {
            processKey(t, r) {
              const { state: i, calendar: o } = r;
              switch (t.which) {
                case ye.PageUp:
                  r.focusDate(
                    o.getPrev(i.focusedDate, t.shiftKey ? "y" : "m", 1)
                  );
                  break;
                case ye.PageDown:
                  r.focusDate(
                    o.getNext(i.focusedDate, t.shiftKey ? "y" : "m", 1)
                  );
                  break;
                case ye.End:
                  r.focusDate(t.shiftKey ? i.maxDate : i.lastDate);
                  break;
                case ye.Home:
                  r.focusDate(t.shiftKey ? i.minDate : i.firstDate);
                  break;
                case ye.ArrowLeft:
                  r.focusDate(o.getPrev(i.focusedDate, "d", 1));
                  break;
                case ye.ArrowUp:
                  r.focusDate(
                    o.getPrev(i.focusedDate, "d", o.getDaysPerWeek())
                  );
                  break;
                case ye.ArrowRight:
                  r.focusDate(o.getNext(i.focusedDate, "d", 1));
                  break;
                case ye.ArrowDown:
                  r.focusDate(
                    o.getNext(i.focusedDate, "d", o.getDaysPerWeek())
                  );
                  break;
                case ye.Enter:
                case ye.Space:
                  r.focusSelect();
                  break;
                default:
                  return;
              }
              t.preventDefault(), t.stopPropagation();
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Tg = (() => {
          class e {
            constructor() {
              (this.displayMonths = 1),
                (this.firstDayOfWeek = 1),
                (this.navigation = "select"),
                (this.outsideDays = "visible"),
                (this.showWeekNumbers = !1),
                (this.weekdays = ue.Short);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Ng = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function () {
                return (function zH() {
                  return new WH();
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        WH = (() => {
          class e extends Ng {
            fromModel(t) {
              return t && rt(t.year) && rt(t.month) && rt(t.day)
                ? { year: t.year, month: t.month, day: t.day }
                : null;
            }
            toModel(t) {
              return t && rt(t.year) && rt(t.month) && rt(t.day)
                ? { year: t.year, month: t.month, day: t.day }
                : null;
            }
          }
          return (
            (e.ɵfac = (function () {
              let n;
              return function (r) {
                return (n || (n = st(e)))(r || e);
              };
            })()),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        gw = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbDatepickerContent", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        Ig = (() => {
          class e {
            constructor(t, r, i, o) {
              (this.i18n = t),
                (this.datepicker = r),
                (this._keyboardService = i),
                (this._service = o);
            }
            set month(t) {
              this.viewModel = this._service.getMonth(t);
            }
            onKeyDown(t) {
              this._keyboardService.processKey(t, this.datepicker);
            }
            doSelect(t) {
              !t.context.disabled &&
                !t.hidden &&
                this.datepicker.onDateSelect(t.date);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Qi), _(oe(() => Vu)), _(jH), _(Mg));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-datepicker-month"]],
              hostAttrs: ["role", "grid"],
              hostBindings: function (t, r) {
                1 & t &&
                  P("keydown", function (o) {
                    return r.onKeyDown(o);
                  });
              },
              inputs: { month: "month" },
              standalone: !0,
              features: [Nt],
              decls: 2,
              vars: 2,
              consts: [
                [
                  "class",
                  "ngb-dp-week ngb-dp-weekdays",
                  "role",
                  "row",
                  4,
                  "ngIf",
                ],
                ["ngFor", "", 3, "ngForOf"],
                ["role", "row", 1, "ngb-dp-week", "ngb-dp-weekdays"],
                ["class", "ngb-dp-weekday ngb-dp-showweek small", 4, "ngIf"],
                [
                  "class",
                  "ngb-dp-weekday small",
                  "role",
                  "columnheader",
                  4,
                  "ngFor",
                  "ngForOf",
                ],
                [1, "ngb-dp-weekday", "ngb-dp-showweek", "small"],
                ["role", "columnheader", 1, "ngb-dp-weekday", "small"],
                ["class", "ngb-dp-week", "role", "row", 4, "ngIf"],
                ["role", "row", 1, "ngb-dp-week"],
                ["class", "ngb-dp-week-number small text-muted", 4, "ngIf"],
                [
                  "class",
                  "ngb-dp-day",
                  "role",
                  "gridcell",
                  3,
                  "disabled",
                  "tabindex",
                  "hidden",
                  "ngb-dp-today",
                  "click",
                  4,
                  "ngFor",
                  "ngForOf",
                ],
                [1, "ngb-dp-week-number", "small", "text-muted"],
                ["role", "gridcell", 1, "ngb-dp-day", 3, "tabindex", "click"],
                [3, "ngIf"],
                [3, "ngTemplateOutlet", "ngTemplateOutletContext"],
              ],
              template: function (t, r) {
                1 & t &&
                  (C(0, HB, 3, 2, "div", 0), C(1, WB, 1, 1, "ng-template", 1)),
                  2 & t &&
                    (v("ngIf", r.viewModel.weekdays.length > 0),
                    g(1),
                    v("ngForOf", r.viewModel.weeks));
              },
              dependencies: [kt, Zt, qr],
              styles: [
                'ngb-datepicker-month{display:block}.ngb-dp-weekday,.ngb-dp-week-number{line-height:2rem;text-align:center;font-style:italic}.ngb-dp-weekday{color:var(--bs-info)}.ngb-dp-week{border-radius:.25rem;display:flex}.ngb-dp-weekdays{border-bottom:1px solid var(--bs-border-color);border-radius:0;background-color:var(--bs-light)}.ngb-dp-day,.ngb-dp-weekday,.ngb-dp-week-number{width:2rem;height:2rem}.ngb-dp-day{cursor:pointer}.ngb-dp-day.disabled,.ngb-dp-day.hidden{cursor:default;pointer-events:none}.ngb-dp-day[tabindex="0"]{z-index:1}\n',
              ],
              encapsulation: 2,
            })),
            e
          );
        })(),
        Vu = (() => {
          class e {
            constructor(t, r, i, o, s, a, l, c) {
              (this._service = t),
                (this._calendar = r),
                (this._i18n = i),
                (this._elementRef = a),
                (this._ngbDateAdapter = l),
                (this._ngZone = c),
                (this.injector = se(gn)),
                (this._controlValue = null),
                (this._destroyed$ = new Pe()),
                (this._publicState = {}),
                (this.navigate = new W()),
                (this.dateSelect = new W()),
                (this.onChange = (u) => {}),
                (this.onTouched = () => {}),
                [
                  "contentTemplate",
                  "dayTemplate",
                  "dayTemplateData",
                  "displayMonths",
                  "firstDayOfWeek",
                  "footerTemplate",
                  "markDisabled",
                  "minDate",
                  "maxDate",
                  "navigation",
                  "outsideDays",
                  "showWeekNumbers",
                  "startDate",
                  "weekdays",
                ].forEach((u) => (this[u] = o[u])),
                t.dateSelect$.pipe(ct(this._destroyed$)).subscribe((u) => {
                  this.dateSelect.emit(u);
                }),
                t.model$.pipe(ct(this._destroyed$)).subscribe((u) => {
                  const d = u.firstDate,
                    f = this.model ? this.model.firstDate : null;
                  this._publicState = {
                    maxDate: u.maxDate,
                    minDate: u.minDate,
                    firstDate: u.firstDate,
                    lastDate: u.lastDate,
                    focusedDate: u.focusDate,
                    months: u.months.map((S) => S.firstDate),
                  };
                  let h = !1;
                  if (
                    !d.equals(f) &&
                    (this.navigate.emit({
                      current: f ? { year: f.year, month: f.month } : null,
                      next: { year: d.year, month: d.month },
                      preventDefault: () => (h = !0),
                    }),
                    h && null !== f)
                  )
                    return void this._service.open(f);
                  const y = u.selectedDate,
                    b = u.focusDate,
                    w = this.model ? this.model.focusDate : null;
                  (this.model = u),
                    gs(y, this._controlValue) &&
                      ((this._controlValue = y),
                      this.onTouched(),
                      this.onChange(this._ngbDateAdapter.toModel(y))),
                    gs(b, w) && w && u.focusVisible && this.focus(),
                    s.markForCheck();
                });
            }
            get state() {
              return this._publicState;
            }
            get calendar() {
              return this._calendar;
            }
            get i18n() {
              return this._i18n;
            }
            focusDate(t) {
              this._service.focus(xt.from(t));
            }
            focusSelect() {
              this._service.focusSelect();
            }
            focus() {
              this._ngZone.onStable
                .asObservable()
                .pipe(bt(1))
                .subscribe(() => {
                  const t = this._elementRef.nativeElement.querySelector(
                    'div.ngb-dp-day[tabindex="0"]'
                  );
                  t && t.focus();
                });
            }
            navigateTo(t) {
              this._service.open(
                xt.from(t ? (t.day ? t : { ...t, day: 1 }) : null)
              );
            }
            ngAfterViewInit() {
              this._ngZone.runOutsideAngular(() => {
                const t = $t(this._contentEl.nativeElement, "focusin"),
                  r = $t(this._contentEl.nativeElement, "focusout"),
                  { nativeElement: i } = this._elementRef;
                $m(t, r)
                  .pipe(
                    At(
                      ({ target: o, relatedTarget: s }) =>
                        !(
                          QC(o, "ngb-dp-day") &&
                          QC(s, "ngb-dp-day") &&
                          i.contains(o) &&
                          i.contains(s)
                        )
                    ),
                    ct(this._destroyed$)
                  )
                  .subscribe(({ type: o }) =>
                    this._ngZone.run(() =>
                      this._service.set({ focusVisible: "focusin" === o })
                    )
                  );
              });
            }
            ngOnDestroy() {
              this._destroyed$.next();
            }
            ngOnInit() {
              if (void 0 === this.model) {
                const t = {};
                [
                  "dayTemplateData",
                  "displayMonths",
                  "markDisabled",
                  "firstDayOfWeek",
                  "navigation",
                  "minDate",
                  "maxDate",
                  "outsideDays",
                  "weekdays",
                ].forEach((r) => (t[r] = this[r])),
                  this._service.set(t),
                  this.navigateTo(this.startDate);
              }
              this.dayTemplate || (this.dayTemplate = this._defaultDayTemplate);
            }
            ngOnChanges(t) {
              const r = {};
              if (
                ([
                  "dayTemplateData",
                  "displayMonths",
                  "markDisabled",
                  "firstDayOfWeek",
                  "navigation",
                  "minDate",
                  "maxDate",
                  "outsideDays",
                  "weekdays",
                ]
                  .filter((i) => i in t)
                  .forEach((i) => (r[i] = this[i])),
                this._service.set(r),
                "startDate" in t)
              ) {
                const { currentValue: i, previousValue: o } = t.startDate;
                hw(o, i) && this.navigateTo(this.startDate);
              }
            }
            onDateSelect(t) {
              this._service.focus(t),
                this._service.select(t, { emitEvent: !0 });
            }
            onNavigateDateSelect(t) {
              this._service.open(t);
            }
            onNavigateEvent(t) {
              switch (t) {
                case ms.PREV:
                  this._service.open(
                    this._calendar.getPrev(this.model.firstDate, "m", 1)
                  );
                  break;
                case ms.NEXT:
                  this._service.open(
                    this._calendar.getNext(this.model.firstDate, "m", 1)
                  );
              }
            }
            registerOnChange(t) {
              this.onChange = t;
            }
            registerOnTouched(t) {
              this.onTouched = t;
            }
            setDisabledState(t) {
              this._service.set({ disabled: t });
            }
            writeValue(t) {
              (this._controlValue = xt.from(this._ngbDateAdapter.fromModel(t))),
                this._service.select(this._controlValue);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(
                _(Mg),
                _(Bu),
                _(Qi),
                _(Tg),
                _(_n),
                _(De),
                _(Ng),
                _(Ce)
              );
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-datepicker"]],
              contentQueries: function (t, r, i) {
                if ((1 & t && je(i, gw, 7), 2 & t)) {
                  let o;
                  we((o = Ee())) && (r.contentTemplateFromContent = o.first);
                }
              },
              viewQuery: function (t, r) {
                if ((1 & t && (Vi(qB, 7), Vi(KB, 7)), 2 & t)) {
                  let i;
                  we((i = Ee())) && (r._defaultDayTemplate = i.first),
                    we((i = Ee())) && (r._contentEl = i.first);
                }
              },
              hostVars: 2,
              hostBindings: function (t, r) {
                2 & t && te("disabled", r.model.disabled);
              },
              inputs: {
                contentTemplate: "contentTemplate",
                dayTemplate: "dayTemplate",
                dayTemplateData: "dayTemplateData",
                displayMonths: "displayMonths",
                firstDayOfWeek: "firstDayOfWeek",
                footerTemplate: "footerTemplate",
                markDisabled: "markDisabled",
                maxDate: "maxDate",
                minDate: "minDate",
                navigation: "navigation",
                outsideDays: "outsideDays",
                showWeekNumbers: "showWeekNumbers",
                startDate: "startDate",
                weekdays: "weekdays",
              },
              outputs: { navigate: "navigate", dateSelect: "dateSelect" },
              exportAs: ["ngbDatepicker"],
              standalone: !0,
              features: [
                Fe([{ provide: yn, useExisting: oe(() => e), multi: !0 }, Mg]),
                ot,
                Nt,
              ],
              decls: 10,
              vars: 9,
              consts: [
                ["defaultDayTemplate", ""],
                ["defaultContentTemplate", ""],
                [1, "ngb-dp-header"],
                [
                  3,
                  "date",
                  "months",
                  "disabled",
                  "showSelect",
                  "prevDisabled",
                  "nextDisabled",
                  "selectBoxes",
                  "navigate",
                  "select",
                  4,
                  "ngIf",
                ],
                [1, "ngb-dp-content"],
                ["content", ""],
                [
                  3,
                  "ngTemplateOutlet",
                  "ngTemplateOutletContext",
                  "ngTemplateOutletInjector",
                ],
                [3, "ngTemplateOutlet"],
                [
                  "ngbDatepickerDayView",
                  "",
                  3,
                  "date",
                  "currentMonth",
                  "selected",
                  "disabled",
                  "focused",
                ],
                ["class", "ngb-dp-month", 4, "ngFor", "ngForOf"],
                [1, "ngb-dp-month"],
                ["class", "ngb-dp-month-name", 4, "ngIf"],
                [3, "month"],
                [1, "ngb-dp-month-name"],
                [
                  3,
                  "date",
                  "months",
                  "disabled",
                  "showSelect",
                  "prevDisabled",
                  "nextDisabled",
                  "selectBoxes",
                  "navigate",
                  "select",
                ],
              ],
              template: function (t, r) {
                if (
                  (1 & t &&
                    (C(0, YB, 1, 5, "ng-template", null, 0, rn),
                    C(2, QB, 1, 1, "ng-template", null, 1, rn),
                    p(4, "div", 2),
                    C(5, XB, 1, 7, "ngb-datepicker-navigation", 3),
                    m(),
                    p(6, "div", 4, 5),
                    C(8, eV, 0, 0, "ng-template", 6),
                    m(),
                    C(9, tV, 0, 0, "ng-template", 7)),
                  2 & t)
                ) {
                  const i = mn(3);
                  g(5),
                    v("ngIf", "none" !== r.navigation),
                    g(1),
                    te("ngb-dp-months", !r.contentTemplate),
                    g(2),
                    v(
                      "ngTemplateOutlet",
                      r.contentTemplate ||
                        (null == r.contentTemplateFromContent
                          ? null
                          : r.contentTemplateFromContent.templateRef) ||
                        i
                    )("ngTemplateOutletContext", Ut(7, YC, r))(
                      "ngTemplateOutletInjector",
                      r.injector
                    ),
                    g(1),
                    v("ngTemplateOutlet", r.footerTemplate);
                }
              },
              dependencies: [kt, Zt, qr, UH, Ig, GH],
              styles: [
                "ngb-datepicker{border:1px solid var(--bs-border-color);border-radius:.25rem;display:inline-block}ngb-datepicker-month{pointer-events:auto}ngb-datepicker.dropdown-menu{padding:0}ngb-datepicker.disabled .ngb-dp-weekday,ngb-datepicker.disabled .ngb-dp-week-number,ngb-datepicker.disabled .ngb-dp-month-name{color:var(--bs-text-muted)}.ngb-dp-body{z-index:1055}.ngb-dp-header{border-bottom:0;border-radius:.25rem .25rem 0 0;padding-top:.25rem;background-color:var(--bs-light)}.ngb-dp-months{display:flex}.ngb-dp-month{pointer-events:none}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center;background-color:var(--bs-light)}.ngb-dp-month+.ngb-dp-month .ngb-dp-month-name,.ngb-dp-month+.ngb-dp-month .ngb-dp-week{padding-left:1rem}.ngb-dp-month:last-child .ngb-dp-week{padding-right:.25rem}.ngb-dp-month:first-child .ngb-dp-week{padding-left:.25rem}.ngb-dp-month .ngb-dp-week:last-child{padding-bottom:.25rem}\n",
              ],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })();
      typeof navigator < "u" &&
        navigator.userAgent &&
        (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (/Macintosh/.test(navigator.userAgent) &&
            navigator.maxTouchPoints &&
            navigator.maxTouchPoints > 2) ||
          /Android/.test(navigator.userAgent));
      const vw = [
        "a[href]",
        "button:not([disabled])",
        'input:not([disabled]):not([type="hidden"])',
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[contenteditable]",
        '[tabindex]:not([tabindex="-1"])',
      ].join(", ");
      function yw(e) {
        const n = Array.from(e.querySelectorAll(vw)).filter(
          (t) => -1 !== t.tabIndex
        );
        return [n[0], n[n.length - 1]];
      }
      new Date(1882, 10, 12), new Date(2174, 10, 25);
      let Rw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [Vu, Ig] })),
            e
          );
        })(),
        kw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({})),
            e
          );
        })();
      class to {
        constructor(n, t, r) {
          (this.nodes = n), (this.viewRef = t), (this.componentRef = r);
        }
      }
      let _3 = (() => {
        class e {
          constructor(t, r) {
            (this._el = t), (this._zone = r);
          }
          ngOnInit() {
            this._zone.onStable
              .asObservable()
              .pipe(bt(1))
              .subscribe(() => {
                Rt(
                  this._zone,
                  this._el.nativeElement,
                  (t, r) => {
                    r && ps(t), t.classList.add("show");
                  },
                  { animation: this.animation, runningTransition: "continue" }
                );
              });
          }
          hide() {
            return Rt(
              this._zone,
              this._el.nativeElement,
              ({ classList: t }) => t.remove("show"),
              { animation: this.animation, runningTransition: "stop" }
            );
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(_(De), _(Ce));
          }),
          (e.ɵcmp = Oe({
            type: e,
            selectors: [["ngb-modal-backdrop"]],
            hostAttrs: [2, "z-index", "1055"],
            hostVars: 6,
            hostBindings: function (t, r) {
              2 & t &&
                (ui(
                  "modal-backdrop" +
                    (r.backdropClass ? " " + r.backdropClass : "")
                ),
                te("show", !r.animation)("fade", r.animation));
            },
            inputs: { animation: "animation", backdropClass: "backdropClass" },
            standalone: !0,
            features: [Nt],
            decls: 0,
            vars: 0,
            template: function (t, r) {},
            encapsulation: 2,
          })),
          e
        );
      })();
      class Fw {
        update(n) {}
        close(n) {}
        dismiss(n) {}
      }
      const v3 = [
          "animation",
          "ariaLabelledBy",
          "ariaDescribedBy",
          "backdrop",
          "centered",
          "fullscreen",
          "keyboard",
          "scrollable",
          "size",
          "windowClass",
          "modalDialogClass",
        ],
        y3 = ["animation", "backdropClass"];
      class b3 {
        constructor(n, t, r, i) {
          (this._windowCmptRef = n),
            (this._contentRef = t),
            (this._backdropCmptRef = r),
            (this._beforeDismiss = i),
            (this._closed = new Pe()),
            (this._dismissed = new Pe()),
            (this._hidden = new Pe()),
            n.instance.dismissEvent.subscribe((o) => {
              this.dismiss(o);
            }),
            (this.result = new Promise((o, s) => {
              (this._resolve = o), (this._reject = s);
            })),
            this.result.then(null, () => {});
        }
        _applyWindowOptions(n, t) {
          v3.forEach((r) => {
            Ki(t[r]) && (n[r] = t[r]);
          });
        }
        _applyBackdropOptions(n, t) {
          y3.forEach((r) => {
            Ki(t[r]) && (n[r] = t[r]);
          });
        }
        update(n) {
          this._applyWindowOptions(this._windowCmptRef.instance, n),
            this._backdropCmptRef &&
              this._backdropCmptRef.instance &&
              this._applyBackdropOptions(this._backdropCmptRef.instance, n);
        }
        get componentInstance() {
          if (this._contentRef && this._contentRef.componentRef)
            return this._contentRef.componentRef.instance;
        }
        get closed() {
          return this._closed.asObservable().pipe(ct(this._hidden));
        }
        get dismissed() {
          return this._dismissed.asObservable().pipe(ct(this._hidden));
        }
        get hidden() {
          return this._hidden.asObservable();
        }
        get shown() {
          return this._windowCmptRef.instance.shown.asObservable();
        }
        close(n) {
          this._windowCmptRef &&
            (this._closed.next(n),
            this._resolve(n),
            this._removeModalElements());
        }
        _dismiss(n) {
          this._dismissed.next(n), this._reject(n), this._removeModalElements();
        }
        dismiss(n) {
          if (this._windowCmptRef)
            if (this._beforeDismiss) {
              const t = this._beforeDismiss();
              !(function ZC(e) {
                return e && e.then;
              })(t)
                ? !1 !== t && this._dismiss(n)
                : t.then(
                    (r) => {
                      !1 !== r && this._dismiss(n);
                    },
                    () => {}
                  );
            } else this._dismiss(n);
        }
        _removeModalElements() {
          const n = this._windowCmptRef.instance.hide(),
            t = this._backdropCmptRef
              ? this._backdropCmptRef.instance.hide()
              : q(void 0);
          n.subscribe(() => {
            const { nativeElement: r } = this._windowCmptRef.location;
            r.parentNode.removeChild(r),
              this._windowCmptRef.destroy(),
              this._contentRef &&
                this._contentRef.viewRef &&
                this._contentRef.viewRef.destroy(),
              (this._windowCmptRef = null),
              (this._contentRef = null);
          }),
            t.subscribe(() => {
              if (this._backdropCmptRef) {
                const { nativeElement: r } = this._backdropCmptRef.location;
                r.parentNode.removeChild(r),
                  this._backdropCmptRef.destroy(),
                  (this._backdropCmptRef = null);
              }
            }),
            mu(n, t).subscribe(() => {
              this._hidden.next(), this._hidden.complete();
            });
        }
      }
      var al = (() => {
        return (
          ((e = al || (al = {}))[(e.BACKDROP_CLICK = 0)] = "BACKDROP_CLICK"),
          (e[(e.ESC = 1)] = "ESC"),
          al
        );
        var e;
      })();
      let D3 = (() => {
          class e {
            constructor(t, r, i) {
              (this._document = t),
                (this._elRef = r),
                (this._zone = i),
                (this._closed$ = new Pe()),
                (this._elWithFocus = null),
                (this.backdrop = !0),
                (this.keyboard = !0),
                (this.dismissEvent = new W()),
                (this.shown = new Pe()),
                (this.hidden = new Pe());
            }
            get fullscreenClass() {
              return !0 === this.fullscreen
                ? " modal-fullscreen"
                : fs(this.fullscreen)
                ? ` modal-fullscreen-${this.fullscreen}-down`
                : "";
            }
            dismiss(t) {
              this.dismissEvent.emit(t);
            }
            ngOnInit() {
              (this._elWithFocus = this._document.activeElement),
                this._zone.onStable
                  .asObservable()
                  .pipe(bt(1))
                  .subscribe(() => {
                    this._show();
                  });
            }
            ngOnDestroy() {
              this._disableEventHandling();
            }
            hide() {
              const { nativeElement: t } = this._elRef,
                r = { animation: this.animation, runningTransition: "stop" },
                s = mu(
                  Rt(this._zone, t, () => t.classList.remove("show"), r),
                  Rt(this._zone, this._dialogEl.nativeElement, () => {}, r)
                );
              return (
                s.subscribe(() => {
                  this.hidden.next(), this.hidden.complete();
                }),
                this._disableEventHandling(),
                this._restoreFocus(),
                s
              );
            }
            _show() {
              const t = {
                animation: this.animation,
                runningTransition: "continue",
              };
              mu(
                Rt(
                  this._zone,
                  this._elRef.nativeElement,
                  (o, s) => {
                    s && ps(o), o.classList.add("show");
                  },
                  t
                ),
                Rt(this._zone, this._dialogEl.nativeElement, () => {}, t)
              ).subscribe(() => {
                this.shown.next(), this.shown.complete();
              }),
                this._enableEventHandling(),
                this._setFocus();
            }
            _enableEventHandling() {
              const { nativeElement: t } = this._elRef;
              this._zone.runOutsideAngular(() => {
                $t(t, "keydown")
                  .pipe(
                    ct(this._closed$),
                    At((i) => i.which === ye.Escape)
                  )
                  .subscribe((i) => {
                    this.keyboard
                      ? requestAnimationFrame(() => {
                          i.defaultPrevented ||
                            this._zone.run(() => this.dismiss(al.ESC));
                        })
                      : "static" === this.backdrop && this._bumpBackdrop();
                  });
                let r = !1;
                $t(this._dialogEl.nativeElement, "mousedown")
                  .pipe(
                    ct(this._closed$),
                    ht(() => (r = !1)),
                    zn(() => $t(t, "mouseup").pipe(ct(this._closed$), bt(1))),
                    At(({ target: i }) => t === i)
                  )
                  .subscribe(() => {
                    r = !0;
                  }),
                  $t(t, "click")
                    .pipe(ct(this._closed$))
                    .subscribe(({ target: i }) => {
                      t === i &&
                        ("static" === this.backdrop
                          ? this._bumpBackdrop()
                          : !0 === this.backdrop &&
                            !r &&
                            this._zone.run(() =>
                              this.dismiss(al.BACKDROP_CLICK)
                            )),
                        (r = !1);
                    });
              });
            }
            _disableEventHandling() {
              this._closed$.next();
            }
            _setFocus() {
              const { nativeElement: t } = this._elRef;
              if (!t.contains(document.activeElement)) {
                const r = t.querySelector("[ngbAutofocus]"),
                  i = yw(t)[0];
                (r || i || t).focus();
              }
            }
            _restoreFocus() {
              const t = this._document.body,
                r = this._elWithFocus;
              let i;
              (i = r && r.focus && t.contains(r) ? r : t),
                this._zone.runOutsideAngular(() => {
                  setTimeout(() => i.focus()), (this._elWithFocus = null);
                });
            }
            _bumpBackdrop() {
              "static" === this.backdrop &&
                Rt(
                  this._zone,
                  this._elRef.nativeElement,
                  ({ classList: t }) => (
                    t.add("modal-static"), () => t.remove("modal-static")
                  ),
                  { animation: this.animation, runningTransition: "continue" }
                );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(lt), _(De), _(Ce));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-modal-window"]],
              viewQuery: function (t, r) {
                if ((1 & t && Vi(nV, 7), 2 & t)) {
                  let i;
                  we((i = Ee())) && (r._dialogEl = i.first);
                }
              },
              hostAttrs: ["role", "dialog", "tabindex", "-1"],
              hostVars: 7,
              hostBindings: function (t, r) {
                2 & t &&
                  (ve("aria-modal", !0)("aria-labelledby", r.ariaLabelledBy)(
                    "aria-describedby",
                    r.ariaDescribedBy
                  ),
                  ui(
                    "modal d-block" + (r.windowClass ? " " + r.windowClass : "")
                  ),
                  te("fade", r.animation));
              },
              inputs: {
                animation: "animation",
                ariaLabelledBy: "ariaLabelledBy",
                ariaDescribedBy: "ariaDescribedBy",
                backdrop: "backdrop",
                centered: "centered",
                fullscreen: "fullscreen",
                keyboard: "keyboard",
                scrollable: "scrollable",
                size: "size",
                windowClass: "windowClass",
                modalDialogClass: "modalDialogClass",
              },
              outputs: { dismissEvent: "dismiss" },
              standalone: !0,
              features: [Nt],
              ngContentSelectors: xu,
              decls: 4,
              vars: 2,
              consts: [
                ["role", "document"],
                ["dialog", ""],
                [1, "modal-content"],
              ],
              template: function (t, r) {
                1 & t && (wa(), p(0, "div", 0, 1)(2, "div", 2), Ea(3), m()()),
                  2 & t &&
                    ui(
                      "modal-dialog" +
                        (r.size ? " modal-" + r.size : "") +
                        (r.centered ? " modal-dialog-centered" : "") +
                        r.fullscreenClass +
                        (r.scrollable ? " modal-dialog-scrollable" : "") +
                        (r.modalDialogClass ? " " + r.modalDialogClass : "")
                    );
              },
              styles: [
                "ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n",
              ],
              encapsulation: 2,
            })),
            e
          );
        })(),
        C3 = (() => {
          class e {
            constructor(t) {
              this._document = t;
            }
            hide() {
              const t = Math.abs(
                  window.innerWidth - this._document.documentElement.clientWidth
                ),
                r = this._document.body,
                i = r.style,
                { overflow: o, paddingRight: s } = i;
              if (t > 0) {
                const a = parseFloat(window.getComputedStyle(r).paddingRight);
                i.paddingRight = `${a + t}px`;
              }
              return (
                (i.overflow = "hidden"),
                () => {
                  t > 0 && (i.paddingRight = s), (i.overflow = o);
                }
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(lt));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        w3 = (() => {
          class e {
            constructor(t, r, i, o, s, a, l) {
              (this._applicationRef = t),
                (this._injector = r),
                (this._environmentInjector = i),
                (this._document = o),
                (this._scrollBar = s),
                (this._rendererFactory = a),
                (this._ngZone = l),
                (this._activeWindowCmptHasChanged = new Pe()),
                (this._ariaHiddenValues = new Map()),
                (this._scrollBarRestoreFn = null),
                (this._modalRefs = []),
                (this._windowCmpts = []),
                (this._activeInstances = new W()),
                this._activeWindowCmptHasChanged.subscribe(() => {
                  if (this._windowCmpts.length) {
                    const c = this._windowCmpts[this._windowCmpts.length - 1];
                    ((e, n, t, r = !1) => {
                      e.runOutsideAngular(() => {
                        const i = $t(n, "focusin").pipe(
                          ct(t),
                          Z((o) => o.target)
                        );
                        $t(n, "keydown")
                          .pipe(
                            ct(t),
                            At((o) => o.which === ye.Tab),
                            Gp(i)
                          )
                          .subscribe(([o, s]) => {
                            const [a, l] = yw(n);
                            (s === a || s === n) &&
                              o.shiftKey &&
                              (l.focus(), o.preventDefault()),
                              s === l &&
                                !o.shiftKey &&
                                (a.focus(), o.preventDefault());
                          }),
                          r &&
                            $t(n, "click")
                              .pipe(
                                ct(t),
                                Gp(i),
                                Z((o) => o[1])
                              )
                              .subscribe((o) => o.focus());
                      });
                    })(
                      this._ngZone,
                      c.location.nativeElement,
                      this._activeWindowCmptHasChanged
                    ),
                      this._revertAriaHidden(),
                      this._setAriaHidden(c.location.nativeElement);
                  }
                });
            }
            _restoreScrollBar() {
              const t = this._scrollBarRestoreFn;
              t && ((this._scrollBarRestoreFn = null), t());
            }
            _hideScrollBar() {
              this._scrollBarRestoreFn ||
                (this._scrollBarRestoreFn = this._scrollBar.hide());
            }
            open(t, r, i) {
              const o =
                  i.container instanceof HTMLElement
                    ? i.container
                    : Ki(i.container)
                    ? this._document.querySelector(i.container)
                    : this._document.body,
                s = this._rendererFactory.createRenderer(null, null);
              if (!o)
                throw new Error(
                  `The specified modal container "${
                    i.container || "body"
                  }" was not found in the DOM.`
                );
              this._hideScrollBar();
              const a = new Fw(),
                l =
                  (t = i.injector || t).get(Hn, null) ||
                  this._environmentInjector,
                c = this._getContentRef(t, l, r, a, i);
              let u = !1 !== i.backdrop ? this._attachBackdrop(o) : void 0,
                d = this._attachWindowComponent(o, c.nodes),
                f = new b3(d, c, u, i.beforeDismiss);
              return (
                this._registerModalRef(f),
                this._registerWindowCmpt(d),
                f.hidden.pipe(bt(1)).subscribe(() =>
                  Promise.resolve(!0).then(() => {
                    this._modalRefs.length ||
                      (s.removeClass(this._document.body, "modal-open"),
                      this._restoreScrollBar(),
                      this._revertAriaHidden());
                  })
                ),
                (a.close = (h) => {
                  f.close(h);
                }),
                (a.dismiss = (h) => {
                  f.dismiss(h);
                }),
                (a.update = (h) => {
                  f.update(h);
                }),
                f.update(i),
                1 === this._modalRefs.length &&
                  s.addClass(this._document.body, "modal-open"),
                u && u.instance && u.changeDetectorRef.detectChanges(),
                d.changeDetectorRef.detectChanges(),
                f
              );
            }
            get activeInstances() {
              return this._activeInstances;
            }
            dismissAll(t) {
              this._modalRefs.forEach((r) => r.dismiss(t));
            }
            hasOpenModals() {
              return this._modalRefs.length > 0;
            }
            _attachBackdrop(t) {
              let r = up(_3, {
                environmentInjector: this._applicationRef.injector,
                elementInjector: this._injector,
              });
              return (
                this._applicationRef.attachView(r.hostView),
                t.appendChild(r.location.nativeElement),
                r
              );
            }
            _attachWindowComponent(t, r) {
              let i = up(D3, {
                environmentInjector: this._applicationRef.injector,
                elementInjector: this._injector,
                projectableNodes: r,
              });
              return (
                this._applicationRef.attachView(i.hostView),
                t.appendChild(i.location.nativeElement),
                i
              );
            }
            _getContentRef(t, r, i, o, s) {
              return i
                ? i instanceof Ge
                  ? this._createFromTemplateRef(i, o)
                  : fs(i)
                  ? this._createFromString(i)
                  : this._createFromComponent(t, r, i, o, s)
                : new to([]);
            }
            _createFromTemplateRef(t, r) {
              const o = t.createEmbeddedView({
                $implicit: r,
                close(s) {
                  r.close(s);
                },
                dismiss(s) {
                  r.dismiss(s);
                },
              });
              return (
                this._applicationRef.attachView(o), new to([o.rootNodes], o)
              );
            }
            _createFromString(t) {
              const r = this._document.createTextNode(`${t}`);
              return new to([[r]]);
            }
            _createFromComponent(t, r, i, o, s) {
              const l = up(i, {
                  environmentInjector: r,
                  elementInjector: gn.create({
                    providers: [{ provide: Fw, useValue: o }],
                    parent: t,
                  }),
                }),
                c = l.location.nativeElement;
              return (
                s.scrollable && c.classList.add("component-host-scrollable"),
                this._applicationRef.attachView(l.hostView),
                new to([[c]], l.hostView, l)
              );
            }
            _setAriaHidden(t) {
              const r = t.parentElement;
              r &&
                t !== this._document.body &&
                (Array.from(r.children).forEach((i) => {
                  i !== t &&
                    "SCRIPT" !== i.nodeName &&
                    (this._ariaHiddenValues.set(
                      i,
                      i.getAttribute("aria-hidden")
                    ),
                    i.setAttribute("aria-hidden", "true"));
                }),
                this._setAriaHidden(r));
            }
            _revertAriaHidden() {
              this._ariaHiddenValues.forEach((t, r) => {
                t
                  ? r.setAttribute("aria-hidden", t)
                  : r.removeAttribute("aria-hidden");
              }),
                this._ariaHiddenValues.clear();
            }
            _registerModalRef(t) {
              const r = () => {
                const i = this._modalRefs.indexOf(t);
                i > -1 &&
                  (this._modalRefs.splice(i, 1),
                  this._activeInstances.emit(this._modalRefs));
              };
              this._modalRefs.push(t),
                this._activeInstances.emit(this._modalRefs),
                t.result.then(r, r);
            }
            _registerWindowCmpt(t) {
              this._windowCmpts.push(t),
                this._activeWindowCmptHasChanged.next(),
                t.onDestroy(() => {
                  const r = this._windowCmpts.indexOf(t);
                  r > -1 &&
                    (this._windowCmpts.splice(r, 1),
                    this._activeWindowCmptHasChanged.next());
                });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(
                L(is),
                L(gn),
                L(Hn),
                L(lt),
                L(C3),
                L(eh),
                L(Ce)
              );
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        E3 = (() => {
          class e {
            constructor(t) {
              (this._ngbConfig = t),
                (this.backdrop = !0),
                (this.fullscreen = !1),
                (this.keyboard = !0);
            }
            get animation() {
              return void 0 === this._animation
                ? this._ngbConfig.animation
                : this._animation;
            }
            set animation(t) {
              this._animation = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Yi));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        S3 = (() => {
          class e {
            constructor(t, r, i) {
              (this._injector = t), (this._modalStack = r), (this._config = i);
            }
            open(t, r = {}) {
              const i = {
                ...this._config,
                animation: this._config.animation,
                ...r,
              };
              return this._modalStack.open(this._injector, t, i);
            }
            get activeInstances() {
              return this._modalStack.activeInstances;
            }
            dismissAll(t) {
              this._modalStack.dismissAll(t);
            }
            hasOpenModals() {
              return this._modalStack.hasOpenModals();
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(gn), L(w3), L(E3));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Lw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ providers: [S3] })),
            e
          );
        })();
      const A3 = ({ classList: e }) => (
          e.remove("show"), () => e.remove("active")
        ),
        R3 = (e, n) => {
          n && ps(e), e.classList.add("show");
        };
      let xg = (() => {
          class e {
            constructor(t) {
              this.elRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(De));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["", "ngbNavPane", ""]],
              hostAttrs: [1, "tab-pane"],
              hostVars: 5,
              hostBindings: function (t, r) {
                2 & t &&
                  (Tn("id", r.item.panelDomId),
                  ve(
                    "role",
                    r.role ? r.role : r.nav.roles ? "tabpanel" : void 0
                  )("aria-labelledby", r.item.domId),
                  te("fade", r.nav.animation));
              },
              inputs: { item: "item", nav: "nav", role: "role" },
              standalone: !0,
            })),
            e
          );
        })(),
        Hw = (() => {
          class e {
            constructor(t, r) {
              (this._cd = t), (this._ngZone = r), (this._activePane = null);
            }
            isPanelTransitioning(t) {
              return this._activePane?.item === t;
            }
            ngAfterViewInit() {
              this._updateActivePane(),
                this.nav.navItemChange$
                  .pipe(
                    ct(this.nav.destroy$),
                    _u(this._activePane?.item || null),
                    $p(),
                    (function u2(e) {
                      return At((n, t) => e <= t);
                    })(1)
                  )
                  .subscribe((t) => {
                    const r = {
                      animation: this.nav.animation,
                      runningTransition: "stop",
                    };
                    this._cd.detectChanges(),
                      this._activePane
                        ? Rt(
                            this._ngZone,
                            this._activePane.elRef.nativeElement,
                            A3,
                            r
                          ).subscribe(() => {
                            const i = this._activePane?.item;
                            (this._activePane = this._getPaneForItem(t)),
                              this._cd.markForCheck(),
                              this._activePane &&
                                (this._activePane.elRef.nativeElement.classList.add(
                                  "active"
                                ),
                                Rt(
                                  this._ngZone,
                                  this._activePane.elRef.nativeElement,
                                  R3,
                                  r
                                ).subscribe(() => {
                                  t &&
                                    (t.shown.emit(), this.nav.shown.emit(t.id));
                                })),
                              i &&
                                (i.hidden.emit(), this.nav.hidden.emit(i.id));
                          })
                        : this._updateActivePane();
                  });
            }
            _updateActivePane() {
              (this._activePane = this._getActivePane()),
                this._activePane?.elRef.nativeElement.classList.add("show"),
                this._activePane?.elRef.nativeElement.classList.add("active");
            }
            _getPaneForItem(t) {
              return (
                (this._panes && this._panes.find((r) => r.item === t)) || null
              );
            }
            _getActivePane() {
              return (
                (this._panes && this._panes.find((t) => t.item.active)) || null
              );
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(_n), _(Ce));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["", "ngbNavOutlet", ""]],
              viewQuery: function (t, r) {
                if ((1 & t && Vi(xg, 5), 2 & t)) {
                  let i;
                  we((i = Ee())) && (r._panes = i);
                }
              },
              hostVars: 2,
              hostBindings: function (t, r) {
                2 & t && te("tab-content", !0);
              },
              inputs: { paneRole: "paneRole", nav: ["ngbNavOutlet", "nav"] },
              standalone: !0,
              features: [Nt],
              attrs: rV,
              decls: 1,
              vars: 1,
              consts: [
                ["ngFor", "", 3, "ngForOf"],
                ["ngbNavPane", "", 3, "item", "nav", "role", 4, "ngIf"],
                ["ngbNavPane", "", 3, "item", "nav", "role"],
                [3, "ngTemplateOutlet", "ngTemplateOutletContext"],
              ],
              template: function (t, r) {
                1 & t && C(0, sV, 1, 1, "ng-template", 0),
                  2 & t && v("ngForOf", r.nav.items);
              },
              dependencies: [xg, Zt, kt, qr],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })(),
        Uw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [Hw] })),
            e
          );
        })(),
        x3 = (() => {
          class e {
            constructor() {
              (this.disabled = !1),
                (this.boundaryLinks = !1),
                (this.directionLinks = !0),
                (this.ellipses = !0),
                (this.maxSize = 0),
                (this.pageSize = 10),
                (this.rotate = !1);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        $w = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPaginationEllipsis", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        Gw = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPaginationFirst", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        jw = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPaginationLast", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        zw = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPaginationNext", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        Ww = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPaginationNumber", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        qw = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPaginationPrevious", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        Kw = (() => {
          class e {
            constructor(t) {
              this.templateRef = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(Ge));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["ng-template", "ngbPaginationPages", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        Yw = (() => {
          class e {
            constructor(t) {
              (this.pageCount = 0),
                (this.pages = []),
                (this.page = 1),
                (this.pageChange = new W(!0)),
                (this.disabled = t.disabled),
                (this.boundaryLinks = t.boundaryLinks),
                (this.directionLinks = t.directionLinks),
                (this.ellipses = t.ellipses),
                (this.maxSize = t.maxSize),
                (this.pageSize = t.pageSize),
                (this.rotate = t.rotate),
                (this.size = t.size);
            }
            hasPrevious() {
              return this.page > 1;
            }
            hasNext() {
              return this.page < this.pageCount;
            }
            nextDisabled() {
              return !this.hasNext() || this.disabled;
            }
            previousDisabled() {
              return !this.hasPrevious() || this.disabled;
            }
            selectPage(t) {
              this._updatePages(t);
            }
            ngOnChanges(t) {
              this._updatePages(this.page);
            }
            isEllipsis(t) {
              return -1 === t;
            }
            _applyEllipses(t, r) {
              this.ellipses &&
                (t > 0 &&
                  (t > 2
                    ? this.pages.unshift(-1)
                    : 2 === t && this.pages.unshift(2),
                  this.pages.unshift(1)),
                r < this.pageCount &&
                  (r < this.pageCount - 2
                    ? this.pages.push(-1)
                    : r === this.pageCount - 2 &&
                      this.pages.push(this.pageCount - 1),
                  this.pages.push(this.pageCount)));
            }
            _applyRotation() {
              let t = 0,
                r = this.pageCount,
                i = Math.floor(this.maxSize / 2);
              return (
                this.page <= i
                  ? (r = this.maxSize)
                  : this.pageCount - this.page < i
                  ? (t = this.pageCount - this.maxSize)
                  : ((t = this.page - i - 1),
                    (r = this.page + (this.maxSize % 2 == 0 ? i - 1 : i))),
                [t, r]
              );
            }
            _applyPagination() {
              let r = (Math.ceil(this.page / this.maxSize) - 1) * this.maxSize;
              return [r, r + this.maxSize];
            }
            _setPageInRange(t) {
              const r = this.page;
              (this.page = Pu(t, this.pageCount, 1)),
                this.page !== r &&
                  ut(this.collectionSize) &&
                  this.pageChange.emit(this.page);
            }
            _updatePages(t) {
              (this.pageCount = Math.ceil(this.collectionSize / this.pageSize)),
                ut(this.pageCount) || (this.pageCount = 0),
                (this.pages.length = 0);
              for (let r = 1; r <= this.pageCount; r++) this.pages.push(r);
              if (
                (this._setPageInRange(t),
                this.maxSize > 0 && this.pageCount > this.maxSize)
              ) {
                let r = 0,
                  i = this.pageCount;
                ([r, i] = this.rotate
                  ? this._applyRotation()
                  : this._applyPagination()),
                  (this.pages = this.pages.slice(r, i)),
                  this._applyEllipses(r, i);
              }
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(x3));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-pagination"]],
              contentQueries: function (t, r, i) {
                if (
                  (1 & t &&
                    (je(i, $w, 5),
                    je(i, Gw, 5),
                    je(i, jw, 5),
                    je(i, zw, 5),
                    je(i, Ww, 5),
                    je(i, qw, 5),
                    je(i, Kw, 5)),
                  2 & t)
                ) {
                  let o;
                  we((o = Ee())) && (r.tplEllipsis = o.first),
                    we((o = Ee())) && (r.tplFirst = o.first),
                    we((o = Ee())) && (r.tplLast = o.first),
                    we((o = Ee())) && (r.tplNext = o.first),
                    we((o = Ee())) && (r.tplNumber = o.first),
                    we((o = Ee())) && (r.tplPrevious = o.first),
                    we((o = Ee())) && (r.tplPages = o.first);
                }
              },
              hostAttrs: ["role", "navigation"],
              inputs: {
                disabled: "disabled",
                boundaryLinks: "boundaryLinks",
                directionLinks: "directionLinks",
                ellipses: "ellipses",
                rotate: "rotate",
                collectionSize: "collectionSize",
                maxSize: "maxSize",
                page: "page",
                pageSize: "pageSize",
                size: "size",
              },
              outputs: { pageChange: "pageChange" },
              standalone: !0,
              features: [ot, Nt],
              decls: 20,
              vars: 12,
              consts: function () {
                let n, t, r, i, o, s, a, l;
                return (
                  (n = $localize`:@@ngb.pagination.first:««`),
                  (t = $localize`:@@ngb.pagination.previous:«`),
                  (r = $localize`:@@ngb.pagination.next:»`),
                  (i = $localize`:@@ngb.pagination.last:»»`),
                  (o = $localize`:@@ngb.pagination.first-aria:First`),
                  (s = $localize`:@@ngb.pagination.previous-aria:Previous`),
                  (a = $localize`:@@ngb.pagination.next-aria:Next`),
                  (l = $localize`:@@ngb.pagination.last-aria:Last`),
                  [
                    ["first", ""],
                    ["previous", ""],
                    ["next", ""],
                    ["last", ""],
                    ["ellipsis", ""],
                    ["defaultNumber", ""],
                    ["defaultPages", ""],
                    ["class", "page-item", 3, "disabled", 4, "ngIf"],
                    [3, "ngTemplateOutlet", "ngTemplateOutletContext"],
                    ["aria-hidden", "true"],
                    n,
                    t,
                    r,
                    i,
                    [
                      "class",
                      "page-item",
                      3,
                      "active",
                      "disabled",
                      4,
                      "ngFor",
                      "ngForOf",
                    ],
                    [1, "page-item"],
                    [
                      "class",
                      "page-link",
                      "tabindex",
                      "-1",
                      "aria-disabled",
                      "true",
                      4,
                      "ngIf",
                    ],
                    ["class", "page-link", "href", "", 3, "click", 4, "ngIf"],
                    ["tabindex", "-1", "aria-disabled", "true", 1, "page-link"],
                    ["href", "", 1, "page-link", 3, "click"],
                    ["aria-label", o, "href", "", 1, "page-link", 3, "click"],
                    ["aria-label", s, "href", "", 1, "page-link", 3, "click"],
                    ["aria-label", a, "href", "", 1, "page-link", 3, "click"],
                    ["aria-label", l, "href", "", 1, "page-link", 3, "click"],
                  ]
                );
              },
              template: function (t, r) {
                if (
                  (1 & t &&
                    (C(0, aV, 2, 0, "ng-template", null, 0, rn),
                    C(2, lV, 2, 0, "ng-template", null, 1, rn),
                    C(4, cV, 2, 0, "ng-template", null, 2, rn),
                    C(6, uV, 2, 0, "ng-template", null, 3, rn),
                    C(8, dV, 1, 0, "ng-template", null, 4, rn),
                    C(10, fV, 1, 1, "ng-template", null, 5, rn),
                    C(12, bV, 1, 1, "ng-template", null, 6, rn),
                    p(14, "ul"),
                    C(15, CV, 3, 9, "li", 7),
                    C(16, SV, 3, 8, "li", 7),
                    C(17, MV, 0, 0, "ng-template", 8),
                    C(18, NV, 3, 9, "li", 7),
                    C(19, OV, 3, 9, "li", 7),
                    m()),
                  2 & t)
                ) {
                  const i = mn(13);
                  g(14),
                    ui("pagination" + (r.size ? " pagination-" + r.size : "")),
                    g(1),
                    v("ngIf", r.boundaryLinks),
                    g(1),
                    v("ngIf", r.directionLinks),
                    g(1),
                    v(
                      "ngTemplateOutlet",
                      (null == r.tplPages ? null : r.tplPages.templateRef) || i
                    )(
                      "ngTemplateOutletContext",
                      Fh(8, AV, r.page, r.pages, r.disabled)
                    ),
                    g(1),
                    v("ngIf", r.directionLinks),
                    g(1),
                    v("ngIf", r.boundaryLinks);
                }
              },
              dependencies: [kt, Zt, qr],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })(),
        Jw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [Yw] })),
            e
          );
        })(),
        Qw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({})),
            e
          );
        })(),
        V3 = (() => {
          class e {
            constructor() {
              (this.max = 100),
                (this.animated = !1),
                (this.ariaLabel = "progress bar"),
                (this.striped = !1),
                (this.showValue = !1);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        H3 = (() => {
          class e {
            constructor(t) {
              (this.value = 0),
                (this.max = t.max),
                (this.animated = t.animated),
                (this.ariaLabel = t.ariaLabel),
                (this.striped = t.striped),
                (this.textType = t.textType),
                (this.type = t.type),
                (this.showValue = t.showValue),
                (this.height = t.height);
            }
            set max(t) {
              this._max = !ut(t) || t <= 0 ? 100 : t;
            }
            get max() {
              return this._max;
            }
            getValue() {
              return Pu(this.value, this.max);
            }
            getPercentValue() {
              return (100 * this.getValue()) / this.max;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(V3));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-progressbar"]],
              hostAttrs: [
                "role",
                "progressbar",
                "aria-valuemin",
                "0",
                1,
                "progress",
              ],
              hostVars: 5,
              hostBindings: function (t, r) {
                2 & t &&
                  (ve("aria-valuenow", r.getValue())("aria-valuemax", r.max)(
                    "aria-label",
                    r.ariaLabel
                  ),
                  Zo("height", r.height));
              },
              inputs: {
                max: "max",
                animated: "animated",
                ariaLabel: "ariaLabel",
                striped: "striped",
                showValue: "showValue",
                textType: "textType",
                type: "type",
                value: "value",
                height: "height",
              },
              standalone: !0,
              features: [Nt],
              ngContentSelectors: xu,
              decls: 3,
              vars: 11,
              consts: function () {
                let n;
                return (
                  (n = $localize`:@@ngb.progressbar.value:${"\ufffd0\ufffd"}:INTERPOLATION:`),
                  [[4, "ngIf"], n]
                );
              },
              template: function (t, r) {
                1 & t &&
                  (wa(), p(0, "div"), C(1, PV, 3, 3, "span", 0), Ea(2), m()),
                  2 & t &&
                    ((function C1(e, n, t, r, i) {
                      er(Sn, br, Go(x(), e, n, t, r, i), !0);
                    })(
                      "progress-bar",
                      r.type
                        ? r.textType
                          ? " bg-" + r.type
                          : " text-bg-" + r.type
                        : "",
                      "",
                      r.textType ? " text-" + r.textType : "",
                      ""
                    ),
                    Zo("width", r.getPercentValue(), "%"),
                    te("progress-bar-animated", r.animated)(
                      "progress-bar-striped",
                      r.striped
                    ),
                    g(1),
                    v("ngIf", r.showValue));
              },
              dependencies: [kt, W0],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })(),
        Xw = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [H3] })),
            e
          );
        })(),
        U3 = (() => {
          class e {
            constructor() {
              (this.max = 10),
                (this.readonly = !1),
                (this.resettable = !1),
                (this.tabindex = 0);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        eE = (() => {
          class e {
            constructor(t, r) {
              (this._changeDetectorRef = r),
                (this.contexts = []),
                (this.disabled = !1),
                (this.hover = new W()),
                (this.leave = new W()),
                (this.rateChange = new W(!0)),
                (this.onChange = (i) => {}),
                (this.onTouched = () => {}),
                (this.max = t.max),
                (this.readonly = t.readonly),
                (this.tabindex = t.tabindex);
            }
            ariaValueText(t, r) {
              return `${t} out of ${r}`;
            }
            isInteractive() {
              return !this.readonly && !this.disabled;
            }
            enter(t) {
              this.isInteractive() && this._updateState(t), this.hover.emit(t);
            }
            handleBlur() {
              this.onTouched();
            }
            handleClick(t) {
              this.isInteractive() &&
                this.update(this.resettable && this.rate === t ? 0 : t);
            }
            handleKeyDown(t) {
              switch (t.which) {
                case ye.ArrowDown:
                case ye.ArrowLeft:
                  this.update(this.rate - 1);
                  break;
                case ye.ArrowUp:
                case ye.ArrowRight:
                  this.update(this.rate + 1);
                  break;
                case ye.Home:
                  this.update(0);
                  break;
                case ye.End:
                  this.update(this.max);
                  break;
                default:
                  return;
              }
              t.preventDefault();
            }
            ngOnChanges(t) {
              t.rate && this.update(this.rate), t.max && this._updateMax();
            }
            ngOnInit() {
              this._setupContexts(), this._updateState(this.rate);
            }
            registerOnChange(t) {
              this.onChange = t;
            }
            registerOnTouched(t) {
              this.onTouched = t;
            }
            reset() {
              this.leave.emit(this.nextRate), this._updateState(this.rate);
            }
            setDisabledState(t) {
              this.disabled = t;
            }
            update(t, r = !0) {
              const i = Pu(t, this.max, 0);
              this.isInteractive() &&
                this.rate !== i &&
                ((this.rate = i), this.rateChange.emit(this.rate)),
                r && (this.onChange(this.rate), this.onTouched()),
                this._updateState(this.rate);
            }
            writeValue(t) {
              this.update(t, !1), this._changeDetectorRef.markForCheck();
            }
            _updateState(t) {
              (this.nextRate = t),
                this.contexts.forEach(
                  (r, i) => (r.fill = Math.round(100 * Pu(t - i, 1, 0)))
                );
            }
            _updateMax() {
              this.max > 0 && (this._setupContexts(), this.update(this.rate));
            }
            _setupContexts() {
              this.contexts = Array.from({ length: this.max }, (t, r) => ({
                fill: 0,
                index: r,
              }));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(U3), _(_n));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-rating"]],
              contentQueries: function (t, r, i) {
                if ((1 & t && je(i, Ge, 5), 2 & t)) {
                  let o;
                  we((o = Ee())) && (r.starTemplateFromContent = o.first);
                }
              },
              hostAttrs: [
                "role",
                "slider",
                "aria-valuemin",
                "0",
                1,
                "d-inline-flex",
              ],
              hostVars: 5,
              hostBindings: function (t, r) {
                1 & t &&
                  P("blur", function () {
                    return r.handleBlur();
                  })("keydown", function (o) {
                    return r.handleKeyDown(o);
                  })("mouseleave", function () {
                    return r.reset();
                  }),
                  2 & t &&
                    (Tn("tabindex", r.disabled ? -1 : r.tabindex),
                    ve("aria-valuemax", r.max)("aria-valuenow", r.nextRate)(
                      "aria-valuetext",
                      r.ariaValueText(r.nextRate, r.max)
                    )("aria-disabled", !!r.readonly || null));
              },
              inputs: {
                max: "max",
                rate: "rate",
                readonly: "readonly",
                resettable: "resettable",
                starTemplate: "starTemplate",
                tabindex: "tabindex",
                ariaValueText: "ariaValueText",
              },
              outputs: {
                hover: "hover",
                leave: "leave",
                rateChange: "rateChange",
              },
              standalone: !0,
              features: [
                Fe([{ provide: yn, useExisting: oe(() => e), multi: !0 }]),
                ot,
                Nt,
              ],
              decls: 3,
              vars: 1,
              consts: [
                ["t", ""],
                ["ngFor", "", 3, "ngForOf"],
                [1, "visually-hidden"],
                [3, "mouseenter", "click"],
                [3, "ngTemplateOutlet", "ngTemplateOutletContext"],
              ],
              template: function (t, r) {
                1 & t &&
                  (C(0, kV, 1, 1, "ng-template", null, 0, rn),
                  C(2, LV, 4, 5, "ng-template", 1)),
                  2 & t && (g(2), v("ngForOf", r.contexts));
              },
              dependencies: [Zt, qr],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })(),
        tE = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [eE] })),
            e
          );
        })();
      class nE {
        constructor(n, t, r) {
          (this.hour = jt(n)), (this.minute = jt(t)), (this.second = jt(r));
        }
        changeHour(n = 1) {
          this.updateHour((isNaN(this.hour) ? 0 : this.hour) + n);
        }
        updateHour(n) {
          this.hour = ut(n) ? (n < 0 ? 24 + n : n) % 24 : NaN;
        }
        changeMinute(n = 1) {
          this.updateMinute((isNaN(this.minute) ? 0 : this.minute) + n);
        }
        updateMinute(n) {
          ut(n)
            ? ((this.minute = n % 60 < 0 ? 60 + (n % 60) : n % 60),
              this.changeHour(Math.floor(n / 60)))
            : (this.minute = NaN);
        }
        changeSecond(n = 1) {
          this.updateSecond((isNaN(this.second) ? 0 : this.second) + n);
        }
        updateSecond(n) {
          ut(n)
            ? ((this.second = n < 0 ? 60 + (n % 60) : n % 60),
              this.changeMinute(Math.floor(n / 60)))
            : (this.second = NaN);
        }
        isValid(n = !0) {
          return ut(this.hour) && ut(this.minute) && (!n || ut(this.second));
        }
        toString() {
          return `${this.hour || 0}:${this.minute || 0}:${this.second || 0}`;
        }
      }
      let $3 = (() => {
          class e {
            constructor() {
              (this.meridian = !1),
                (this.spinners = !0),
                (this.seconds = !1),
                (this.hourStep = 1),
                (this.minuteStep = 1),
                (this.secondStep = 1),
                (this.disabled = !1),
                (this.readonlyInputs = !1),
                (this.size = "medium");
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        rE = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function () {
                return (function G3() {
                  return new j3();
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        j3 = (() => {
          class e extends rE {
            fromModel(t) {
              return t && rt(t.hour) && rt(t.minute)
                ? {
                    hour: t.hour,
                    minute: t.minute,
                    second: rt(t.second) ? t.second : null,
                  }
                : null;
            }
            toModel(t) {
              return t && rt(t.hour) && rt(t.minute)
                ? {
                    hour: t.hour,
                    minute: t.minute,
                    second: rt(t.second) ? t.second : null,
                  }
                : null;
            }
          }
          return (
            (e.ɵfac = (function () {
              let n;
              return function (r) {
                return (n || (n = st(e)))(r || e);
              };
            })()),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        iE = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function (t) {
                let r = null;
                return (
                  (r = t
                    ? new t()
                    : (function z3(e) {
                        return new W3(e);
                      })(L(Nn))),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        W3 = (() => {
          class e extends iE {
            constructor(t) {
              super(), (this._periods = N0(t, Ze.Standalone, ue.Narrow));
            }
            getMorningPeriod() {
              return this._periods[0];
            }
            getAfternoonPeriod() {
              return this._periods[1];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Nn));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const q3 = /[^0-9]/g;
      let K3 = (() => {
          class e {
            constructor(t, r, i, o) {
              (this._config = t),
                (this._ngbTimeAdapter = r),
                (this._cd = i),
                (this.i18n = o),
                (this.onChange = (s) => {}),
                (this.onTouched = () => {}),
                (this.meridian = t.meridian),
                (this.spinners = t.spinners),
                (this.seconds = t.seconds),
                (this.hourStep = t.hourStep),
                (this.minuteStep = t.minuteStep),
                (this.secondStep = t.secondStep),
                (this.disabled = t.disabled),
                (this.readonlyInputs = t.readonlyInputs),
                (this.size = t.size);
            }
            set hourStep(t) {
              this._hourStep = rt(t) ? t : this._config.hourStep;
            }
            get hourStep() {
              return this._hourStep;
            }
            set minuteStep(t) {
              this._minuteStep = rt(t) ? t : this._config.minuteStep;
            }
            get minuteStep() {
              return this._minuteStep;
            }
            set secondStep(t) {
              this._secondStep = rt(t) ? t : this._config.secondStep;
            }
            get secondStep() {
              return this._secondStep;
            }
            writeValue(t) {
              const r = this._ngbTimeAdapter.fromModel(t);
              (this.model = r ? new nE(r.hour, r.minute, r.second) : new nE()),
                !this.seconds &&
                  (!r || !ut(r.second)) &&
                  (this.model.second = 0),
                this._cd.markForCheck();
            }
            registerOnChange(t) {
              this.onChange = t;
            }
            registerOnTouched(t) {
              this.onTouched = t;
            }
            setDisabledState(t) {
              this.disabled = t;
            }
            changeHour(t) {
              this.model?.changeHour(t), this.propagateModelChange();
            }
            changeMinute(t) {
              this.model?.changeMinute(t), this.propagateModelChange();
            }
            changeSecond(t) {
              this.model?.changeSecond(t), this.propagateModelChange();
            }
            updateHour(t) {
              const r = !!this.model && this.model.hour >= 12,
                i = jt(t);
              this.model?.updateHour(
                this.meridian && ((r && i < 12) || (!r && 12 === i))
                  ? i + 12
                  : i
              ),
                this.propagateModelChange();
            }
            updateMinute(t) {
              this.model?.updateMinute(jt(t)), this.propagateModelChange();
            }
            updateSecond(t) {
              this.model?.updateSecond(jt(t)), this.propagateModelChange();
            }
            toggleMeridian() {
              this.meridian && this.changeHour(12);
            }
            formatInput(t) {
              t.value = t.value.replace(q3, "");
            }
            formatHour(t) {
              return ut(t)
                ? hs(this.meridian ? (t % 12 == 0 ? 12 : t % 12) : t % 24)
                : hs(NaN);
            }
            formatMinSec(t) {
              return hs(ut(t) ? t : NaN);
            }
            handleBlur() {
              this.onTouched();
            }
            get isSmallSize() {
              return "small" === this.size;
            }
            get isLargeSize() {
              return "large" === this.size;
            }
            ngOnChanges(t) {
              t.seconds &&
                !this.seconds &&
                this.model &&
                !ut(this.model.second) &&
                ((this.model.second = 0), this.propagateModelChange(!1));
            }
            propagateModelChange(t = !0) {
              t && this.onTouched(),
                this.model?.isValid(this.seconds)
                  ? this.onChange(
                      this._ngbTimeAdapter.toModel({
                        hour: this.model.hour,
                        minute: this.model.minute,
                        second: this.model.second,
                      })
                    )
                  : this.onChange(this._ngbTimeAdapter.toModel(null));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_($3), _(rE), _(_n), _(iE));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-timepicker"]],
              inputs: {
                meridian: "meridian",
                spinners: "spinners",
                seconds: "seconds",
                hourStep: "hourStep",
                minuteStep: "minuteStep",
                secondStep: "secondStep",
                readonlyInputs: "readonlyInputs",
                size: "size",
              },
              exportAs: ["ngbTimepicker"],
              standalone: !0,
              features: [
                Fe([{ provide: yn, useExisting: oe(() => e), multi: !0 }]),
                ot,
                Nt,
              ],
              decls: 16,
              vars: 25,
              consts: function () {
                let n, t, r, i, o, s, a, l, c, u, d, f, h, y;
                return (
                  (n = $localize`:@@ngb.timepicker.HH:HH`),
                  (t = $localize`:@@ngb.timepicker.hours:Hours`),
                  (r = $localize`:@@ngb.timepicker.MM:MM`),
                  (i = $localize`:@@ngb.timepicker.minutes:Minutes`),
                  (o = $localize`:@@ngb.timepicker.increment-hours:Increment hours`),
                  (s = $localize`:@@ngb.timepicker.decrement-hours:Decrement hours`),
                  (a = $localize`:@@ngb.timepicker.increment-minutes:Increment minutes`),
                  (l = $localize`:@@ngb.timepicker.decrement-minutes:Decrement minutes`),
                  (c = $localize`:@@ngb.timepicker.SS:SS`),
                  (u = $localize`:@@ngb.timepicker.seconds:Seconds`),
                  (d = $localize`:@@ngb.timepicker.increment-seconds:Increment seconds`),
                  (f = $localize`:@@ngb.timepicker.decrement-seconds:Decrement seconds`),
                  (h = $localize`:@@ngb.timepicker.PM:${"\ufffd0\ufffd"}:INTERPOLATION:`),
                  (y = $localize`:@@ngb.timepicker.AM:${"\ufffd0\ufffd"}:INTERPOLATION:`),
                  [
                    [3, "disabled"],
                    [1, "ngb-tp"],
                    [1, "ngb-tp-input-container", "ngb-tp-hour"],
                    [
                      "tabindex",
                      "-1",
                      "type",
                      "button",
                      "class",
                      "btn btn-link",
                      3,
                      "btn-sm",
                      "btn-lg",
                      "disabled",
                      "click",
                      4,
                      "ngIf",
                    ],
                    [
                      "type",
                      "text",
                      "maxlength",
                      "2",
                      "inputmode",
                      "numeric",
                      "placeholder",
                      n,
                      "aria-label",
                      t,
                      1,
                      "ngb-tp-input",
                      "form-control",
                      3,
                      "value",
                      "readOnly",
                      "disabled",
                      "change",
                      "blur",
                      "input",
                      "keydown.ArrowUp",
                      "keydown.ArrowDown",
                    ],
                    [1, "ngb-tp-spacer"],
                    [1, "ngb-tp-input-container", "ngb-tp-minute"],
                    [
                      "type",
                      "text",
                      "maxlength",
                      "2",
                      "inputmode",
                      "numeric",
                      "placeholder",
                      r,
                      "aria-label",
                      i,
                      1,
                      "ngb-tp-input",
                      "form-control",
                      3,
                      "value",
                      "readOnly",
                      "disabled",
                      "change",
                      "blur",
                      "input",
                      "keydown.ArrowUp",
                      "keydown.ArrowDown",
                    ],
                    ["class", "ngb-tp-spacer", 4, "ngIf"],
                    [
                      "class",
                      "ngb-tp-input-container ngb-tp-second",
                      4,
                      "ngIf",
                    ],
                    ["class", "ngb-tp-meridian", 4, "ngIf"],
                    [
                      "tabindex",
                      "-1",
                      "type",
                      "button",
                      1,
                      "btn",
                      "btn-link",
                      3,
                      "disabled",
                      "click",
                    ],
                    [1, "chevron", "ngb-tp-chevron"],
                    [1, "visually-hidden"],
                    o,
                    [1, "chevron", "ngb-tp-chevron", "bottom"],
                    s,
                    a,
                    l,
                    [1, "ngb-tp-input-container", "ngb-tp-second"],
                    [
                      "type",
                      "text",
                      "maxlength",
                      "2",
                      "inputmode",
                      "numeric",
                      "placeholder",
                      c,
                      "aria-label",
                      u,
                      1,
                      "ngb-tp-input",
                      "form-control",
                      3,
                      "value",
                      "readOnly",
                      "disabled",
                      "change",
                      "blur",
                      "input",
                      "keydown.ArrowUp",
                      "keydown.ArrowDown",
                    ],
                    d,
                    f,
                    [1, "ngb-tp-meridian"],
                    [
                      "type",
                      "button",
                      1,
                      "btn",
                      "btn-outline-primary",
                      3,
                      "disabled",
                      "click",
                    ],
                    [4, "ngIf", "ngIfElse"],
                    ["am", ""],
                    h,
                    y,
                  ]
                );
              },
              template: function (t, r) {
                1 & t &&
                  (p(0, "fieldset", 0)(1, "div", 1)(2, "div", 2),
                  C(3, BV, 4, 7, "button", 3),
                  p(4, "input", 4),
                  P("change", function (o) {
                    return r.updateHour(o.target.value);
                  })("blur", function () {
                    return r.handleBlur();
                  })("input", function (o) {
                    return r.formatInput(o.target);
                  })("keydown.ArrowUp", function (o) {
                    return r.changeHour(r.hourStep), o.preventDefault();
                  })("keydown.ArrowDown", function (o) {
                    return r.changeHour(-r.hourStep), o.preventDefault();
                  }),
                  m(),
                  C(5, VV, 4, 7, "button", 3),
                  m(),
                  p(6, "div", 5),
                  N(7, ":"),
                  m(),
                  p(8, "div", 6),
                  C(9, HV, 4, 7, "button", 3),
                  p(10, "input", 7),
                  P("change", function (o) {
                    return r.updateMinute(o.target.value);
                  })("blur", function () {
                    return r.handleBlur();
                  })("input", function (o) {
                    return r.formatInput(o.target);
                  })("keydown.ArrowUp", function (o) {
                    return r.changeMinute(r.minuteStep), o.preventDefault();
                  })("keydown.ArrowDown", function (o) {
                    return r.changeMinute(-r.minuteStep), o.preventDefault();
                  }),
                  m(),
                  C(11, UV, 4, 7, "button", 3),
                  m(),
                  C(12, $V, 2, 0, "div", 8),
                  C(13, zV, 4, 9, "div", 9),
                  C(14, WV, 1, 0, "div", 8),
                  C(15, YV, 5, 9, "div", 10),
                  m()()),
                  2 & t &&
                    (te("disabled", r.disabled),
                    v("disabled", r.disabled),
                    g(3),
                    v("ngIf", r.spinners),
                    g(1),
                    te("form-control-sm", r.isSmallSize)(
                      "form-control-lg",
                      r.isLargeSize
                    ),
                    v(
                      "value",
                      r.formatHour(null == r.model ? null : r.model.hour)
                    )("readOnly", r.readonlyInputs)("disabled", r.disabled),
                    g(1),
                    v("ngIf", r.spinners),
                    g(4),
                    v("ngIf", r.spinners),
                    g(1),
                    te("form-control-sm", r.isSmallSize)(
                      "form-control-lg",
                      r.isLargeSize
                    ),
                    v(
                      "value",
                      r.formatMinSec(null == r.model ? null : r.model.minute)
                    )("readOnly", r.readonlyInputs)("disabled", r.disabled),
                    g(1),
                    v("ngIf", r.spinners),
                    g(1),
                    v("ngIf", r.seconds),
                    g(1),
                    v("ngIf", r.seconds),
                    g(1),
                    v("ngIf", r.meridian),
                    g(1),
                    v("ngIf", r.meridian));
              },
              dependencies: [kt],
              styles: [
                'ngb-timepicker{font-size:1rem}.ngb-tp{display:flex;align-items:center}.ngb-tp-input-container{width:4em}.ngb-tp-chevron:before{border-style:solid;border-width:.29em .29em 0 0;content:"";display:inline-block;height:.69em;left:.05em;position:relative;top:.15em;transform:rotate(-45deg);vertical-align:middle;width:.69em}.ngb-tp-chevron.bottom:before{top:-.3em;transform:rotate(135deg)}.ngb-tp-input{text-align:center}.ngb-tp-hour,.ngb-tp-minute,.ngb-tp-second,.ngb-tp-meridian{display:flex;flex-direction:column;align-items:center;justify-content:space-around}.ngb-tp-spacer{width:1em;text-align:center}\n',
              ],
              encapsulation: 2,
            })),
            e
          );
        })(),
        oE = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [K3] })),
            e
          );
        })();
      const Y3 = (e, n) => {
          const { classList: t } = e;
          if (n)
            return (
              t.add("fade"),
              ps(e),
              t.add("show", "showing"),
              () => {
                t.remove("showing");
              }
            );
          t.add("show");
        },
        J3 = ({ classList: e }) => (
          e.add("showing"),
          () => {
            e.remove("show", "showing");
          }
        );
      let Z3 = (() => {
          class e {
            constructor(t) {
              (this._ngbConfig = t),
                (this.autohide = !0),
                (this.delay = 5e3),
                (this.ariaLive = "polite");
            }
            get animation() {
              return void 0 === this._animation
                ? this._ngbConfig.animation
                : this._animation;
            }
            set animation(t) {
              this._animation = t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(Yi));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Q3 = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["", "ngbToastHeader", ""]],
              standalone: !0,
            })),
            e
          );
        })(),
        X3 = (() => {
          class e {
            constructor(t, r, i, o) {
              (this.ariaLive = t),
                (this._zone = i),
                (this._element = o),
                (this.contentHeaderTpl = null),
                (this.shown = new W()),
                (this.hidden = new W()),
                null == this.ariaLive && (this.ariaLive = r.ariaLive),
                (this.delay = r.delay),
                (this.autohide = r.autohide),
                (this.animation = r.animation);
            }
            ngAfterContentInit() {
              this._zone.onStable
                .asObservable()
                .pipe(bt(1))
                .subscribe(() => {
                  this._init(), this.show();
                });
            }
            ngOnChanges(t) {
              "autohide" in t && (this._clearTimeout(), this._init());
            }
            hide() {
              this._clearTimeout();
              const t = Rt(this._zone, this._element.nativeElement, J3, {
                animation: this.animation,
                runningTransition: "stop",
              });
              return (
                t.subscribe(() => {
                  this.hidden.emit();
                }),
                t
              );
            }
            show() {
              const t = Rt(this._zone, this._element.nativeElement, Y3, {
                animation: this.animation,
                runningTransition: "continue",
              });
              return (
                t.subscribe(() => {
                  this.shown.emit();
                }),
                t
              );
            }
            _init() {
              this.autohide &&
                !this._timeoutID &&
                (this._timeoutID = setTimeout(() => this.hide(), this.delay));
            }
            _clearTimeout() {
              this._timeoutID &&
                (clearTimeout(this._timeoutID), (this._timeoutID = null));
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(si("aria-live"), _(Z3), _(Ce), _(De));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-toast"]],
              contentQueries: function (t, r, i) {
                if ((1 & t && je(i, Q3, 7, Ge), 2 & t)) {
                  let o;
                  we((o = Ee())) && (r.contentHeaderTpl = o.first);
                }
              },
              hostAttrs: ["role", "alert", "aria-atomic", "true", 1, "toast"],
              hostVars: 3,
              hostBindings: function (t, r) {
                2 & t && (ve("aria-live", r.ariaLive), te("fade", r.animation));
              },
              inputs: {
                animation: "animation",
                delay: "delay",
                autohide: "autohide",
                header: "header",
              },
              outputs: { shown: "shown", hidden: "hidden" },
              exportAs: ["ngbToast"],
              standalone: !0,
              features: [ot, Nt],
              ngContentSelectors: xu,
              decls: 5,
              vars: 1,
              consts: function () {
                let n;
                return (
                  (n = $localize`:@@ngb.toast.close-aria:Close`),
                  [
                    ["headerTpl", ""],
                    [3, "ngIf"],
                    [1, "toast-body"],
                    [1, "me-auto"],
                    [1, "toast-header"],
                    [3, "ngTemplateOutlet"],
                    [
                      "type",
                      "button",
                      "aria-label",
                      n,
                      1,
                      "btn-close",
                      3,
                      "click",
                    ],
                  ]
                );
              },
              template: function (t, r) {
                1 & t &&
                  (wa(),
                  C(0, JV, 2, 1, "ng-template", null, 0, rn),
                  C(2, QV, 3, 1, "ng-template", 1),
                  p(3, "div", 2),
                  Ea(4),
                  m()),
                  2 & t && (g(2), v("ngIf", r.contentHeaderTpl || r.header));
              },
              dependencies: [kt, qr],
              styles: [
                "ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n",
              ],
              encapsulation: 2,
            })),
            e
          );
        })(),
        sE = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [X3] })),
            e
          );
        })(),
        aE = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({})),
            e
          );
        })(),
        eU = (() => {
          class e {
            constructor() {
              (this.highlightClass = "ngb-highlight"),
                (this.accentSensitive = !0);
            }
            ngOnChanges(t) {
              !this.accentSensitive &&
                !String.prototype.normalize &&
                (console.warn(
                  "The `accentSensitive` input in `ngb-highlight` cannot be set to `false` in a browser that does not implement the `String.normalize` function. You will have to include a polyfill in your application to use this feature in the current browser."
                ),
                (this.accentSensitive = !0));
              const r = JC(this.result),
                i = Array.isArray(this.term) ? this.term : [this.term],
                o = (c) => (this.accentSensitive ? c : XC(c)),
                s = i
                  .map((c) =>
                    (function iH(e) {
                      return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                    })(o(JC(c)))
                  )
                  .filter((c) => c),
                a = this.accentSensitive ? r : XC(r),
                l = s.length
                  ? a.split(new RegExp(`(${s.join("|")})`, "gmi"))
                  : [r];
              if (this.accentSensitive) this.parts = l;
              else {
                let c = 0;
                this.parts = l.map((u) => r.substring(c, (c += u.length)));
              }
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["ngb-highlight"]],
              inputs: {
                highlightClass: "highlightClass",
                result: "result",
                term: "term",
                accentSensitive: "accentSensitive",
              },
              standalone: !0,
              features: [ot, Nt],
              decls: 1,
              vars: 1,
              consts: [
                ["ngFor", "", 3, "ngForOf"],
                [3, "class", 4, "ngIf", "ngIfElse"],
                ["even", ""],
              ],
              template: function (t, r) {
                1 & t && C(0, tH, 3, 2, "ng-template", 0),
                  2 & t && v("ngForOf", r.parts);
              },
              dependencies: [kt, Zt],
              styles: [".ngb-highlight{font-weight:700}\n"],
              encapsulation: 2,
              changeDetection: 0,
            })),
            e
          );
        })();
      new z("live announcer delay", {
        providedIn: "root",
        factory: function tU() {
          return 100;
        },
      });
      let lE = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({ imports: [eU] })),
            e
          );
        })(),
        cE = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵmod = ke({ type: e })),
            (e.ɵinj = Ie({})),
            e
          );
        })();
      const nU = [
        lw,
        cw,
        dw,
        fw,
        Rw,
        kw,
        Lw,
        Uw,
        cE,
        Jw,
        Qw,
        Xw,
        tE,
        oE,
        sE,
        aE,
        lE,
      ];
      let rU = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = ke({ type: e })),
          (e.ɵinj = Ie({
            imports: [
              nU,
              lw,
              cw,
              dw,
              fw,
              Rw,
              kw,
              Lw,
              Uw,
              cE,
              Jw,
              Qw,
              Xw,
              tE,
              oE,
              sE,
              aE,
              lE,
            ],
          })),
          e
        );
      })();
      function bi(e, n) {
        return _e(n) ? St(e, n, 1) : St(e, 1);
      }
      class qu {}
      class Pg {}
      class Er {
        constructor(n) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            n
              ? (this.lazyInit =
                  "string" == typeof n
                    ? () => {
                        (this.headers = new Map()),
                          n.split("\n").forEach((t) => {
                            const r = t.indexOf(":");
                            if (r > 0) {
                              const i = t.slice(0, r),
                                o = i.toLowerCase(),
                                s = t.slice(r + 1).trim();
                              this.maybeSetNormalizedName(i, o),
                                this.headers.has(o)
                                  ? this.headers.get(o).push(s)
                                  : this.headers.set(o, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.entries(n).forEach(([t, r]) => {
                            let i;
                            if (
                              ((i =
                                "string" == typeof r
                                  ? [r]
                                  : "number" == typeof r
                                  ? [r.toString()]
                                  : r.map((o) => o.toString())),
                              i.length > 0)
                            ) {
                              const o = t.toLowerCase();
                              this.headers.set(o, i),
                                this.maybeSetNormalizedName(t, o);
                            }
                          });
                      })
              : (this.headers = new Map());
        }
        has(n) {
          return this.init(), this.headers.has(n.toLowerCase());
        }
        get(n) {
          this.init();
          const t = this.headers.get(n.toLowerCase());
          return t && t.length > 0 ? t[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(n) {
          return this.init(), this.headers.get(n.toLowerCase()) || null;
        }
        append(n, t) {
          return this.clone({ name: n, value: t, op: "a" });
        }
        set(n, t) {
          return this.clone({ name: n, value: t, op: "s" });
        }
        delete(n, t) {
          return this.clone({ name: n, value: t, op: "d" });
        }
        maybeSetNormalizedName(n, t) {
          this.normalizedNames.has(t) || this.normalizedNames.set(t, n);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Er
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((n) => this.applyUpdate(n)),
              (this.lazyUpdate = null)));
        }
        copyFrom(n) {
          n.init(),
            Array.from(n.headers.keys()).forEach((t) => {
              this.headers.set(t, n.headers.get(t)),
                this.normalizedNames.set(t, n.normalizedNames.get(t));
            });
        }
        clone(n) {
          const t = new Er();
          return (
            (t.lazyInit =
              this.lazyInit && this.lazyInit instanceof Er
                ? this.lazyInit
                : this),
            (t.lazyUpdate = (this.lazyUpdate || []).concat([n])),
            t
          );
        }
        applyUpdate(n) {
          const t = n.name.toLowerCase();
          switch (n.op) {
            case "a":
            case "s":
              let r = n.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(n.name, t);
              const i = ("a" === n.op ? this.headers.get(t) : void 0) || [];
              i.push(...r), this.headers.set(t, i);
              break;
            case "d":
              const o = n.value;
              if (o) {
                let s = this.headers.get(t);
                if (!s) return;
                (s = s.filter((a) => -1 === o.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(t), this.normalizedNames.delete(t))
                    : this.headers.set(t, s);
              } else this.headers.delete(t), this.normalizedNames.delete(t);
          }
        }
        forEach(n) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((t) =>
              n(this.normalizedNames.get(t), this.headers.get(t))
            );
        }
      }
      class iU {
        encodeKey(n) {
          return uE(n);
        }
        encodeValue(n) {
          return uE(n);
        }
        decodeKey(n) {
          return decodeURIComponent(n);
        }
        decodeValue(n) {
          return decodeURIComponent(n);
        }
      }
      const sU = /%(\d[a-f0-9])/gi,
        aU = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function uE(e) {
        return encodeURIComponent(e).replace(sU, (n, t) => aU[t] ?? n);
      }
      function Ku(e) {
        return `${e}`;
      }
      class Jr {
        constructor(n = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = n.encoder || new iU()),
            n.fromString)
          ) {
            if (n.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function oU(e, n) {
              const t = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((i) => {
                      const o = i.indexOf("="),
                        [s, a] =
                          -1 == o
                            ? [n.decodeKey(i), ""]
                            : [
                                n.decodeKey(i.slice(0, o)),
                                n.decodeValue(i.slice(o + 1)),
                              ],
                        l = t.get(s) || [];
                      l.push(a), t.set(s, l);
                    }),
                t
              );
            })(n.fromString, this.encoder);
          } else
            n.fromObject
              ? ((this.map = new Map()),
                Object.keys(n.fromObject).forEach((t) => {
                  const r = n.fromObject[t],
                    i = Array.isArray(r) ? r.map(Ku) : [Ku(r)];
                  this.map.set(t, i);
                }))
              : (this.map = null);
        }
        has(n) {
          return this.init(), this.map.has(n);
        }
        get(n) {
          this.init();
          const t = this.map.get(n);
          return t ? t[0] : null;
        }
        getAll(n) {
          return this.init(), this.map.get(n) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(n, t) {
          return this.clone({ param: n, value: t, op: "a" });
        }
        appendAll(n) {
          const t = [];
          return (
            Object.keys(n).forEach((r) => {
              const i = n[r];
              Array.isArray(i)
                ? i.forEach((o) => {
                    t.push({ param: r, value: o, op: "a" });
                  })
                : t.push({ param: r, value: i, op: "a" });
            }),
            this.clone(t)
          );
        }
        set(n, t) {
          return this.clone({ param: n, value: t, op: "s" });
        }
        delete(n, t) {
          return this.clone({ param: n, value: t, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((n) => {
                const t = this.encoder.encodeKey(n);
                return this.map
                  .get(n)
                  .map((r) => t + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((n) => "" !== n)
              .join("&")
          );
        }
        clone(n) {
          const t = new Jr({ encoder: this.encoder });
          return (
            (t.cloneFrom = this.cloneFrom || this),
            (t.updates = (this.updates || []).concat(n)),
            t
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((n) => this.map.set(n, this.cloneFrom.map.get(n))),
              this.updates.forEach((n) => {
                switch (n.op) {
                  case "a":
                  case "s":
                    const t =
                      ("a" === n.op ? this.map.get(n.param) : void 0) || [];
                    t.push(Ku(n.value)), this.map.set(n.param, t);
                    break;
                  case "d":
                    if (void 0 === n.value) {
                      this.map.delete(n.param);
                      break;
                    }
                    {
                      let r = this.map.get(n.param) || [];
                      const i = r.indexOf(Ku(n.value));
                      -1 !== i && r.splice(i, 1),
                        r.length > 0
                          ? this.map.set(n.param, r)
                          : this.map.delete(n.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class lU {
        constructor() {
          this.map = new Map();
        }
        set(n, t) {
          return this.map.set(n, t), this;
        }
        get(n) {
          return (
            this.map.has(n) || this.map.set(n, n.defaultValue()),
            this.map.get(n)
          );
        }
        delete(n) {
          return this.map.delete(n), this;
        }
        has(n) {
          return this.map.has(n);
        }
        keys() {
          return this.map.keys();
        }
      }
      function dE(e) {
        return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
      }
      function fE(e) {
        return typeof Blob < "u" && e instanceof Blob;
      }
      function hE(e) {
        return typeof FormData < "u" && e instanceof FormData;
      }
      class cl {
        constructor(n, t, r, i) {
          let o;
          if (
            ((this.url = t),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = n.toUpperCase()),
            (function cU(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || i
              ? ((this.body = void 0 !== r ? r : null), (o = i))
              : (o = r),
            o &&
              ((this.reportProgress = !!o.reportProgress),
              (this.withCredentials = !!o.withCredentials),
              o.responseType && (this.responseType = o.responseType),
              o.headers && (this.headers = o.headers),
              o.context && (this.context = o.context),
              o.params && (this.params = o.params)),
            this.headers || (this.headers = new Er()),
            this.context || (this.context = new lU()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = t;
            else {
              const a = t.indexOf("?");
              this.urlWithParams =
                t + (-1 === a ? "?" : a < t.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new Jr()), (this.urlWithParams = t);
        }
        serializeBody() {
          return null === this.body
            ? null
            : dE(this.body) ||
              fE(this.body) ||
              hE(this.body) ||
              (function uU(e) {
                return (
                  typeof URLSearchParams < "u" && e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof Jr
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || hE(this.body)
            ? null
            : fE(this.body)
            ? this.body.type || null
            : dE(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof Jr
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(n = {}) {
          const t = n.method || this.method,
            r = n.url || this.url,
            i = n.responseType || this.responseType,
            o = void 0 !== n.body ? n.body : this.body,
            s =
              void 0 !== n.withCredentials
                ? n.withCredentials
                : this.withCredentials,
            a =
              void 0 !== n.reportProgress
                ? n.reportProgress
                : this.reportProgress;
          let l = n.headers || this.headers,
            c = n.params || this.params;
          const u = n.context ?? this.context;
          return (
            void 0 !== n.setHeaders &&
              (l = Object.keys(n.setHeaders).reduce(
                (d, f) => d.set(f, n.setHeaders[f]),
                l
              )),
            n.setParams &&
              (c = Object.keys(n.setParams).reduce(
                (d, f) => d.set(f, n.setParams[f]),
                c
              )),
            new cl(t, r, o, {
              params: c,
              headers: l,
              context: u,
              reportProgress: a,
              responseType: i,
              withCredentials: s,
            })
          );
        }
      }
      var Dt = (() => (
        ((Dt = Dt || {})[(Dt.Sent = 0)] = "Sent"),
        (Dt[(Dt.UploadProgress = 1)] = "UploadProgress"),
        (Dt[(Dt.ResponseHeader = 2)] = "ResponseHeader"),
        (Dt[(Dt.DownloadProgress = 3)] = "DownloadProgress"),
        (Dt[(Dt.Response = 4)] = "Response"),
        (Dt[(Dt.User = 5)] = "User"),
        Dt
      ))();
      class kg {
        constructor(n, t = 200, r = "OK") {
          (this.headers = n.headers || new Er()),
            (this.status = void 0 !== n.status ? n.status : t),
            (this.statusText = n.statusText || r),
            (this.url = n.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Fg extends kg {
        constructor(n = {}) {
          super(n), (this.type = Dt.ResponseHeader);
        }
        clone(n = {}) {
          return new Fg({
            headers: n.headers || this.headers,
            status: void 0 !== n.status ? n.status : this.status,
            statusText: n.statusText || this.statusText,
            url: n.url || this.url || void 0,
          });
        }
      }
      class Yu extends kg {
        constructor(n = {}) {
          super(n),
            (this.type = Dt.Response),
            (this.body = void 0 !== n.body ? n.body : null);
        }
        clone(n = {}) {
          return new Yu({
            body: void 0 !== n.body ? n.body : this.body,
            headers: n.headers || this.headers,
            status: void 0 !== n.status ? n.status : this.status,
            statusText: n.statusText || this.statusText,
            url: n.url || this.url || void 0,
          });
        }
      }
      class pE extends kg {
        constructor(n) {
          super(n, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${n.url || "(unknown url)"}`
                : `Http failure response for ${n.url || "(unknown url)"}: ${
                    n.status
                  } ${n.statusText}`),
            (this.error = n.error || null);
        }
      }
      function Lg(e, n) {
        return {
          body: n,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let ys = (() => {
        class e {
          constructor(t) {
            this.handler = t;
          }
          request(t, r, i = {}) {
            let o;
            if (t instanceof cl) o = t;
            else {
              let l, c;
              (l = i.headers instanceof Er ? i.headers : new Er(i.headers)),
                i.params &&
                  (c =
                    i.params instanceof Jr
                      ? i.params
                      : new Jr({ fromObject: i.params })),
                (o = new cl(t, r, void 0 !== i.body ? i.body : null, {
                  headers: l,
                  context: i.context,
                  params: c,
                  reportProgress: i.reportProgress,
                  responseType: i.responseType || "json",
                  withCredentials: i.withCredentials,
                }));
            }
            const s = q(o).pipe(bi((l) => this.handler.handle(l)));
            if (t instanceof cl || "events" === i.observe) return s;
            const a = s.pipe(At((l) => l instanceof Yu));
            switch (i.observe || "body") {
              case "body":
                switch (o.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      Z((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      Z((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      Z((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(Z((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${i.observe}}`
                );
            }
          }
          delete(t, r = {}) {
            return this.request("DELETE", t, r);
          }
          get(t, r = {}) {
            return this.request("GET", t, r);
          }
          head(t, r = {}) {
            return this.request("HEAD", t, r);
          }
          jsonp(t, r) {
            return this.request("JSONP", t, {
              params: new Jr().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(t, r = {}) {
            return this.request("OPTIONS", t, r);
          }
          patch(t, r, i = {}) {
            return this.request("PATCH", t, Lg(i, r));
          }
          post(t, r, i = {}) {
            return this.request("POST", t, Lg(i, r));
          }
          put(t, r, i = {}) {
            return this.request("PUT", t, Lg(i, r));
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(qu));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function gE(e, n) {
        return n(e);
      }
      function dU(e, n) {
        return (t, r) => n.intercept(t, { handle: (i) => e(i, r) });
      }
      const hU = new z("HTTP_INTERCEPTORS"),
        ul = new z("HTTP_INTERCEPTOR_FNS");
      function pU() {
        let e = null;
        return (n, t) => (
          null === e &&
            (e = (se(hU, { optional: !0 }) ?? []).reduceRight(dU, gE)),
          e(n, t)
        );
      }
      let mE = (() => {
        class e extends qu {
          constructor(t, r) {
            super(),
              (this.backend = t),
              (this.injector = r),
              (this.chain = null);
          }
          handle(t) {
            if (null === this.chain) {
              const r = Array.from(new Set(this.injector.get(ul)));
              this.chain = r.reduceRight(
                (i, o) =>
                  (function fU(e, n, t) {
                    return (r, i) => t.runInContext(() => n(r, (o) => e(o, i)));
                  })(i, o, this.injector),
                gE
              );
            }
            return this.chain(t, (r) => this.backend.handle(r));
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(Pg), L(Hn));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const vU = /^\)\]\}',?\n/;
      let vE = (() => {
        class e {
          constructor(t) {
            this.xhrFactory = t;
          }
          handle(t) {
            if ("JSONP" === t.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed."
              );
            return new Me((r) => {
              const i = this.xhrFactory.build();
              if (
                (i.open(t.method, t.urlWithParams),
                t.withCredentials && (i.withCredentials = !0),
                t.headers.forEach((h, y) => i.setRequestHeader(h, y.join(","))),
                t.headers.has("Accept") ||
                  i.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*"
                  ),
                !t.headers.has("Content-Type"))
              ) {
                const h = t.detectContentTypeHeader();
                null !== h && i.setRequestHeader("Content-Type", h);
              }
              if (t.responseType) {
                const h = t.responseType.toLowerCase();
                i.responseType = "json" !== h ? h : "text";
              }
              const o = t.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = i.statusText || "OK",
                    y = new Er(i.getAllResponseHeaders()),
                    b =
                      (function yU(e) {
                        return "responseURL" in e && e.responseURL
                          ? e.responseURL
                          : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                          ? e.getResponseHeader("X-Request-URL")
                          : null;
                      })(i) || t.url;
                  return (
                    (s = new Fg({
                      headers: y,
                      status: i.status,
                      statusText: h,
                      url: b,
                    })),
                    s
                  );
                },
                l = () => {
                  let { headers: h, status: y, statusText: b, url: w } = a(),
                    S = null;
                  204 !== y &&
                    (S = typeof i.response > "u" ? i.responseText : i.response),
                    0 === y && (y = S ? 200 : 0);
                  let O = y >= 200 && y < 300;
                  if ("json" === t.responseType && "string" == typeof S) {
                    const T = S;
                    S = S.replace(vU, "");
                    try {
                      S = "" !== S ? JSON.parse(S) : null;
                    } catch (k) {
                      (S = T), O && ((O = !1), (S = { error: k, text: S }));
                    }
                  }
                  O
                    ? (r.next(
                        new Yu({
                          body: S,
                          headers: h,
                          status: y,
                          statusText: b,
                          url: w || void 0,
                        })
                      ),
                      r.complete())
                    : r.error(
                        new pE({
                          error: S,
                          headers: h,
                          status: y,
                          statusText: b,
                          url: w || void 0,
                        })
                      );
                },
                c = (h) => {
                  const { url: y } = a(),
                    b = new pE({
                      error: h,
                      status: i.status || 0,
                      statusText: i.statusText || "Unknown Error",
                      url: y || void 0,
                    });
                  r.error(b);
                };
              let u = !1;
              const d = (h) => {
                  u || (r.next(a()), (u = !0));
                  let y = { type: Dt.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (y.total = h.total),
                    "text" === t.responseType &&
                      i.responseText &&
                      (y.partialText = i.responseText),
                    r.next(y);
                },
                f = (h) => {
                  let y = { type: Dt.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (y.total = h.total), r.next(y);
                };
              return (
                i.addEventListener("load", l),
                i.addEventListener("error", c),
                i.addEventListener("timeout", c),
                i.addEventListener("abort", c),
                t.reportProgress &&
                  (i.addEventListener("progress", d),
                  null !== o &&
                    i.upload &&
                    i.upload.addEventListener("progress", f)),
                i.send(o),
                r.next({ type: Dt.Sent }),
                () => {
                  i.removeEventListener("error", c),
                    i.removeEventListener("abort", c),
                    i.removeEventListener("load", l),
                    i.removeEventListener("timeout", c),
                    t.reportProgress &&
                      (i.removeEventListener("progress", d),
                      null !== o &&
                        i.upload &&
                        i.upload.removeEventListener("progress", f)),
                    i.readyState !== i.DONE && i.abort();
                }
              );
            });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(Y0));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Bg = new z("XSRF_ENABLED"),
        yE = new z("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => "XSRF-TOKEN",
        }),
        bE = new z("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => "X-XSRF-TOKEN",
        });
      class DE {}
      let CU = (() => {
        class e {
          constructor(t, r, i) {
            (this.doc = t),
              (this.platform = r),
              (this.cookieName = i),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const t = this.doc.cookie || "";
            return (
              t !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = B0(t, this.cookieName)),
                (this.lastCookieString = t)),
              this.lastToken
            );
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(lt), L(qc), L(yE));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function wU(e, n) {
        const t = e.url.toLowerCase();
        if (
          !se(Bg) ||
          "GET" === e.method ||
          "HEAD" === e.method ||
          t.startsWith("http://") ||
          t.startsWith("https://")
        )
          return n(e);
        const r = se(DE).getToken(),
          i = se(bE);
        return (
          null != r &&
            !e.headers.has(i) &&
            (e = e.clone({ headers: e.headers.set(i, r) })),
          n(e)
        );
      }
      var pt = (() => (
        ((pt = pt || {})[(pt.Interceptors = 0)] = "Interceptors"),
        (pt[(pt.LegacyInterceptors = 1)] = "LegacyInterceptors"),
        (pt[(pt.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
        (pt[(pt.NoXsrfProtection = 3)] = "NoXsrfProtection"),
        (pt[(pt.JsonpSupport = 4)] = "JsonpSupport"),
        (pt[(pt.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
        pt
      ))();
      function bs(e, n) {
        return { ɵkind: e, ɵproviders: n };
      }
      function EU(...e) {
        const n = [
          ys,
          vE,
          mE,
          { provide: qu, useExisting: mE },
          { provide: Pg, useExisting: vE },
          { provide: ul, useValue: wU, multi: !0 },
          { provide: Bg, useValue: !0 },
          { provide: DE, useClass: CU },
        ];
        for (const t of e) n.push(...t.ɵproviders);
        return (function WN(e) {
          return { ɵproviders: e };
        })(n);
      }
      const CE = new z("LEGACY_INTERCEPTOR_FN");
      let MU = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵmod = ke({ type: e })),
          (e.ɵinj = Ie({
            providers: [
              EU(
                bs(pt.LegacyInterceptors, [
                  { provide: CE, useFactory: pU },
                  { provide: ul, useExisting: CE, multi: !0 },
                ])
              ),
            ],
          })),
          e
        );
      })();
      const Ju = Xr(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function wE(e) {
        return new Me((n) => {
          Et(e()).subscribe(n);
        });
      }
      function dl(e, n) {
        const t = _e(e) ? e : () => e,
          r = (i) => i.error(t());
        return new Me(n ? (i) => n.schedule(r, 0, i) : r);
      }
      function Vg() {
        return Qe((e, n) => {
          let t = null;
          e._refCount++;
          const r = Be(n, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (t = null);
            const i = e._connection,
              o = t;
            (t = null),
              i && (!o || i === o) && i.unsubscribe(),
              n.unsubscribe();
          });
          e.subscribe(r), r.closed || (t = e.connect());
        });
      }
      class EE extends Me {
        constructor(n, t) {
          super(),
            (this.source = n),
            (this.subjectFactory = t),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Hs(n) && (this.lift = n.lift);
        }
        _subscribe(n) {
          return this.getSubject().subscribe(n);
        }
        getSubject() {
          const n = this._subject;
          return (
            (!n || n.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: n } = this;
          (this._subject = this._connection = null), n?.unsubscribe();
        }
        connect() {
          let n = this._connection;
          if (!n) {
            n = this._connection = new gt();
            const t = this.getSubject();
            n.add(
              this.source.subscribe(
                Be(
                  t,
                  void 0,
                  () => {
                    this._teardown(), t.complete();
                  },
                  (r) => {
                    this._teardown(), t.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              n.closed && ((this._connection = null), (n = gt.EMPTY));
          }
          return n;
        }
        refCount() {
          return Vg()(this);
        }
      }
      function Zu(e) {
        return Qe((n, t) => {
          let r = !1;
          n.subscribe(
            Be(
              t,
              (i) => {
                (r = !0), t.next(i);
              },
              () => {
                r || t.next(e), t.complete();
              }
            )
          );
        });
      }
      function SE(e = TU) {
        return Qe((n, t) => {
          let r = !1;
          n.subscribe(
            Be(
              t,
              (i) => {
                (r = !0), t.next(i);
              },
              () => (r ? t.complete() : t.error(e()))
            )
          );
        });
      }
      function TU() {
        return new Ju();
      }
      function Di(e, n) {
        const t = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? At((i, o) => e(i, o, r)) : Kn,
            bt(1),
            t ? Zu(n) : SE(() => new Ju())
          );
      }
      function Sr(e) {
        return Qe((n, t) => {
          let o,
            r = null,
            i = !1;
          (r = n.subscribe(
            Be(t, void 0, void 0, (s) => {
              (o = Et(e(s, Sr(e)(n)))),
                r ? (r.unsubscribe(), (r = null), o.subscribe(t)) : (i = !0);
            })
          )),
            i && (r.unsubscribe(), (r = null), o.subscribe(t));
        });
      }
      function ME(e, n) {
        return Qe(
          (function NU(e, n, t, r, i) {
            return (o, s) => {
              let a = t,
                l = n,
                c = 0;
              o.subscribe(
                Be(
                  s,
                  (u) => {
                    const d = c++;
                    (l = a ? e(l, u, d) : ((a = !0), u)), r && s.next(l);
                  },
                  i &&
                    (() => {
                      a && s.next(l), s.complete();
                    })
                )
              );
            };
          })(e, n, arguments.length >= 2, !0)
        );
      }
      function Hg(e) {
        return e <= 0
          ? () => kn
          : Qe((n, t) => {
              let r = [];
              n.subscribe(
                Be(
                  t,
                  (i) => {
                    r.push(i), e < r.length && r.shift();
                  },
                  () => {
                    for (const i of r) t.next(i);
                    t.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function TE(e, n) {
        const t = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? At((i, o) => e(i, o, r)) : Kn,
            Hg(1),
            t ? Zu(n) : SE(() => new Ju())
          );
      }
      function Ug(e) {
        return Qe((n, t) => {
          try {
            n.subscribe(t);
          } finally {
            t.add(e);
          }
        });
      }
      const de = "primary",
        fl = Symbol("RouteTitle");
      class OU {
        constructor(n) {
          this.params = n || {};
        }
        has(n) {
          return Object.prototype.hasOwnProperty.call(this.params, n);
        }
        get(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t[0] : t;
          }
          return null;
        }
        getAll(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t : [t];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Ds(e) {
        return new OU(e);
      }
      function AU(e, n, t) {
        const r = t.path.split("/");
        if (
          r.length > e.length ||
          ("full" === t.pathMatch && (n.hasChildren() || r.length < e.length))
        )
          return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = e[o];
          if (s.startsWith(":")) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: i };
      }
      function Mr(e, n) {
        const t = e ? Object.keys(e) : void 0,
          r = n ? Object.keys(n) : void 0;
        if (!t || !r || t.length != r.length) return !1;
        let i;
        for (let o = 0; o < t.length; o++)
          if (((i = t[o]), !NE(e[i], n[i]))) return !1;
        return !0;
      }
      function NE(e, n) {
        if (Array.isArray(e) && Array.isArray(n)) {
          if (e.length !== n.length) return !1;
          const t = [...e].sort(),
            r = [...n].sort();
          return t.every((i, o) => r[o] === i);
        }
        return e === n;
      }
      function IE(e) {
        return Array.prototype.concat.apply([], e);
      }
      function OE(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function zt(e, n) {
        for (const t in e) e.hasOwnProperty(t) && n(e[t], t);
      }
      function Ci(e) {
        return wh(e) ? e : Ca(e) ? mt(Promise.resolve(e)) : q(e);
      }
      const Qu = !1,
        xU = {
          exact: function xE(e, n, t) {
            if (
              !no(e.segments, n.segments) ||
              !Xu(e.segments, n.segments, t) ||
              e.numberOfChildren !== n.numberOfChildren
            )
              return !1;
            for (const r in n.children)
              if (!e.children[r] || !xE(e.children[r], n.children[r], t))
                return !1;
            return !0;
          },
          subset: PE,
        },
        AE = {
          exact: function PU(e, n) {
            return Mr(e, n);
          },
          subset: function kU(e, n) {
            return (
              Object.keys(n).length <= Object.keys(e).length &&
              Object.keys(n).every((t) => NE(e[t], n[t]))
            );
          },
          ignored: () => !0,
        };
      function RE(e, n, t) {
        return (
          xU[t.paths](e.root, n.root, t.matrixParams) &&
          AE[t.queryParams](e.queryParams, n.queryParams) &&
          !("exact" === t.fragment && e.fragment !== n.fragment)
        );
      }
      function PE(e, n, t) {
        return kE(e, n, n.segments, t);
      }
      function kE(e, n, t, r) {
        if (e.segments.length > t.length) {
          const i = e.segments.slice(0, t.length);
          return !(!no(i, t) || n.hasChildren() || !Xu(i, t, r));
        }
        if (e.segments.length === t.length) {
          if (!no(e.segments, t) || !Xu(e.segments, t, r)) return !1;
          for (const i in n.children)
            if (!e.children[i] || !PE(e.children[i], n.children[i], r))
              return !1;
          return !0;
        }
        {
          const i = t.slice(0, e.segments.length),
            o = t.slice(e.segments.length);
          return (
            !!(no(e.segments, i) && Xu(e.segments, i, r) && e.children[de]) &&
            kE(e.children[de], n, o, r)
          );
        }
      }
      function Xu(e, n, t) {
        return n.every((r, i) => AE[t](e[i].parameters, r.parameters));
      }
      class wi {
        constructor(n = new me([], {}), t = {}, r = null) {
          (this.root = n), (this.queryParams = t), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Ds(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return BU.serialize(this);
        }
      }
      class me {
        constructor(n, t) {
          (this.segments = n),
            (this.children = t),
            (this.parent = null),
            zt(t, (r, i) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return ed(this);
        }
      }
      class hl {
        constructor(n, t) {
          (this.path = n), (this.parameters = t);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = Ds(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return BE(this);
        }
      }
      function no(e, n) {
        return e.length === n.length && e.every((t, r) => t.path === n[r].path);
      }
      let pl = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({
            token: e,
            factory: function () {
              return new $g();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      class $g {
        parse(n) {
          const t = new qU(n);
          return new wi(
            t.parseRootSegment(),
            t.parseQueryParams(),
            t.parseFragment()
          );
        }
        serialize(n) {
          const t = `/${gl(n.root, !0)}`,
            r = (function UU(e) {
              const n = Object.keys(e)
                .map((t) => {
                  const r = e[t];
                  return Array.isArray(r)
                    ? r.map((i) => `${td(t)}=${td(i)}`).join("&")
                    : `${td(t)}=${td(r)}`;
                })
                .filter((t) => !!t);
              return n.length ? `?${n.join("&")}` : "";
            })(n.queryParams);
          return `${t}${r}${
            "string" == typeof n.fragment
              ? `#${(function VU(e) {
                  return encodeURI(e);
                })(n.fragment)}`
              : ""
          }`;
        }
      }
      const BU = new $g();
      function ed(e) {
        return e.segments.map((n) => BE(n)).join("/");
      }
      function gl(e, n) {
        if (!e.hasChildren()) return ed(e);
        if (n) {
          const t = e.children[de] ? gl(e.children[de], !1) : "",
            r = [];
          return (
            zt(e.children, (i, o) => {
              o !== de && r.push(`${o}:${gl(i, !1)}`);
            }),
            r.length > 0 ? `${t}(${r.join("//")})` : t
          );
        }
        {
          const t = (function LU(e, n) {
            let t = [];
            return (
              zt(e.children, (r, i) => {
                i === de && (t = t.concat(n(r, i)));
              }),
              zt(e.children, (r, i) => {
                i !== de && (t = t.concat(n(r, i)));
              }),
              t
            );
          })(e, (r, i) =>
            i === de ? [gl(e.children[de], !1)] : [`${i}:${gl(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[de]
            ? `${ed(e)}/${t[0]}`
            : `${ed(e)}/(${t.join("//")})`;
        }
      }
      function FE(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function td(e) {
        return FE(e).replace(/%3B/gi, ";");
      }
      function Gg(e) {
        return FE(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function nd(e) {
        return decodeURIComponent(e);
      }
      function LE(e) {
        return nd(e.replace(/\+/g, "%20"));
      }
      function BE(e) {
        return `${Gg(e.path)}${(function HU(e) {
          return Object.keys(e)
            .map((n) => `;${Gg(n)}=${Gg(e[n])}`)
            .join("");
        })(e.parameters)}`;
      }
      const $U = /^[^\/()?;=#]+/;
      function rd(e) {
        const n = e.match($U);
        return n ? n[0] : "";
      }
      const GU = /^[^=?&#]+/,
        zU = /^[^&#]+/;
      class qU {
        constructor(n) {
          (this.url = n), (this.remaining = n);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new me([], {})
              : new me([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const n = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(n);
            } while (this.consumeOptional("&"));
          return n;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const n = [];
          for (
            this.peekStartsWith("(") || n.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), n.push(this.parseSegment());
          let t = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (t = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (n.length > 0 || Object.keys(t).length > 0) &&
              (r[de] = new me(n, t)),
            r
          );
        }
        parseSegment() {
          const n = rd(this.remaining);
          if ("" === n && this.peekStartsWith(";")) throw new B(4009, Qu);
          return this.capture(n), new hl(nd(n), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const n = {};
          for (; this.consumeOptional(";"); ) this.parseParam(n);
          return n;
        }
        parseParam(n) {
          const t = rd(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = rd(this.remaining);
            i && ((r = i), this.capture(r));
          }
          n[nd(t)] = nd(r);
        }
        parseQueryParam(n) {
          const t = (function jU(e) {
            const n = e.match(GU);
            return n ? n[0] : "";
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function WU(e) {
              const n = e.match(zU);
              return n ? n[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = LE(t),
            o = LE(r);
          if (n.hasOwnProperty(i)) {
            let s = n[i];
            Array.isArray(s) || ((s = [s]), (n[i] = s)), s.push(o);
          } else n[i] = o;
        }
        parseParens(n) {
          const t = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = rd(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new B(4010, Qu);
            let o;
            r.indexOf(":") > -1
              ? ((o = r.slice(0, r.indexOf(":"))),
                this.capture(o),
                this.capture(":"))
              : n && (o = de);
            const s = this.parseChildren();
            (t[o] = 1 === Object.keys(s).length ? s[de] : new me([], s)),
              this.consumeOptional("//");
          }
          return t;
        }
        peekStartsWith(n) {
          return this.remaining.startsWith(n);
        }
        consumeOptional(n) {
          return (
            !!this.peekStartsWith(n) &&
            ((this.remaining = this.remaining.substring(n.length)), !0)
          );
        }
        capture(n) {
          if (!this.consumeOptional(n)) throw new B(4011, Qu);
        }
      }
      function jg(e) {
        return e.segments.length > 0 ? new me([], { [de]: e }) : e;
      }
      function id(e) {
        const n = {};
        for (const r of Object.keys(e.children)) {
          const o = id(e.children[r]);
          (o.segments.length > 0 || o.hasChildren()) && (n[r] = o);
        }
        return (function KU(e) {
          if (1 === e.numberOfChildren && e.children[de]) {
            const n = e.children[de];
            return new me(e.segments.concat(n.segments), n.children);
          }
          return e;
        })(new me(e.segments, n));
      }
      function ro(e) {
        return e instanceof wi;
      }
      const zg = !1;
      function YU(e, n, t, r, i) {
        if (0 === t.length) return Cs(n.root, n.root, n.root, r, i);
        const o = (function GE(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new $E(!0, 0, e);
          let n = 0,
            t = !1;
          const r = e.reduce((i, o, s) => {
            if ("object" == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  zt(o.outlets, (l, c) => {
                    a[c] = "string" == typeof l ? l.split("/") : l;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...i, o.segmentPath];
            }
            return "string" != typeof o
              ? [...i, o]
              : 0 === s
              ? (o.split("/").forEach((a, l) => {
                  (0 == l && "." === a) ||
                    (0 == l && "" === a
                      ? (t = !0)
                      : ".." === a
                      ? n++
                      : "" != a && i.push(a));
                }),
                i)
              : [...i, o];
          }, []);
          return new $E(t, n, r);
        })(t);
        return o.toRoot()
          ? Cs(n.root, n.root, new me([], {}), r, i)
          : (function s(l) {
              const c = (function ZU(e, n, t, r) {
                  if (e.isAbsolute) return new ws(n.root, !0, 0);
                  if (-1 === r) return new ws(t, t === n.root, 0);
                  return (function jE(e, n, t) {
                    let r = e,
                      i = n,
                      o = t;
                    for (; o > i; ) {
                      if (((o -= i), (r = r.parent), !r))
                        throw new B(4005, zg && "Invalid number of '../'");
                      i = r.segments.length;
                    }
                    return new ws(r, !1, i - o);
                  })(t, r + (ml(e.commands[0]) ? 0 : 1), e.numberOfDoubleDots);
                })(o, n, e.snapshot?._urlSegment, l),
                u = c.processChildren
                  ? Es(c.segmentGroup, c.index, o.commands)
                  : Wg(c.segmentGroup, c.index, o.commands);
              return Cs(n.root, c.segmentGroup, u, r, i);
            })(e.snapshot?._lastPathIndex);
      }
      function ml(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function _l(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function Cs(e, n, t, r, i) {
        let s,
          o = {};
        r &&
          zt(r, (l, c) => {
            o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
          }),
          (s = e === n ? t : UE(e, n, t));
        const a = jg(id(s));
        return new wi(a, o, i);
      }
      function UE(e, n, t) {
        const r = {};
        return (
          zt(e.children, (i, o) => {
            r[o] = i === n ? t : UE(i, n, t);
          }),
          new me(e.segments, r)
        );
      }
      class $E {
        constructor(n, t, r) {
          if (
            ((this.isAbsolute = n),
            (this.numberOfDoubleDots = t),
            (this.commands = r),
            n && r.length > 0 && ml(r[0]))
          )
            throw new B(
              4003,
              zg && "Root segment cannot have matrix parameters"
            );
          const i = r.find(_l);
          if (i && i !== OE(r))
            throw new B(4004, zg && "{outlets:{}} has to be the last command");
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class ws {
        constructor(n, t, r) {
          (this.segmentGroup = n), (this.processChildren = t), (this.index = r);
        }
      }
      function Wg(e, n, t) {
        if (
          (e || (e = new me([], {})),
          0 === e.segments.length && e.hasChildren())
        )
          return Es(e, n, t);
        const r = (function XU(e, n, t) {
            let r = 0,
              i = n;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < e.segments.length; ) {
              if (r >= t.length) return o;
              const s = e.segments[i],
                a = t[r];
              if (_l(a)) break;
              const l = `${a}`,
                c = r < t.length - 1 ? t[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && c && "object" == typeof c && void 0 === c.outlets) {
                if (!WE(l, c, s)) return o;
                r += 2;
              } else {
                if (!WE(l, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(e, n, t),
          i = t.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const o = new me(e.segments.slice(0, r.pathIndex), {});
          return (
            (o.children[de] = new me(
              e.segments.slice(r.pathIndex),
              e.children
            )),
            Es(o, 0, i)
          );
        }
        return r.match && 0 === i.length
          ? new me(e.segments, {})
          : r.match && !e.hasChildren()
          ? qg(e, n, t)
          : r.match
          ? Es(e, 0, i)
          : qg(e, n, t);
      }
      function Es(e, n, t) {
        if (0 === t.length) return new me(e.segments, {});
        {
          const r = (function QU(e) {
              return _l(e[0]) ? e[0].outlets : { [de]: e };
            })(t),
            i = {};
          if (
            !r[de] &&
            e.children[de] &&
            1 === e.numberOfChildren &&
            0 === e.children[de].segments.length
          ) {
            const o = Es(e.children[de], n, t);
            return new me(e.segments, o.children);
          }
          return (
            zt(r, (o, s) => {
              "string" == typeof o && (o = [o]),
                null !== o && (i[s] = Wg(e.children[s], n, o));
            }),
            zt(e.children, (o, s) => {
              void 0 === r[s] && (i[s] = o);
            }),
            new me(e.segments, i)
          );
        }
      }
      function qg(e, n, t) {
        const r = e.segments.slice(0, n);
        let i = 0;
        for (; i < t.length; ) {
          const o = t[i];
          if (_l(o)) {
            const l = e$(o.outlets);
            return new me(r, l);
          }
          if (0 === i && ml(t[0])) {
            r.push(new hl(e.segments[n].path, zE(t[0]))), i++;
            continue;
          }
          const s = _l(o) ? o.outlets[de] : `${o}`,
            a = i < t.length - 1 ? t[i + 1] : null;
          s && a && ml(a)
            ? (r.push(new hl(s, zE(a))), (i += 2))
            : (r.push(new hl(s, {})), i++);
        }
        return new me(r, {});
      }
      function e$(e) {
        const n = {};
        return (
          zt(e, (t, r) => {
            "string" == typeof t && (t = [t]),
              null !== t && (n[r] = qg(new me([], {}), 0, t));
          }),
          n
        );
      }
      function zE(e) {
        const n = {};
        return zt(e, (t, r) => (n[r] = `${t}`)), n;
      }
      function WE(e, n, t) {
        return e == t.path && Mr(n, t.parameters);
      }
      const vl = "imperative";
      class Tr {
        constructor(n, t) {
          (this.id = n), (this.url = t);
        }
      }
      class Kg extends Tr {
        constructor(n, t, r = "imperative", i = null) {
          super(n, t),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class io extends Tr {
        constructor(n, t, r) {
          super(n, t), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class od extends Tr {
        constructor(n, t, r, i) {
          super(n, t), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class sd extends Tr {
        constructor(n, t, r, i) {
          super(n, t), (this.reason = r), (this.code = i), (this.type = 16);
        }
      }
      class Yg extends Tr {
        constructor(n, t, r, i) {
          super(n, t), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class t$ extends Tr {
        constructor(n, t, r, i) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class n$ extends Tr {
        constructor(n, t, r, i) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class r$ extends Tr {
        constructor(n, t, r, i, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.shouldActivate = o),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class i$ extends Tr {
        constructor(n, t, r, i) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class o$ extends Tr {
        constructor(n, t, r, i) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class s$ {
        constructor(n) {
          (this.route = n), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class a$ {
        constructor(n) {
          (this.route = n), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class l$ {
        constructor(n) {
          (this.snapshot = n), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class c$ {
        constructor(n) {
          (this.snapshot = n), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class u$ {
        constructor(n) {
          (this.snapshot = n), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class d$ {
        constructor(n) {
          (this.snapshot = n), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class qE {
        constructor(n, t, r) {
          (this.routerEvent = n),
            (this.position = t),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      let p$ = (() => {
          class e {
            createUrlTree(t, r, i, o, s, a) {
              return YU(t || r.root, i, o, s, a);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        m$ = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function (n) {
                return p$.ɵfac(n);
              },
              providedIn: "root",
            })),
            e
          );
        })();
      class KE {
        constructor(n) {
          this._root = n;
        }
        get root() {
          return this._root.value;
        }
        parent(n) {
          const t = this.pathFromRoot(n);
          return t.length > 1 ? t[t.length - 2] : null;
        }
        children(n) {
          const t = Jg(n, this._root);
          return t ? t.children.map((r) => r.value) : [];
        }
        firstChild(n) {
          const t = Jg(n, this._root);
          return t && t.children.length > 0 ? t.children[0].value : null;
        }
        siblings(n) {
          const t = Zg(n, this._root);
          return t.length < 2
            ? []
            : t[t.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== n);
        }
        pathFromRoot(n) {
          return Zg(n, this._root).map((t) => t.value);
        }
      }
      function Jg(e, n) {
        if (e === n.value) return n;
        for (const t of n.children) {
          const r = Jg(e, t);
          if (r) return r;
        }
        return null;
      }
      function Zg(e, n) {
        if (e === n.value) return [n];
        for (const t of n.children) {
          const r = Zg(e, t);
          if (r.length) return r.unshift(n), r;
        }
        return [];
      }
      class Zr {
        constructor(n, t) {
          (this.value = n), (this.children = t);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Ss(e) {
        const n = {};
        return e && e.children.forEach((t) => (n[t.value.outlet] = t)), n;
      }
      class YE extends KE {
        constructor(n, t) {
          super(n), (this.snapshot = t), Qg(this, n);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function JE(e, n) {
        const t = (function _$(e, n) {
            const s = new ad([], {}, {}, "", {}, de, n, null, e.root, -1, {});
            return new QE("", new Zr(s, []));
          })(e, n),
          r = new Ot([new hl("", {})]),
          i = new Ot({}),
          o = new Ot({}),
          s = new Ot({}),
          a = new Ot(""),
          l = new Nr(r, i, s, a, o, de, n, t.root);
        return (l.snapshot = t.root), new YE(new Zr(l, []), t);
      }
      class Nr {
        constructor(n, t, r, i, o, s, a, l) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.pipe(Z((c) => c[fl])) ?? q(void 0)),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(Z((n) => Ds(n)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(Z((n) => Ds(n)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function ZE(e, n = "emptyOnly") {
        const t = e.pathFromRoot;
        let r = 0;
        if ("always" !== n)
          for (r = t.length - 1; r >= 1; ) {
            const i = t[r],
              o = t[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function v$(e) {
          return e.reduce(
            (n, t) => ({
              params: { ...n.params, ...t.params },
              data: { ...n.data, ...t.data },
              resolve: {
                ...t.data,
                ...n.resolve,
                ...t.routeConfig?.data,
                ...t._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(t.slice(r));
      }
      class ad {
        get title() {
          return this.data?.[fl];
        }
        constructor(n, t, r, i, o, s, a, l, c, u, d) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._urlSegment = c),
            (this._lastPathIndex = u),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = Ds(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Ds(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class QE extends KE {
        constructor(n, t) {
          super(t), (this.url = n), Qg(this, t);
        }
        toString() {
          return XE(this._root);
        }
      }
      function Qg(e, n) {
        (n.value._routerState = e), n.children.forEach((t) => Qg(e, t));
      }
      function XE(e) {
        const n =
          e.children.length > 0 ? ` { ${e.children.map(XE).join(", ")} } ` : "";
        return `${e.value}${n}`;
      }
      function Xg(e) {
        if (e.snapshot) {
          const n = e.snapshot,
            t = e._futureSnapshot;
          (e.snapshot = t),
            Mr(n.queryParams, t.queryParams) ||
              e.queryParams.next(t.queryParams),
            n.fragment !== t.fragment && e.fragment.next(t.fragment),
            Mr(n.params, t.params) || e.params.next(t.params),
            (function RU(e, n) {
              if (e.length !== n.length) return !1;
              for (let t = 0; t < e.length; ++t) if (!Mr(e[t], n[t])) return !1;
              return !0;
            })(n.url, t.url) || e.url.next(t.url),
            Mr(n.data, t.data) || e.data.next(t.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function em(e, n) {
        const t =
          Mr(e.params, n.params) &&
          (function FU(e, n) {
            return (
              no(e, n) && e.every((t, r) => Mr(t.parameters, n[r].parameters))
            );
          })(e.url, n.url);
        return (
          t &&
          !(!e.parent != !n.parent) &&
          (!e.parent || em(e.parent, n.parent))
        );
      }
      function yl(e, n, t) {
        if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
          const r = t.value;
          r._futureSnapshot = n.value;
          const i = (function b$(e, n, t) {
            return n.children.map((r) => {
              for (const i of t.children)
                if (e.shouldReuseRoute(r.value, i.value.snapshot))
                  return yl(e, r, i);
              return yl(e, r);
            });
          })(e, n, t);
          return new Zr(r, i);
        }
        {
          if (e.shouldAttach(n.value)) {
            const o = e.retrieve(n.value);
            if (null !== o) {
              const s = o.route;
              return (
                (s.value._futureSnapshot = n.value),
                (s.children = n.children.map((a) => yl(e, a))),
                s
              );
            }
          }
          const r = (function D$(e) {
              return new Nr(
                new Ot(e.url),
                new Ot(e.params),
                new Ot(e.queryParams),
                new Ot(e.fragment),
                new Ot(e.data),
                e.outlet,
                e.component,
                e
              );
            })(n.value),
            i = n.children.map((o) => yl(e, o));
          return new Zr(r, i);
        }
      }
      const tm = "ngNavigationCancelingError";
      function eS(e, n) {
        const { redirectTo: t, navigationBehaviorOptions: r } = ro(n)
            ? { redirectTo: n, navigationBehaviorOptions: void 0 }
            : n,
          i = tS(!1, 0, n);
        return (i.url = t), (i.navigationBehaviorOptions = r), i;
      }
      function tS(e, n, t) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[tm] = !0), (r.cancellationCode = n), t && (r.url = t), r;
      }
      function nS(e) {
        return rS(e) && ro(e.url);
      }
      function rS(e) {
        return e && e[tm];
      }
      class C$ {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new bl()),
            (this.attachRef = null);
        }
      }
      let bl = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(t, r) {
            const i = this.getOrCreateContext(t);
            (i.outlet = r), this.contexts.set(t, i);
          }
          onChildOutletDestroyed(t) {
            const r = this.getContext(t);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const t = this.contexts;
            return (this.contexts = new Map()), t;
          }
          onOutletReAttached(t) {
            this.contexts = t;
          }
          getOrCreateContext(t) {
            let r = this.getContext(t);
            return r || ((r = new C$()), this.contexts.set(t, r)), r;
          }
          getContext(t) {
            return this.contexts.get(t) || null;
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const ld = !1;
      let nm = (() => {
        class e {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = de),
              (this.activateEvents = new W()),
              (this.deactivateEvents = new W()),
              (this.attachEvents = new W()),
              (this.detachEvents = new W()),
              (this.parentContexts = se(bl)),
              (this.location = se($n)),
              (this.changeDetector = se(_n)),
              (this.environmentInjector = se(Hn));
          }
          ngOnChanges(t) {
            if (t.name) {
              const { firstChange: r, previousValue: i } = t.name;
              if (r) return;
              this.isTrackedInParentContexts(i) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(i)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          isTrackedInParentContexts(t) {
            return this.parentContexts.getContext(t)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const t = this.parentContexts.getContext(this.name);
            t?.route &&
              (t.attachRef
                ? this.attach(t.attachRef, t.route)
                : this.activateWith(t.route, t.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new B(4012, ld);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new B(4012, ld);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new B(4012, ld);
            this.location.detach();
            const t = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(t.instance),
              t
            );
          }
          attach(t, r) {
            (this.activated = t),
              (this._activatedRoute = r),
              this.location.insert(t.hostView),
              this.attachEvents.emit(t.instance);
          }
          deactivate() {
            if (this.activated) {
              const t = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(t);
            }
          }
          activateWith(t, r) {
            if (this.isActivated) throw new B(4013, ld);
            this._activatedRoute = t;
            const i = this.location,
              s = t.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new w$(t, a, i.injector);
            if (
              r &&
              (function E$(e) {
                return !!e.resolveComponentFactory;
              })(r)
            ) {
              const c = r.resolveComponentFactory(s);
              this.activated = i.createComponent(c, i.length, l);
            } else
              this.activated = i.createComponent(s, {
                index: i.length,
                injector: l,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵdir = V({
            type: e,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [ot],
          })),
          e
        );
      })();
      class w$ {
        constructor(n, t, r) {
          (this.route = n), (this.childContexts = t), (this.parent = r);
        }
        get(n, t) {
          return n === Nr
            ? this.route
            : n === bl
            ? this.childContexts
            : this.parent.get(n, t);
        }
      }
      let rm = (() => {
        class e {}
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵcmp = Oe({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [Nt],
            decls: 1,
            vars: 0,
            template: function (t, r) {
              1 & t && A(0, "router-outlet");
            },
            dependencies: [nm],
            encapsulation: 2,
          })),
          e
        );
      })();
      function iS(e, n) {
        return (
          e.providers &&
            !e._injector &&
            (e._injector = Uc(e.providers, n, `Route: ${e.path}`)),
          e._injector ?? n
        );
      }
      function om(e) {
        const n = e.children && e.children.map(om),
          t = n ? { ...e, children: n } : { ...e };
        return (
          !t.component &&
            !t.loadComponent &&
            (n || t.loadChildren) &&
            t.outlet &&
            t.outlet !== de &&
            (t.component = rm),
          t
        );
      }
      function qn(e) {
        return e.outlet || de;
      }
      function oS(e, n) {
        const t = e.filter((r) => qn(r) === n);
        return t.push(...e.filter((r) => qn(r) !== n)), t;
      }
      function Dl(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let n = e.parent; n; n = n.parent) {
          const t = n.routeConfig;
          if (t?._loadedInjector) return t._loadedInjector;
          if (t?._injector) return t._injector;
        }
        return null;
      }
      class I$ {
        constructor(n, t, r, i) {
          (this.routeReuseStrategy = n),
            (this.futureState = t),
            (this.currState = r),
            (this.forwardEvent = i);
        }
        activate(n) {
          const t = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(t, r, n),
            Xg(this.futureState.root),
            this.activateChildRoutes(t, r, n);
        }
        deactivateChildRoutes(n, t, r) {
          const i = Ss(t);
          n.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            zt(i, (o, s) => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(n, t, r) {
          const i = n.value,
            o = t ? t.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(n, t, s.children);
            } else this.deactivateChildRoutes(n, t, r);
          else o && this.deactivateRouteAndItsChildren(t, r);
        }
        deactivateRouteAndItsChildren(n, t) {
          n.value.component &&
          this.routeReuseStrategy.shouldDetach(n.value.snapshot)
            ? this.detachAndStoreRouteSubtree(n, t)
            : this.deactivateRouteAndOutlet(n, t);
        }
        detachAndStoreRouteSubtree(n, t) {
          const r = t.getContext(n.value.outlet),
            i = r && n.value.component ? r.children : t,
            o = Ss(n);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(n.value.snapshot, {
              componentRef: s,
              route: n,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(n, t) {
          const r = t.getContext(n.value.outlet),
            i = r && n.value.component ? r.children : t,
            o = Ss(n);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(n, t, r) {
          const i = Ss(t);
          n.children.forEach((o) => {
            this.activateRoutes(o, i[o.value.outlet], r),
              this.forwardEvent(new d$(o.value.snapshot));
          }),
            n.children.length && this.forwardEvent(new c$(n.value.snapshot));
        }
        activateRoutes(n, t, r) {
          const i = n.value,
            o = t ? t.value : null;
          if ((Xg(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(n, t, s.children);
            } else this.activateChildRoutes(n, t, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Xg(a.route.value),
                this.activateChildRoutes(n, null, s.children);
            } else {
              const a = Dl(i.snapshot),
                l = a?.get(ga) ?? null;
              (s.attachRef = null),
                (s.route = i),
                (s.resolver = l),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(n, null, s.children);
            }
          } else this.activateChildRoutes(n, null, r);
        }
      }
      class sS {
        constructor(n) {
          (this.path = n), (this.route = this.path[this.path.length - 1]);
        }
      }
      class cd {
        constructor(n, t) {
          (this.component = n), (this.route = t);
        }
      }
      function O$(e, n, t) {
        const r = e._root;
        return Cl(r, n ? n._root : null, t, [r.value]);
      }
      function Ms(e, n) {
        const t = Symbol(),
          r = n.get(e, t);
        return r === t
          ? "function" != typeof e ||
            (function vM(e) {
              return null !== jl(e);
            })(e)
            ? n.get(e)
            : e
          : r;
      }
      function Cl(
        e,
        n,
        t,
        r,
        i = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const o = Ss(n);
        return (
          e.children.forEach((s) => {
            (function R$(
              e,
              n,
              t,
              r,
              i = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const o = e.value,
                s = n ? n.value : null,
                a = t ? t.getContext(e.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function x$(e, n, t) {
                  if ("function" == typeof t) return t(e, n);
                  switch (t) {
                    case "pathParamsChange":
                      return !no(e.url, n.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !no(e.url, n.url) || !Mr(e.queryParams, n.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !em(e, n) || !Mr(e.queryParams, n.queryParams);
                    default:
                      return !em(e, n);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l
                  ? i.canActivateChecks.push(new sS(r))
                  : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  Cl(e, n, o.component ? (a ? a.children : null) : t, r, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new cd(a.outlet.component, s));
              } else
                s && wl(n, a, i),
                  i.canActivateChecks.push(new sS(r)),
                  Cl(e, null, o.component ? (a ? a.children : null) : t, r, i);
            })(s, o[s.value.outlet], t, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          zt(o, (s, a) => wl(s, t.getContext(a), i)),
          i
        );
      }
      function wl(e, n, t) {
        const r = Ss(e),
          i = e.value;
        zt(r, (o, s) => {
          wl(o, i.component ? (n ? n.children.getContext(s) : null) : n, t);
        }),
          t.canDeactivateChecks.push(
            new cd(
              i.component && n && n.outlet && n.outlet.isActivated
                ? n.outlet.component
                : null,
              i
            )
          );
      }
      function El(e) {
        return "function" == typeof e;
      }
      function sm(e) {
        return e instanceof Ju || "EmptyError" === e?.name;
      }
      const ud = Symbol("INITIAL_VALUE");
      function Ts() {
        return zn((e) =>
          gu(e.map((n) => n.pipe(bt(1), _u(ud)))).pipe(
            Z((n) => {
              for (const t of n)
                if (!0 !== t) {
                  if (t === ud) return ud;
                  if (!1 === t || t instanceof wi) return t;
                }
              return !0;
            }),
            At((n) => n !== ud),
            bt(1)
          )
        );
      }
      function aS(e) {
        return (function kl(...e) {
          return Fl(e);
        })(
          ht((n) => {
            if (ro(n)) throw eS(0, n);
          }),
          Z((n) => !0 === n)
        );
      }
      const am = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function lS(e, n, t, r, i) {
        const o = lm(e, n, t);
        return o.matched
          ? (function J$(e, n, t, r) {
              const i = n.canMatch;
              return i && 0 !== i.length
                ? q(
                    i.map((s) => {
                      const a = Ms(s, e);
                      return Ci(
                        (function V$(e) {
                          return e && El(e.canMatch);
                        })(a)
                          ? a.canMatch(n, t)
                          : e.runInContext(() => a(n, t))
                      );
                    })
                  ).pipe(Ts(), aS())
                : q(!0);
            })((r = iS(n, r)), n, t).pipe(Z((s) => (!0 === s ? o : { ...am })))
          : q(o);
      }
      function lm(e, n, t) {
        if ("" === n.path)
          return "full" === n.pathMatch && (e.hasChildren() || t.length > 0)
            ? { ...am }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: t,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (n.matcher || AU)(t, e, n);
        if (!i) return { ...am };
        const o = {};
        zt(i.posParams, (a, l) => {
          o[l] = a.path;
        });
        const s =
          i.consumed.length > 0
            ? { ...o, ...i.consumed[i.consumed.length - 1].parameters }
            : o;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: t.slice(i.consumed.length),
          parameters: s,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function dd(e, n, t, r) {
        if (
          t.length > 0 &&
          (function X$(e, n, t) {
            return t.some((r) => fd(e, n, r) && qn(r) !== de);
          })(e, t, r)
        ) {
          const o = new me(
            n,
            (function Q$(e, n, t, r) {
              const i = {};
              (i[de] = r),
                (r._sourceSegment = e),
                (r._segmentIndexShift = n.length);
              for (const o of t)
                if ("" === o.path && qn(o) !== de) {
                  const s = new me([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = n.length),
                    (i[qn(o)] = s);
                }
              return i;
            })(e, n, r, new me(t, e.children))
          );
          return (
            (o._sourceSegment = e),
            (o._segmentIndexShift = n.length),
            { segmentGroup: o, slicedSegments: [] }
          );
        }
        if (
          0 === t.length &&
          (function eG(e, n, t) {
            return t.some((r) => fd(e, n, r));
          })(e, t, r)
        ) {
          const o = new me(
            e.segments,
            (function Z$(e, n, t, r, i) {
              const o = {};
              for (const s of r)
                if (fd(e, t, s) && !i[qn(s)]) {
                  const a = new me([], {});
                  (a._sourceSegment = e),
                    (a._segmentIndexShift = n.length),
                    (o[qn(s)] = a);
                }
              return { ...i, ...o };
            })(e, n, t, r, e.children)
          );
          return (
            (o._sourceSegment = e),
            (o._segmentIndexShift = n.length),
            { segmentGroup: o, slicedSegments: t }
          );
        }
        const i = new me(e.segments, e.children);
        return (
          (i._sourceSegment = e),
          (i._segmentIndexShift = n.length),
          { segmentGroup: i, slicedSegments: t }
        );
      }
      function fd(e, n, t) {
        return (
          (!(e.hasChildren() || n.length > 0) || "full" !== t.pathMatch) &&
          "" === t.path
        );
      }
      function cS(e, n, t, r) {
        return (
          !!(qn(e) === r || (r !== de && fd(n, t, e))) &&
          ("**" === e.path || lm(n, e, t).matched)
        );
      }
      function uS(e, n, t) {
        return 0 === n.length && !e.children[t];
      }
      const hd = !1;
      class pd {
        constructor(n) {
          this.segmentGroup = n || null;
        }
      }
      class dS {
        constructor(n) {
          this.urlTree = n;
        }
      }
      function Sl(e) {
        return dl(new pd(e));
      }
      function fS(e) {
        return dl(new dS(e));
      }
      class iG {
        constructor(n, t, r, i, o) {
          (this.injector = n),
            (this.configLoader = t),
            (this.urlSerializer = r),
            (this.urlTree = i),
            (this.config = o),
            (this.allowRedirects = !0);
        }
        apply() {
          const n = dd(this.urlTree.root, [], [], this.config).segmentGroup,
            t = new me(n.segments, n.children);
          return this.expandSegmentGroup(this.injector, this.config, t, de)
            .pipe(
              Z((o) =>
                this.createUrlTree(
                  id(o),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              Sr((o) => {
                if (o instanceof dS)
                  return (this.allowRedirects = !1), this.match(o.urlTree);
                throw o instanceof pd ? this.noMatchError(o) : o;
              })
            );
        }
        match(n) {
          return this.expandSegmentGroup(this.injector, this.config, n.root, de)
            .pipe(
              Z((i) => this.createUrlTree(id(i), n.queryParams, n.fragment))
            )
            .pipe(
              Sr((i) => {
                throw i instanceof pd ? this.noMatchError(i) : i;
              })
            );
        }
        noMatchError(n) {
          return new B(4002, hd);
        }
        createUrlTree(n, t, r) {
          const i = jg(n);
          return new wi(i, t, r);
        }
        expandSegmentGroup(n, t, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(n, t, r).pipe(Z((o) => new me([], o)))
            : this.expandSegment(n, r, t, r.segments, i, !0);
        }
        expandChildren(n, t, r) {
          const i = [];
          for (const o of Object.keys(r.children))
            "primary" === o ? i.unshift(o) : i.push(o);
          return mt(i).pipe(
            bi((o) => {
              const s = r.children[o],
                a = oS(t, o);
              return this.expandSegmentGroup(n, a, s, o).pipe(
                Z((l) => ({ segment: l, outlet: o }))
              );
            }),
            ME((o, s) => ((o[s.outlet] = s.segment), o), {}),
            TE()
          );
        }
        expandSegment(n, t, r, i, o, s) {
          return mt(r).pipe(
            bi((a) =>
              this.expandSegmentAgainstRoute(n, t, r, a, i, o, s).pipe(
                Sr((c) => {
                  if (c instanceof pd) return q(null);
                  throw c;
                })
              )
            ),
            Di((a) => !!a),
            Sr((a, l) => {
              if (sm(a)) return uS(t, i, o) ? q(new me([], {})) : Sl(t);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(n, t, r, i, o, s, a) {
          return cS(i, t, o, s)
            ? void 0 === i.redirectTo
              ? this.matchSegmentAgainstRoute(n, t, i, o, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s)
              : Sl(t)
            : Sl(t);
        }
        expandSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(n, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                n,
                t,
                r,
                i,
                o,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(n, t, r, i) {
          const o = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? fS(o)
            : this.lineralizeSegments(r, o).pipe(
                St((s) => {
                  const a = new me(s, {});
                  return this.expandSegment(n, a, t, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: c,
            positionalParamSegments: u,
          } = lm(t, i, o);
          if (!a) return Sl(t);
          const d = this.applyRedirectCommands(l, i.redirectTo, u);
          return i.redirectTo.startsWith("/")
            ? fS(d)
            : this.lineralizeSegments(i, d).pipe(
                St((f) => this.expandSegment(n, t, r, f.concat(c), s, !1))
              );
        }
        matchSegmentAgainstRoute(n, t, r, i, o) {
          return "**" === r.path
            ? ((n = iS(r, n)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? q({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                      })
                    : this.configLoader.loadChildren(n, r)
                  ).pipe(
                    Z(
                      (a) => (
                        (r._loadedRoutes = a.routes),
                        (r._loadedInjector = a.injector),
                        new me(i, {})
                      )
                    )
                  )
                : q(new me(i, {})))
            : lS(t, r, i, n).pipe(
                zn(
                  ({ matched: s, consumedSegments: a, remainingSegments: l }) =>
                    s
                      ? this.getChildConfig((n = r._injector ?? n), r, i).pipe(
                          St((u) => {
                            const d = u.injector ?? n,
                              f = u.routes,
                              { segmentGroup: h, slicedSegments: y } = dd(
                                t,
                                a,
                                l,
                                f
                              ),
                              b = new me(h.segments, h.children);
                            if (0 === y.length && b.hasChildren())
                              return this.expandChildren(d, f, b).pipe(
                                Z((T) => new me(a, T))
                              );
                            if (0 === f.length && 0 === y.length)
                              return q(new me(a, {}));
                            const w = qn(r) === o;
                            return this.expandSegment(
                              d,
                              b,
                              f,
                              y,
                              w ? de : o,
                              !0
                            ).pipe(
                              Z((O) => new me(a.concat(O.segments), O.children))
                            );
                          })
                        )
                      : Sl(t)
                )
              );
        }
        getChildConfig(n, t, r) {
          return t.children
            ? q({ routes: t.children, injector: n })
            : t.loadChildren
            ? void 0 !== t._loadedRoutes
              ? q({ routes: t._loadedRoutes, injector: t._loadedInjector })
              : (function Y$(e, n, t, r) {
                  const i = n.canLoad;
                  return void 0 === i || 0 === i.length
                    ? q(!0)
                    : q(
                        i.map((s) => {
                          const a = Ms(s, e);
                          return Ci(
                            (function k$(e) {
                              return e && El(e.canLoad);
                            })(a)
                              ? a.canLoad(n, t)
                              : e.runInContext(() => a(n, t))
                          );
                        })
                      ).pipe(Ts(), aS());
                })(n, t, r).pipe(
                  St((i) =>
                    i
                      ? this.configLoader.loadChildren(n, t).pipe(
                          ht((o) => {
                            (t._loadedRoutes = o.routes),
                              (t._loadedInjector = o.injector);
                          })
                        )
                      : (function nG(e) {
                          return dl(tS(hd, 3));
                        })()
                  )
                )
            : q({ routes: [], injector: n });
        }
        lineralizeSegments(n, t) {
          let r = [],
            i = t.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren))
              return q(r);
            if (i.numberOfChildren > 1 || !i.children[de])
              return n.redirectTo, dl(new B(4e3, hd));
            i = i.children[de];
          }
        }
        applyRedirectCommands(n, t, r) {
          return this.applyRedirectCreateUrlTree(
            t,
            this.urlSerializer.parse(t),
            n,
            r
          );
        }
        applyRedirectCreateUrlTree(n, t, r, i) {
          const o = this.createSegmentGroup(n, t.root, r, i);
          return new wi(
            o,
            this.createQueryParams(t.queryParams, this.urlTree.queryParams),
            t.fragment
          );
        }
        createQueryParams(n, t) {
          const r = {};
          return (
            zt(n, (i, o) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = t[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(n, t, r, i) {
          const o = this.createSegments(n, t.segments, r, i);
          let s = {};
          return (
            zt(t.children, (a, l) => {
              s[l] = this.createSegmentGroup(n, a, r, i);
            }),
            new me(o, s)
          );
        }
        createSegments(n, t, r, i) {
          return t.map((o) =>
            o.path.startsWith(":")
              ? this.findPosParam(n, o, i)
              : this.findOrReturn(o, r)
          );
        }
        findPosParam(n, t, r) {
          const i = r[t.path.substring(1)];
          if (!i) throw new B(4001, hd);
          return i;
        }
        findOrReturn(n, t) {
          let r = 0;
          for (const i of t) {
            if (i.path === n.path) return t.splice(r), i;
            r++;
          }
          return n;
        }
      }
      class sG {}
      class cG {
        constructor(n, t, r, i, o, s, a) {
          (this.injector = n),
            (this.rootComponentType = t),
            (this.config = r),
            (this.urlTree = i),
            (this.url = o),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a);
        }
        recognize() {
          const n = dd(
            this.urlTree.root,
            [],
            [],
            this.config.filter((t) => void 0 === t.redirectTo)
          ).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            n,
            de
          ).pipe(
            Z((t) => {
              if (null === t) return null;
              const r = new ad(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  de,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {}
                ),
                i = new Zr(r, t),
                o = new QE(this.url, i);
              return this.inheritParamsAndData(o._root), o;
            })
          );
        }
        inheritParamsAndData(n) {
          const t = n.value,
            r = ZE(t, this.paramsInheritanceStrategy);
          (t.params = Object.freeze(r.params)),
            (t.data = Object.freeze(r.data)),
            n.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(n, t, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(n, t, r)
            : this.processSegment(n, t, r, r.segments, i);
        }
        processChildren(n, t, r) {
          return mt(Object.keys(r.children)).pipe(
            bi((i) => {
              const o = r.children[i],
                s = oS(t, i);
              return this.processSegmentGroup(n, s, o, i);
            }),
            ME((i, o) => (i && o ? (i.push(...o), i) : null)),
            (function IU(e, n = !1) {
              return Qe((t, r) => {
                let i = 0;
                t.subscribe(
                  Be(r, (o) => {
                    const s = e(o, i++);
                    (s || n) && r.next(o), !s && r.complete();
                  })
                );
              });
            })((i) => null !== i),
            Zu(null),
            TE(),
            Z((i) => {
              if (null === i) return null;
              const o = pS(i);
              return (
                (function uG(e) {
                  e.sort((n, t) =>
                    n.value.outlet === de
                      ? -1
                      : t.value.outlet === de
                      ? 1
                      : n.value.outlet.localeCompare(t.value.outlet)
                  );
                })(o),
                o
              );
            })
          );
        }
        processSegment(n, t, r, i, o) {
          return mt(t).pipe(
            bi((s) =>
              this.processSegmentAgainstRoute(s._injector ?? n, s, r, i, o)
            ),
            Di((s) => !!s),
            Sr((s) => {
              if (sm(s)) return uS(r, i, o) ? q([]) : q(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(n, t, r, i, o) {
          if (t.redirectTo || !cS(t, r, i, o)) return q(null);
          let s;
          if ("**" === t.path) {
            const a = i.length > 0 ? OE(i).parameters : {},
              l = mS(r) + i.length;
            s = q({
              snapshot: new ad(
                i,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                _S(t),
                qn(t),
                t.component ?? t._loadedComponent ?? null,
                t,
                gS(r),
                l,
                vS(t)
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = lS(r, t, i, n).pipe(
              Z(
                ({
                  matched: a,
                  consumedSegments: l,
                  remainingSegments: c,
                  parameters: u,
                }) => {
                  if (!a) return null;
                  const d = mS(r) + l.length;
                  return {
                    snapshot: new ad(
                      l,
                      u,
                      Object.freeze({ ...this.urlTree.queryParams }),
                      this.urlTree.fragment,
                      _S(t),
                      qn(t),
                      t.component ?? t._loadedComponent ?? null,
                      t,
                      gS(r),
                      d,
                      vS(t)
                    ),
                    consumedSegments: l,
                    remainingSegments: c,
                  };
                }
              )
            );
          return s.pipe(
            zn((a) => {
              if (null === a) return q(null);
              const {
                snapshot: l,
                consumedSegments: c,
                remainingSegments: u,
              } = a;
              n = t._injector ?? n;
              const d = t._loadedInjector ?? n,
                f = (function dG(e) {
                  return e.children
                    ? e.children
                    : e.loadChildren
                    ? e._loadedRoutes
                    : [];
                })(t),
                { segmentGroup: h, slicedSegments: y } = dd(
                  r,
                  c,
                  u,
                  f.filter((w) => void 0 === w.redirectTo)
                );
              if (0 === y.length && h.hasChildren())
                return this.processChildren(d, f, h).pipe(
                  Z((w) => (null === w ? null : [new Zr(l, w)]))
                );
              if (0 === f.length && 0 === y.length) return q([new Zr(l, [])]);
              const b = qn(t) === o;
              return this.processSegment(d, f, h, y, b ? de : o).pipe(
                Z((w) => (null === w ? null : [new Zr(l, w)]))
              );
            })
          );
        }
      }
      function fG(e) {
        const n = e.value.routeConfig;
        return n && "" === n.path && void 0 === n.redirectTo;
      }
      function pS(e) {
        const n = [],
          t = new Set();
        for (const r of e) {
          if (!fG(r)) {
            n.push(r);
            continue;
          }
          const i = n.find((o) => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), t.add(i)) : n.push(r);
        }
        for (const r of t) {
          const i = pS(r.children);
          n.push(new Zr(r.value, i));
        }
        return n.filter((r) => !t.has(r));
      }
      function gS(e) {
        let n = e;
        for (; n._sourceSegment; ) n = n._sourceSegment;
        return n;
      }
      function mS(e) {
        let n = e,
          t = n._segmentIndexShift ?? 0;
        for (; n._sourceSegment; )
          (n = n._sourceSegment), (t += n._segmentIndexShift ?? 0);
        return t - 1;
      }
      function _S(e) {
        return e.data || {};
      }
      function vS(e) {
        return e.resolve || {};
      }
      function gG(e, n) {
        return St((t) => {
          const {
            targetSnapshot: r,
            guards: { canActivateChecks: i },
          } = t;
          if (!i.length) return q(t);
          let o = 0;
          return mt(i).pipe(
            bi((s) =>
              (function mG(e, n, t, r) {
                const i = e.routeConfig,
                  o = e._resolve;
                return (
                  void 0 !== i?.title && !yS(i) && (o[fl] = i.title),
                  (function _G(e, n, t, r) {
                    const i = (function vG(e) {
                      return [
                        ...Object.keys(e),
                        ...Object.getOwnPropertySymbols(e),
                      ];
                    })(e);
                    if (0 === i.length) return q({});
                    const o = {};
                    return mt(i).pipe(
                      St((s) =>
                        (function yG(e, n, t, r) {
                          const i = Dl(n) ?? r,
                            o = Ms(e, i);
                          return Ci(
                            o.resolve
                              ? o.resolve(n, t)
                              : i.runInContext(() => o(n, t))
                          );
                        })(e[s], n, t, r).pipe(
                          Di(),
                          ht((a) => {
                            o[s] = a;
                          })
                        )
                      ),
                      Hg(1),
                      (function ID(e) {
                        return Z(() => e);
                      })(o),
                      Sr((s) => (sm(s) ? kn : dl(s)))
                    );
                  })(o, e, n, r).pipe(
                    Z(
                      (s) => (
                        (e._resolvedData = s),
                        (e.data = ZE(e, t).resolve),
                        i && yS(i) && (e.data[fl] = i.title),
                        null
                      )
                    )
                  )
                );
              })(s.route, r, e, n)
            ),
            ht(() => o++),
            Hg(1),
            St((s) => (o === i.length ? q(t) : kn))
          );
        });
      }
      function yS(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function cm(e) {
        return zn((n) => {
          const t = e(n);
          return t ? mt(t).pipe(Z(() => n)) : q(n);
        });
      }
      const Ns = new z("ROUTES");
      let um = (() => {
        class e {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = se(qb));
          }
          loadComponent(t) {
            if (this.componentLoaders.get(t))
              return this.componentLoaders.get(t);
            if (t._loadedComponent) return q(t._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(t);
            const r = Ci(t.loadComponent()).pipe(
                Z(DS),
                ht((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(t),
                    (t._loadedComponent = o);
                }),
                Ug(() => {
                  this.componentLoaders.delete(t);
                })
              ),
              i = new EE(r, () => new Pe()).pipe(Vg());
            return this.componentLoaders.set(t, i), i;
          }
          loadChildren(t, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return q({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                Z((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l,
                    c,
                    u = !1;
                  Array.isArray(a)
                    ? (c = a)
                    : ((l = a.create(t).injector),
                      (c = IE(l.get(Ns, [], ee.Self | ee.Optional))));
                  return { routes: c.map(om), injector: l };
                }),
                Ug(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new EE(o, () => new Pe()).pipe(Vg());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(t) {
            return Ci(t()).pipe(
              Z(DS),
              St((r) =>
                r instanceof sb || Array.isArray(r)
                  ? q(r)
                  : mt(this.compiler.compileModuleAsync(r))
              )
            );
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function DS(e) {
        return (function bG(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let md = (() => {
        class e {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new Pe()),
              (this.configLoader = se(um)),
              (this.environmentInjector = se(Hn)),
              (this.urlSerializer = se(pl)),
              (this.rootContexts = se(bl)),
              (this.navigationId = 0),
              (this.afterPreactivation = () => q(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (i) =>
                this.events.next(new a$(i))),
              (this.configLoader.onLoadStartListener = (i) =>
                this.events.next(new s$(i)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(t) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...t, id: r });
          }
          setupNavigations(t) {
            return (
              (this.transitions = new Ot({
                id: 0,
                targetPageId: 0,
                currentUrlTree: t.currentUrlTree,
                currentRawUrl: t.currentUrlTree,
                extractedUrl: t.urlHandlingStrategy.extract(t.currentUrlTree),
                urlAfterRedirects: t.urlHandlingStrategy.extract(
                  t.currentUrlTree
                ),
                rawUrl: t.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: vl,
                restoredState: null,
                currentSnapshot: t.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: t.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                At((r) => 0 !== r.id),
                Z((r) => ({
                  ...r,
                  extractedUrl: t.urlHandlingStrategy.extract(r.rawUrl),
                })),
                zn((r) => {
                  let i = !1,
                    o = !1;
                  return q(r).pipe(
                    ht((s) => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    zn((s) => {
                      const a = t.browserUrlTree.toString(),
                        l =
                          !t.navigated ||
                          s.extractedUrl.toString() !== a ||
                          a !== t.currentUrlTree.toString();
                      if (
                        !l &&
                        "reload" !==
                          (s.extras.onSameUrlNavigation ??
                            t.onSameUrlNavigation)
                      ) {
                        const u = "";
                        return (
                          this.events.next(
                            new sd(s.id, t.serializeUrl(r.rawUrl), u, 0)
                          ),
                          (t.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          kn
                        );
                      }
                      if (t.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                        return (
                          CS(s.source) && (t.browserUrlTree = s.extractedUrl),
                          q(s).pipe(
                            zn((u) => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new Kg(
                                    u.id,
                                    this.urlSerializer.serialize(
                                      u.extractedUrl
                                    ),
                                    u.source,
                                    u.restoredState
                                  )
                                ),
                                d !== this.transitions?.getValue()
                                  ? kn
                                  : Promise.resolve(u)
                              );
                            }),
                            (function oG(e, n, t, r) {
                              return zn((i) =>
                                (function rG(e, n, t, r, i) {
                                  return new iG(e, n, t, r, i).apply();
                                })(e, n, t, i.extractedUrl, r).pipe(
                                  Z((o) => ({ ...i, urlAfterRedirects: o }))
                                )
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.urlSerializer,
                              t.config
                            ),
                            ht((u) => {
                              (this.currentNavigation = {
                                ...this.currentNavigation,
                                finalUrl: u.urlAfterRedirects,
                              }),
                                (r.urlAfterRedirects = u.urlAfterRedirects);
                            }),
                            (function pG(e, n, t, r, i) {
                              return St((o) =>
                                (function lG(
                                  e,
                                  n,
                                  t,
                                  r,
                                  i,
                                  o,
                                  s = "emptyOnly"
                                ) {
                                  return new cG(e, n, t, r, i, s, o)
                                    .recognize()
                                    .pipe(
                                      zn((a) =>
                                        null === a
                                          ? (function aG(e) {
                                              return new Me((n) => n.error(e));
                                            })(new sG())
                                          : q(a)
                                      )
                                    );
                                })(
                                  e,
                                  n,
                                  t,
                                  o.urlAfterRedirects,
                                  r.serialize(o.urlAfterRedirects),
                                  r,
                                  i
                                ).pipe(Z((s) => ({ ...o, targetSnapshot: s })))
                              );
                            })(
                              this.environmentInjector,
                              this.rootComponentType,
                              t.config,
                              this.urlSerializer,
                              t.paramsInheritanceStrategy
                            ),
                            ht((u) => {
                              if (
                                ((r.targetSnapshot = u.targetSnapshot),
                                "eager" === t.urlUpdateStrategy)
                              ) {
                                if (!u.extras.skipLocationChange) {
                                  const f = t.urlHandlingStrategy.merge(
                                    u.urlAfterRedirects,
                                    u.rawUrl
                                  );
                                  t.setBrowserUrl(f, u);
                                }
                                t.browserUrlTree = u.urlAfterRedirects;
                              }
                              const d = new t$(
                                u.id,
                                this.urlSerializer.serialize(u.extractedUrl),
                                this.urlSerializer.serialize(
                                  u.urlAfterRedirects
                                ),
                                u.targetSnapshot
                              );
                              this.events.next(d);
                            })
                          )
                        );
                      if (
                        l &&
                        t.urlHandlingStrategy.shouldProcessUrl(t.rawUrlTree)
                      ) {
                        const {
                            id: u,
                            extractedUrl: d,
                            source: f,
                            restoredState: h,
                            extras: y,
                          } = s,
                          b = new Kg(u, this.urlSerializer.serialize(d), f, h);
                        this.events.next(b);
                        const w = JE(d, this.rootComponentType).snapshot;
                        return q(
                          (r = {
                            ...s,
                            targetSnapshot: w,
                            urlAfterRedirects: d,
                            extras: {
                              ...y,
                              skipLocationChange: !1,
                              replaceUrl: !1,
                            },
                          })
                        );
                      }
                      {
                        const u = "";
                        return (
                          this.events.next(
                            new sd(s.id, t.serializeUrl(r.extractedUrl), u, 1)
                          ),
                          (t.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          kn
                        );
                      }
                    }),
                    ht((s) => {
                      const a = new n$(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot
                      );
                      this.events.next(a);
                    }),
                    Z(
                      (s) =>
                        (r = {
                          ...s,
                          guards: O$(
                            s.targetSnapshot,
                            s.currentSnapshot,
                            this.rootContexts
                          ),
                        })
                    ),
                    (function U$(e, n) {
                      return St((t) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: i,
                          guards: {
                            canActivateChecks: o,
                            canDeactivateChecks: s,
                          },
                        } = t;
                        return 0 === s.length && 0 === o.length
                          ? q({ ...t, guardsResult: !0 })
                          : (function $$(e, n, t, r) {
                              return mt(e).pipe(
                                St((i) =>
                                  (function K$(e, n, t, r, i) {
                                    const o =
                                      n && n.routeConfig
                                        ? n.routeConfig.canDeactivate
                                        : null;
                                    return o && 0 !== o.length
                                      ? q(
                                          o.map((a) => {
                                            const l = Dl(n) ?? i,
                                              c = Ms(a, l);
                                            return Ci(
                                              (function B$(e) {
                                                return e && El(e.canDeactivate);
                                              })(c)
                                                ? c.canDeactivate(e, n, t, r)
                                                : l.runInContext(() =>
                                                    c(e, n, t, r)
                                                  )
                                            ).pipe(Di());
                                          })
                                        ).pipe(Ts())
                                      : q(!0);
                                  })(i.component, i.route, t, n, r)
                                ),
                                Di((i) => !0 !== i, !0)
                              );
                            })(s, r, i, e).pipe(
                              St((a) =>
                                a &&
                                (function P$(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function G$(e, n, t, r) {
                                      return mt(n).pipe(
                                        bi((i) =>
                                          ja(
                                            (function z$(e, n) {
                                              return (
                                                null !== e && n && n(new l$(e)),
                                                q(!0)
                                              );
                                            })(i.route.parent, r),
                                            (function j$(e, n) {
                                              return (
                                                null !== e && n && n(new u$(e)),
                                                q(!0)
                                              );
                                            })(i.route, r),
                                            (function q$(e, n, t) {
                                              const r = n[n.length - 1],
                                                o = n
                                                  .slice(0, n.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function A$(e) {
                                                      const n = e.routeConfig
                                                        ? e.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return n && 0 !== n.length
                                                        ? { node: e, guards: n }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    wE(() =>
                                                      q(
                                                        s.guards.map((l) => {
                                                          const c =
                                                              Dl(s.node) ?? t,
                                                            u = Ms(l, c);
                                                          return Ci(
                                                            (function L$(e) {
                                                              return (
                                                                e &&
                                                                El(
                                                                  e.canActivateChild
                                                                )
                                                              );
                                                            })(u)
                                                              ? u.canActivateChild(
                                                                  r,
                                                                  e
                                                                )
                                                              : c.runInContext(
                                                                  () => u(r, e)
                                                                )
                                                          ).pipe(Di());
                                                        })
                                                      ).pipe(Ts())
                                                    )
                                                  );
                                              return q(o).pipe(Ts());
                                            })(e, i.path, t),
                                            (function W$(e, n, t) {
                                              const r = n.routeConfig
                                                ? n.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return q(!0);
                                              const i = r.map((o) =>
                                                wE(() => {
                                                  const s = Dl(n) ?? t,
                                                    a = Ms(o, s);
                                                  return Ci(
                                                    (function F$(e) {
                                                      return (
                                                        e && El(e.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(n, e)
                                                      : s.runInContext(() =>
                                                          a(n, e)
                                                        )
                                                  ).pipe(Di());
                                                })
                                              );
                                              return q(i).pipe(Ts());
                                            })(e, i.route, t)
                                          )
                                        ),
                                        Di((i) => !0 !== i, !0)
                                      );
                                    })(r, o, e, n)
                                  : q(a)
                              ),
                              Z((a) => ({ ...t, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (s) => this.events.next(s)),
                    ht((s) => {
                      if (
                        ((r.guardsResult = s.guardsResult), ro(s.guardsResult))
                      )
                        throw eS(0, s.guardsResult);
                      const a = new r$(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult
                      );
                      this.events.next(a);
                    }),
                    At(
                      (s) =>
                        !!s.guardsResult ||
                        (t.restoreHistory(s),
                        this.cancelNavigationTransition(s, "", 3),
                        !1)
                    ),
                    cm((s) => {
                      if (s.guards.canActivateChecks.length)
                        return q(s).pipe(
                          ht((a) => {
                            const l = new i$(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          zn((a) => {
                            let l = !1;
                            return q(a).pipe(
                              gG(
                                t.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              ht({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    (t.restoreHistory(a),
                                    this.cancelNavigationTransition(a, "", 2));
                                },
                              })
                            );
                          }),
                          ht((a) => {
                            const l = new o$(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    cm((s) => {
                      const a = (l) => {
                        const c = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          c.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              ht((u) => {
                                l.component = u;
                              }),
                              Z(() => {})
                            )
                          );
                        for (const u of l.children) c.push(...a(u));
                        return c;
                      };
                      return gu(a(s.targetSnapshot.root)).pipe(Zu(), bt(1));
                    }),
                    cm(() => this.afterPreactivation()),
                    Z((s) => {
                      const a = (function y$(e, n, t) {
                        const r = yl(e, n._root, t ? t._root : void 0);
                        return new YE(r, n);
                      })(
                        t.routeReuseStrategy,
                        s.targetSnapshot,
                        s.currentRouterState
                      );
                      return (r = { ...s, targetRouterState: a });
                    }),
                    ht((s) => {
                      (t.currentUrlTree = s.urlAfterRedirects),
                        (t.rawUrlTree = t.urlHandlingStrategy.merge(
                          s.urlAfterRedirects,
                          s.rawUrl
                        )),
                        (t.routerState = s.targetRouterState),
                        "deferred" === t.urlUpdateStrategy &&
                          (s.extras.skipLocationChange ||
                            t.setBrowserUrl(t.rawUrlTree, s),
                          (t.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((e, n, t) =>
                      Z(
                        (r) => (
                          new I$(
                            n,
                            r.targetRouterState,
                            r.currentRouterState,
                            t
                          ).activate(e),
                          r
                        )
                      ))(this.rootContexts, t.routeReuseStrategy, (s) =>
                      this.events.next(s)
                    ),
                    bt(1),
                    ht({
                      next: (s) => {
                        (i = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          (t.navigated = !0),
                          this.events.next(
                            new io(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(t.currentUrlTree)
                            )
                          ),
                          t.titleStrategy?.updateTitle(
                            s.targetRouterState.snapshot
                          ),
                          s.resolve(!0);
                      },
                      complete: () => {
                        i = !0;
                      },
                    }),
                    Ug(() => {
                      i || o || this.cancelNavigationTransition(r, "", 1),
                        this.currentNavigation?.id === r.id &&
                          (this.currentNavigation = null);
                    }),
                    Sr((s) => {
                      if (((o = !0), rS(s))) {
                        nS(s) || ((t.navigated = !0), t.restoreHistory(r, !0));
                        const a = new od(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode
                        );
                        if ((this.events.next(a), nS(s))) {
                          const l = t.urlHandlingStrategy.merge(
                              s.url,
                              t.rawUrlTree
                            ),
                            c = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl:
                                "eager" === t.urlUpdateStrategy || CS(r.source),
                            };
                          t.scheduleNavigation(l, vl, null, c, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        t.restoreHistory(r, !0);
                        const a = new Yg(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0
                        );
                        this.events.next(a);
                        try {
                          r.resolve(t.errorHandler(s));
                        } catch (l) {
                          r.reject(l);
                        }
                      }
                      return kn;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(t, r, i) {
            const o = new od(
              t.id,
              this.urlSerializer.serialize(t.extractedUrl),
              r,
              i
            );
            this.events.next(o), t.resolve(!1);
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)();
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function CS(e) {
        return e !== vl;
      }
      let wS = (() => {
          class e {
            buildTitle(t) {
              let r,
                i = t.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r),
                  (i = i.children.find((o) => o.outlet === de));
              return r;
            }
            getResolvedTitleForRoute(t) {
              return t.data[fl];
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function () {
                return se(DG);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        DG = (() => {
          class e extends wS {
            constructor(t) {
              super(), (this.title = t);
            }
            updateTitle(t) {
              const r = this.buildTitle(t);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(L(_D));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        CG = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function () {
                return se(EG);
              },
              providedIn: "root",
            })),
            e
          );
        })();
      class wG {
        shouldDetach(n) {
          return !1;
        }
        store(n, t) {}
        shouldAttach(n) {
          return !1;
        }
        retrieve(n) {
          return null;
        }
        shouldReuseRoute(n, t) {
          return n.routeConfig === t.routeConfig;
        }
      }
      let EG = (() => {
        class e extends wG {}
        return (
          (e.ɵfac = (function () {
            let n;
            return function (r) {
              return (n || (n = st(e)))(r || e);
            };
          })()),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const _d = new z("", { providedIn: "root", factory: () => ({}) });
      let MG = (() => {
          class e {}
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({
              token: e,
              factory: function () {
                return se(TG);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        TG = (() => {
          class e {
            shouldProcessUrl(t) {
              return !0;
            }
            extract(t) {
              return t;
            }
            merge(t, r) {
              return t;
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      function NG(e) {
        throw e;
      }
      function IG(e, n, t) {
        return n.parse("/");
      }
      const OG = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        AG = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let et = (() => {
          class e {
            get navigationId() {
              return this.navigationTransitions.navigationId;
            }
            get browserPageId() {
              if ("computed" === this.canceledNavigationResolution)
                return this.location.getState()?.ɵrouterPageId;
            }
            get events() {
              return this.navigationTransitions.events;
            }
            constructor() {
              (this.disposed = !1),
                (this.currentPageId = 0),
                (this.console = se(Ox)),
                (this.isNgZoneEnabled = !1),
                (this.options = se(_d, { optional: !0 }) || {}),
                (this.errorHandler = this.options.errorHandler || NG),
                (this.malformedUriErrorHandler =
                  this.options.malformedUriErrorHandler || IG),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1),
                (this.urlHandlingStrategy = se(MG)),
                (this.routeReuseStrategy = se(CG)),
                (this.urlCreationStrategy = se(m$)),
                (this.titleStrategy = se(wS)),
                (this.onSameUrlNavigation =
                  this.options.onSameUrlNavigation || "ignore"),
                (this.paramsInheritanceStrategy =
                  this.options.paramsInheritanceStrategy || "emptyOnly"),
                (this.urlUpdateStrategy =
                  this.options.urlUpdateStrategy || "deferred"),
                (this.canceledNavigationResolution =
                  this.options.canceledNavigationResolution || "replace"),
                (this.config = IE(se(Ns, { optional: !0 }) ?? [])),
                (this.navigationTransitions = se(md)),
                (this.urlSerializer = se(pl)),
                (this.location = se($i)),
                (this.isNgZoneEnabled =
                  se(Ce) instanceof Ce && Ce.isInAngularZone()),
                this.resetConfig(this.config),
                (this.currentUrlTree = new wi()),
                (this.rawUrlTree = this.currentUrlTree),
                (this.browserUrlTree = this.currentUrlTree),
                (this.routerState = JE(this.currentUrlTree, null)),
                this.navigationTransitions.setupNavigations(this).subscribe(
                  (t) => {
                    (this.lastSuccessfulId = t.id),
                      (this.currentPageId = this.browserPageId ?? 0);
                  },
                  (t) => {
                    this.console.warn(`Unhandled Navigation Error: ${t}`);
                  }
                );
            }
            resetRootComponentType(t) {
              (this.routerState.root.component = t),
                (this.navigationTransitions.rootComponentType = t);
            }
            initialNavigation() {
              if (
                (this.setUpLocationChangeListener(),
                !this.navigationTransitions.hasRequestedNavigation)
              ) {
                const t = this.location.getState();
                this.navigateToSyncWithBrowser(this.location.path(!0), vl, t);
              }
            }
            setUpLocationChangeListener() {
              this.locationSubscription ||
                (this.locationSubscription = this.location.subscribe((t) => {
                  const r = "popstate" === t.type ? "popstate" : "hashchange";
                  "popstate" === r &&
                    setTimeout(() => {
                      this.navigateToSyncWithBrowser(t.url, r, t.state);
                    }, 0);
                }));
            }
            navigateToSyncWithBrowser(t, r, i) {
              const o = { replaceUrl: !0 },
                s = i?.navigationId ? i : null;
              if (i) {
                const l = { ...i };
                delete l.navigationId,
                  delete l.ɵrouterPageId,
                  0 !== Object.keys(l).length && (o.state = l);
              }
              const a = this.parseUrl(t);
              this.scheduleNavigation(a, r, s, o);
            }
            get url() {
              return this.serializeUrl(this.currentUrlTree);
            }
            getCurrentNavigation() {
              return this.navigationTransitions.currentNavigation;
            }
            resetConfig(t) {
              (this.config = t.map(om)),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1);
            }
            ngOnDestroy() {
              this.dispose();
            }
            dispose() {
              this.navigationTransitions.complete(),
                this.locationSubscription &&
                  (this.locationSubscription.unsubscribe(),
                  (this.locationSubscription = void 0)),
                (this.disposed = !0);
            }
            createUrlTree(t, r = {}) {
              const {
                  relativeTo: i,
                  queryParams: o,
                  fragment: s,
                  queryParamsHandling: a,
                  preserveFragment: l,
                } = r,
                c = l ? this.currentUrlTree.fragment : s;
              let u = null;
              switch (a) {
                case "merge":
                  u = { ...this.currentUrlTree.queryParams, ...o };
                  break;
                case "preserve":
                  u = this.currentUrlTree.queryParams;
                  break;
                default:
                  u = o || null;
              }
              return (
                null !== u && (u = this.removeEmptyProps(u)),
                this.urlCreationStrategy.createUrlTree(
                  i,
                  this.routerState,
                  this.currentUrlTree,
                  t,
                  u,
                  c ?? null
                )
              );
            }
            navigateByUrl(t, r = { skipLocationChange: !1 }) {
              const i = ro(t) ? t : this.parseUrl(t),
                o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
              return this.scheduleNavigation(o, vl, null, r);
            }
            navigate(t, r = { skipLocationChange: !1 }) {
              return (
                (function RG(e) {
                  for (let n = 0; n < e.length; n++) {
                    const t = e[n];
                    if (null == t) throw new B(4008, false);
                  }
                })(t),
                this.navigateByUrl(this.createUrlTree(t, r), r)
              );
            }
            serializeUrl(t) {
              return this.urlSerializer.serialize(t);
            }
            parseUrl(t) {
              let r;
              try {
                r = this.urlSerializer.parse(t);
              } catch (i) {
                r = this.malformedUriErrorHandler(i, this.urlSerializer, t);
              }
              return r;
            }
            isActive(t, r) {
              let i;
              if (
                ((i = !0 === r ? { ...OG } : !1 === r ? { ...AG } : r), ro(t))
              )
                return RE(this.currentUrlTree, t, i);
              const o = this.parseUrl(t);
              return RE(this.currentUrlTree, o, i);
            }
            removeEmptyProps(t) {
              return Object.keys(t).reduce((r, i) => {
                const o = t[i];
                return null != o && (r[i] = o), r;
              }, {});
            }
            scheduleNavigation(t, r, i, o, s) {
              if (this.disposed) return Promise.resolve(!1);
              let a, l, c, u;
              return (
                s
                  ? ((a = s.resolve), (l = s.reject), (c = s.promise))
                  : (c = new Promise((d, f) => {
                      (a = d), (l = f);
                    })),
                (u =
                  "computed" === this.canceledNavigationResolution
                    ? i && i.ɵrouterPageId
                      ? i.ɵrouterPageId
                      : (this.browserPageId ?? 0) + 1
                    : 0),
                this.navigationTransitions.handleNavigationRequest({
                  targetPageId: u,
                  source: r,
                  restoredState: i,
                  currentUrlTree: this.currentUrlTree,
                  currentRawUrl: this.currentUrlTree,
                  rawUrl: t,
                  extras: o,
                  resolve: a,
                  reject: l,
                  promise: c,
                  currentSnapshot: this.routerState.snapshot,
                  currentRouterState: this.routerState,
                }),
                c.catch((d) => Promise.reject(d))
              );
            }
            setBrowserUrl(t, r) {
              const i = this.urlSerializer.serialize(t);
              if (
                this.location.isCurrentPathEqualTo(i) ||
                r.extras.replaceUrl
              ) {
                const s = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(r.id, this.browserPageId),
                };
                this.location.replaceState(i, "", s);
              } else {
                const o = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(r.id, r.targetPageId),
                };
                this.location.go(i, "", o);
              }
            }
            restoreHistory(t, r = !1) {
              if ("computed" === this.canceledNavigationResolution) {
                const o =
                  this.currentPageId -
                  (this.browserPageId ?? this.currentPageId);
                0 !== o
                  ? this.location.historyGo(o)
                  : this.currentUrlTree ===
                      this.getCurrentNavigation()?.finalUrl &&
                    0 === o &&
                    (this.resetState(t),
                    (this.browserUrlTree = t.currentUrlTree),
                    this.resetUrlToCurrentUrlTree());
              } else
                "replace" === this.canceledNavigationResolution &&
                  (r && this.resetState(t), this.resetUrlToCurrentUrlTree());
            }
            resetState(t) {
              (this.routerState = t.currentRouterState),
                (this.currentUrlTree = t.currentUrlTree),
                (this.rawUrlTree = this.urlHandlingStrategy.merge(
                  this.currentUrlTree,
                  t.rawUrl
                ));
            }
            resetUrlToCurrentUrlTree() {
              this.location.replaceState(
                this.urlSerializer.serialize(this.rawUrlTree),
                "",
                this.generateNgRouterState(
                  this.lastSuccessfulId,
                  this.currentPageId
                )
              );
            }
            generateNgRouterState(t, r) {
              return "computed" === this.canceledNavigationResolution
                ? { navigationId: t, ɵrouterPageId: r }
                : { navigationId: t };
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)();
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        lr = (() => {
          class e {
            constructor(t, r, i, o, s, a) {
              (this.router = t),
                (this.route = r),
                (this.tabIndexAttribute = i),
                (this.renderer = o),
                (this.el = s),
                (this.locationStrategy = a),
                (this._preserveFragment = !1),
                (this._skipLocationChange = !1),
                (this._replaceUrl = !1),
                (this.href = null),
                (this.commands = null),
                (this.onChanges = new Pe());
              const l = s.nativeElement.tagName?.toLowerCase();
              (this.isAnchorElement = "a" === l || "area" === l),
                this.isAnchorElement
                  ? (this.subscription = t.events.subscribe((c) => {
                      c instanceof io && this.updateHref();
                    }))
                  : this.setTabIndexIfNotOnNativeEl("0");
            }
            set preserveFragment(t) {
              this._preserveFragment = os(t);
            }
            get preserveFragment() {
              return this._preserveFragment;
            }
            set skipLocationChange(t) {
              this._skipLocationChange = os(t);
            }
            get skipLocationChange() {
              return this._skipLocationChange;
            }
            set replaceUrl(t) {
              this._replaceUrl = os(t);
            }
            get replaceUrl() {
              return this._replaceUrl;
            }
            setTabIndexIfNotOnNativeEl(t) {
              null != this.tabIndexAttribute ||
                this.isAnchorElement ||
                this.applyAttributeValue("tabindex", t);
            }
            ngOnChanges(t) {
              this.isAnchorElement && this.updateHref(),
                this.onChanges.next(this);
            }
            set routerLink(t) {
              null != t
                ? ((this.commands = Array.isArray(t) ? t : [t]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick(t, r, i, o, s) {
              return (
                !!(
                  null === this.urlTree ||
                  (this.isAnchorElement &&
                    (0 !== t ||
                      r ||
                      i ||
                      o ||
                      s ||
                      ("string" == typeof this.target &&
                        "_self" != this.target)))
                ) ||
                (this.router.navigateByUrl(this.urlTree, {
                  skipLocationChange: this.skipLocationChange,
                  replaceUrl: this.replaceUrl,
                  state: this.state,
                }),
                !this.isAnchorElement)
              );
            }
            ngOnDestroy() {
              this.subscription?.unsubscribe();
            }
            updateHref() {
              this.href =
                null !== this.urlTree && this.locationStrategy
                  ? this.locationStrategy?.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
              const t =
                null === this.href
                  ? null
                  : (function Fv(e, n, t) {
                      return (function zN(e, n) {
                        return ("src" === n &&
                          ("embed" === e ||
                            "frame" === e ||
                            "iframe" === e ||
                            "media" === e ||
                            "script" === e)) ||
                          ("href" === n && ("base" === e || "link" === e))
                          ? kv
                          : li;
                      })(
                        n,
                        t
                      )(e);
                    })(
                      this.href,
                      this.el.nativeElement.tagName.toLowerCase(),
                      "href"
                    );
              this.applyAttributeValue("href", t);
            }
            applyAttributeValue(t, r) {
              const i = this.renderer,
                o = this.el.nativeElement;
              null !== r ? i.setAttribute(o, t, r) : i.removeAttribute(o, t);
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(
                _(et),
                _(Nr),
                si("tabindex"),
                _(pn),
                _(De),
                _(Ui)
              );
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["", "routerLink", ""]],
              hostVars: 1,
              hostBindings: function (t, r) {
                1 & t &&
                  P("click", function (o) {
                    return r.onClick(
                      o.button,
                      o.ctrlKey,
                      o.shiftKey,
                      o.altKey,
                      o.metaKey
                    );
                  }),
                  2 & t && ve("target", r.target);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [ot],
            })),
            e
          );
        })(),
        ES = (() => {
          class e {
            get isActive() {
              return this._isActive;
            }
            constructor(t, r, i, o, s) {
              (this.router = t),
                (this.element = r),
                (this.renderer = i),
                (this.cdr = o),
                (this.link = s),
                (this.classes = []),
                (this._isActive = !1),
                (this.routerLinkActiveOptions = { exact: !1 }),
                (this.isActiveChange = new W()),
                (this.routerEventsSubscription = t.events.subscribe((a) => {
                  a instanceof io && this.update();
                }));
            }
            ngAfterContentInit() {
              q(this.links.changes, q(null))
                .pipe(mo())
                .subscribe((t) => {
                  this.update(), this.subscribeToEachLinkOnChanges();
                });
            }
            subscribeToEachLinkOnChanges() {
              this.linkInputChangesSubscription?.unsubscribe();
              const t = [...this.links.toArray(), this.link]
                .filter((r) => !!r)
                .map((r) => r.onChanges);
              this.linkInputChangesSubscription = mt(t)
                .pipe(mo())
                .subscribe((r) => {
                  this._isActive !== this.isLinkActive(this.router)(r) &&
                    this.update();
                });
            }
            set routerLinkActive(t) {
              const r = Array.isArray(t) ? t : t.split(" ");
              this.classes = r.filter((i) => !!i);
            }
            ngOnChanges(t) {
              this.update();
            }
            ngOnDestroy() {
              this.routerEventsSubscription.unsubscribe(),
                this.linkInputChangesSubscription?.unsubscribe();
            }
            update() {
              !this.links ||
                !this.router.navigated ||
                Promise.resolve().then(() => {
                  const t = this.hasActiveLinks();
                  this._isActive !== t &&
                    ((this._isActive = t),
                    this.cdr.markForCheck(),
                    this.classes.forEach((r) => {
                      t
                        ? this.renderer.addClass(this.element.nativeElement, r)
                        : this.renderer.removeClass(
                            this.element.nativeElement,
                            r
                          );
                    }),
                    t && void 0 !== this.ariaCurrentWhenActive
                      ? this.renderer.setAttribute(
                          this.element.nativeElement,
                          "aria-current",
                          this.ariaCurrentWhenActive.toString()
                        )
                      : this.renderer.removeAttribute(
                          this.element.nativeElement,
                          "aria-current"
                        ),
                    this.isActiveChange.emit(t));
                });
            }
            isLinkActive(t) {
              const r = (function xG(e) {
                return !!e.paths;
              })(this.routerLinkActiveOptions)
                ? this.routerLinkActiveOptions
                : this.routerLinkActiveOptions.exact || !1;
              return (i) => !!i.urlTree && t.isActive(i.urlTree, r);
            }
            hasActiveLinks() {
              const t = this.isLinkActive(this.router);
              return (this.link && t(this.link)) || this.links.some(t);
            }
          }
          return (
            (e.ɵfac = function (t) {
              return new (t || e)(_(et), _(De), _(pn), _(_n), _(lr, 8));
            }),
            (e.ɵdir = V({
              type: e,
              selectors: [["", "routerLinkActive", ""]],
              contentQueries: function (t, r, i) {
                if ((1 & t && je(i, lr, 5), 2 & t)) {
                  let o;
                  we((o = Ee())) && (r.links = o);
                }
              },
              inputs: {
                routerLinkActiveOptions: "routerLinkActiveOptions",
                ariaCurrentWhenActive: "ariaCurrentWhenActive",
                routerLinkActive: "routerLinkActive",
              },
              outputs: { isActiveChange: "isActiveChange" },
              exportAs: ["routerLinkActive"],
              standalone: !0,
              features: [ot],
            })),
            e
          );
        })();
      class SS {}
      let PG = (() => {
        class e {
          constructor(t, r, i, o, s) {
            (this.router = t),
              (this.injector = i),
              (this.preloadingStrategy = o),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                At((t) => t instanceof io),
                bi(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(t, r) {
            const i = [];
            for (const o of r) {
              o.providers &&
                !o._injector &&
                (o._injector = Uc(o.providers, t, `Route: ${o.path}`));
              const s = o._injector ?? t,
                a = o._loadedInjector ?? s;
              ((o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
                (o.loadComponent && !o._loadedComponent)) &&
                i.push(this.preloadConfig(s, o)),
                (o.children || o._loadedRoutes) &&
                  i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return mt(i).pipe(mo());
          }
          preloadConfig(t, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(t, r)
                  : q(null);
              const o = i.pipe(
                St((s) =>
                  null === s
                    ? q(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? t, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? mt([o, this.loader.loadComponent(r)]).pipe(mo())
                : o;
            });
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(et), L(qb), L(Hn), L(SS), L(um));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const fm = new z("");
      let MS = (() => {
        class e {
          constructor(t, r, i, o, s = {}) {
            (this.urlSerializer = t),
              (this.transitions = r),
              (this.viewportScroller = i),
              (this.zone = o),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((t) => {
              t instanceof Kg
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = t.navigationTrigger),
                  (this.restoredId = t.restoredState
                    ? t.restoredState.navigationId
                    : 0))
                : t instanceof io &&
                  ((this.lastId = t.id),
                  this.scheduleScrollEvent(
                    t,
                    this.urlSerializer.parse(t.urlAfterRedirects).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((t) => {
              t instanceof qE &&
                (t.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(t.position)
                  : t.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(t.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(t, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new qE(
                      t,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (t) {
            !(function fy() {
              throw new Error("invalid");
            })();
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      var Rn = (() => (
        ((Rn = Rn || {})[(Rn.COMPLETE = 0)] = "COMPLETE"),
        (Rn[(Rn.FAILED = 1)] = "FAILED"),
        (Rn[(Rn.REDIRECTING = 2)] = "REDIRECTING"),
        Rn
      ))();
      const Is = !1;
      function Ei(e, n) {
        return { ɵkind: e, ɵproviders: n };
      }
      const hm = new z("", { providedIn: "root", factory: () => !1 });
      function NS() {
        const e = se(gn);
        return (n) => {
          const t = e.get(is);
          if (n !== t.components[0]) return;
          const r = e.get(et),
            i = e.get(IS);
          1 === e.get(pm) && r.initialNavigation(),
            e.get(OS, null, ee.Optional)?.setUpPreloading(),
            e.get(fm, null, ee.Optional)?.init(),
            r.resetRootComponentType(t.componentTypes[0]),
            i.closed || (i.next(), i.complete(), i.unsubscribe());
        };
      }
      const IS = new z(Is ? "bootstrap done indicator" : "", {
          factory: () => new Pe(),
        }),
        pm = new z(Is ? "initial navigation" : "", {
          providedIn: "root",
          factory: () => 1,
        });
      function VG() {
        let e = [];
        return (
          (e = Is
            ? [
                {
                  provide: Dc,
                  multi: !0,
                  useFactory: () => {
                    const n = se(et);
                    return () =>
                      n.events.subscribe((t) => {
                        console.group?.(`Router Event: ${t.constructor.name}`),
                          console.log(
                            (function f$(e) {
                              if (!("type" in e))
                                return `Unknown Router Event: ${e.constructor.name}`;
                              switch (e.type) {
                                case 14:
                                  return `ActivationEnd(path: '${
                                    e.snapshot.routeConfig?.path || ""
                                  }')`;
                                case 13:
                                  return `ActivationStart(path: '${
                                    e.snapshot.routeConfig?.path || ""
                                  }')`;
                                case 12:
                                  return `ChildActivationEnd(path: '${
                                    e.snapshot.routeConfig?.path || ""
                                  }')`;
                                case 11:
                                  return `ChildActivationStart(path: '${
                                    e.snapshot.routeConfig?.path || ""
                                  }')`;
                                case 8:
                                  return `GuardsCheckEnd(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state}, shouldActivate: ${e.shouldActivate})`;
                                case 7:
                                  return `GuardsCheckStart(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state})`;
                                case 2:
                                  return `NavigationCancel(id: ${e.id}, url: '${e.url}')`;
                                case 16:
                                  return `NavigationSkipped(id: ${e.id}, url: '${e.url}')`;
                                case 1:
                                  return `NavigationEnd(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}')`;
                                case 3:
                                  return `NavigationError(id: ${e.id}, url: '${e.url}', error: ${e.error})`;
                                case 0:
                                  return `NavigationStart(id: ${e.id}, url: '${e.url}')`;
                                case 6:
                                  return `ResolveEnd(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state})`;
                                case 5:
                                  return `ResolveStart(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state})`;
                                case 10:
                                  return `RouteConfigLoadEnd(path: ${e.route.path})`;
                                case 9:
                                  return `RouteConfigLoadStart(path: ${e.route.path})`;
                                case 4:
                                  return `RoutesRecognized(id: ${e.id}, url: '${e.url}', urlAfterRedirects: '${e.urlAfterRedirects}', state: ${e.state})`;
                                case 15:
                                  return `Scroll(anchor: '${
                                    e.anchor
                                  }', position: '${
                                    e.position
                                      ? `${e.position[0]}, ${e.position[1]}`
                                      : null
                                  }')`;
                              }
                            })(t)
                          ),
                          console.log(t),
                          console.groupEnd?.();
                      });
                  },
                },
              ]
            : []),
          Ei(1, e)
        );
      }
      const OS = new z(Is ? "router preloader" : "");
      function HG(e) {
        return Ei(0, [
          { provide: OS, useExisting: PG },
          { provide: SS, useExisting: e },
        ]);
      }
      const Ml = !1,
        AS = new z(
          Ml ? "router duplicate forRoot guard" : "ROUTER_FORROOT_GUARD"
        ),
        UG = [
          $i,
          { provide: pl, useClass: $g },
          et,
          bl,
          {
            provide: Nr,
            useFactory: function TS(e) {
              return e.routerState.root;
            },
            deps: [et],
          },
          um,
          Ml ? { provide: hm, useValue: !0 } : [],
        ];
      function $G() {
        return new t0("Router", et);
      }
      let RS = (() => {
        class e {
          constructor(t) {}
          static forRoot(t, r) {
            return {
              ngModule: e,
              providers: [
                UG,
                Ml && r?.enableTracing ? VG().ɵproviders : [],
                { provide: Ns, multi: !0, useValue: t },
                {
                  provide: AS,
                  useFactory: WG,
                  deps: [[et, new oa(), new sa()]],
                },
                { provide: _d, useValue: r || {} },
                r?.useHash
                  ? { provide: Ui, useClass: _P }
                  : { provide: Ui, useClass: S0 },
                {
                  provide: fm,
                  useFactory: () => {
                    const e = se(xk),
                      n = se(Ce),
                      t = se(_d),
                      r = se(md),
                      i = se(pl);
                    return (
                      t.scrollOffset && e.setOffset(t.scrollOffset),
                      new MS(i, r, e, n, t)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? HG(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: t0, multi: !0, useFactory: $G },
                r?.initialNavigation ? qG(r) : [],
                [
                  { provide: xS, useFactory: NS },
                  { provide: e0, multi: !0, useExisting: xS },
                ],
              ],
            };
          }
          static forChild(t) {
            return {
              ngModule: e,
              providers: [{ provide: Ns, multi: !0, useValue: t }],
            };
          }
        }
        return (
          (e.ɵfac = function (t) {
            return new (t || e)(L(AS, 8));
          }),
          (e.ɵmod = ke({ type: e })),
          (e.ɵinj = Ie({ imports: [rm] })),
          e
        );
      })();
      function WG(e) {
        if (Ml && e)
          throw new B(
            4007,
            "The Router was provided more than once. This can happen if 'forRoot' is used outside of the root injector. Lazy loaded modules should use RouterModule.forChild() instead."
          );
        return "guarded";
      }
      function qG(e) {
        return [
          "disabled" === e.initialNavigation
            ? Ei(3, [
                {
                  provide: zc,
                  multi: !0,
                  useFactory: () => {
                    const n = se(et);
                    return () => {
                      n.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: pm, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? Ei(2, [
                { provide: pm, useValue: 0 },
                {
                  provide: zc,
                  multi: !0,
                  deps: [gn],
                  useFactory: (n) => {
                    const t = n.get(gP, Promise.resolve());
                    return () =>
                      t.then(
                        () =>
                          new Promise((r) => {
                            const i = n.get(et),
                              o = n.get(IS);
                            (function kG(e, n) {
                              e.events
                                .pipe(
                                  At(
                                    (t) =>
                                      t instanceof io ||
                                      t instanceof od ||
                                      t instanceof Yg ||
                                      t instanceof sd
                                  ),
                                  Z((t) =>
                                    t instanceof io || t instanceof sd
                                      ? Rn.COMPLETE
                                      : t instanceof od &&
                                        (0 === t.code || 1 === t.code)
                                      ? Rn.REDIRECTING
                                      : Rn.FAILED
                                  ),
                                  At((t) => t !== Rn.REDIRECTING),
                                  bt(1)
                                )
                                .subscribe(() => {
                                  n();
                                });
                            })(i, () => {
                              r(!0);
                            }),
                              (n.get(md).afterPreactivation = () => (
                                r(!0), o.closed ? q(void 0) : o
                              )),
                              i.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const xS = new z(Ml ? "Router Initializer" : "");
      let Tl = (() => {
          class n {}
          return (n.API_VERSION = "/api/v1"), n;
        })(),
        Qr = (() => {
          var e;
          class n {
            constructor(r, i) {
              (this.http = r),
                (this.router = i),
                (this.URL = Tl.API_VERSION),
                (this.user = void 0),
                (this.userSubject = new Ot(void 0)),
                this.ngOnInit();
            }
            ngOnInit() {
              this.getAuthenticatedUser().subscribe();
            }
            isAuthenticated() {
              return null != this.user;
            }
            isAdmin() {
              return !!this.user?.admin;
            }
            setUser(r) {
              (this.user = r),
                this.user
                  ? window.localStorage.setItem("user", JSON.stringify(r))
                  : window.localStorage.clear(),
                this.userSubject.next(r);
            }
            fetchUser() {
              return this.http.get(this.URL + "/who/").pipe(
                ht((r) => {
                  this.setUser(r),
                    "/login" == this.router.url &&
                      (this.router.navigateByUrl("discover"),
                      window.localStorage.setItem(
                        "setupTime",
                        new Date().getTime().toString()
                      ));
                }),
                Sr((r) => (window.localStorage.clear(), q(void 0)))
              );
            }
            getAuthenticatedUser() {
              const r = window.localStorage.getItem("setupTime"),
                o = new Date().getTime();
              let s = window.localStorage.getItem("user");
              if (s && r && Number(r) + 6e5 > o) {
                let a = JSON.parse(s);
                return this.setUser(a), q(a);
              }
              return this.fetchUser();
            }
            login(r, i) {
              const o = this.URL + "/login",
                s = new Jr().set("email", r).set("password", i),
                a = new Er({
                  "Content-Type": "application/x-www-form-urlencoded",
                });
              return this.http.post(o, s, { headers: a }).pipe(
                Sr((l) => q(l.error)),
                ht((l) => {
                  "object" == typeof l &&
                    "email" in l &&
                    l.email &&
                    (window.localStorage.setItem(
                      "setupTime",
                      new Date().getTime().toString()
                    ),
                    this.setUser(l));
                })
              );
            }
            register(r, i, o, s) {
              return this.http.post(this.URL + "/users", {
                email: r,
                password: i,
                firstName: o,
                lastName: s,
              });
            }
            logout() {
              return this.http
                .post(this.URL + "/logout", {})
                .pipe(ht(() => this.setUser(void 0)));
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(L(ys), L(et));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            n
          );
        })();
      const YG = function () {
        return ["/register"];
      };
      let JG = (() => {
          var e;
          class n {
            constructor(r, i) {
              (this.router = r),
                (this.authService = i),
                (this.errorOccured = !1),
                (this.errorMsg = "");
            }
            ngOnInit() {
              (this.email = ""), (this.password = "");
            }
            login() {
              (this.errorOccured = !1),
                (this.errorMsg = ""),
                this.email &&
                  this.password &&
                  this.authService
                    .login(this.email, this.password)
                    .subscribe((r) => {
                      "object" == typeof r && "email" in r && r.email
                        ? ((this.email = ""),
                          (this.password = ""),
                          this.router.navigateByUrl("discover"))
                        : "object" != typeof r
                        ? ((this.errorMsg = r),
                          (this.errorOccured = !0),
                          (this.password = ""))
                        : ((this.errorMsg =
                            "Something went wrong, try again later."),
                          (this.errorOccured = !0),
                          (this.password = ""));
                    });
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(_(et), _(Qr));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["app-login"]],
              inputs: { email: "email", password: "password" },
              decls: 34,
              vars: 6,
              consts: [
                [1, "background"],
                [1, "flex-column", "d-flex"],
                [1, "d-flex", "justify-content-center", "mt-3"],
                [
                  "id",
                  "game-shelf-icon",
                  "src",
                  "../../../assets/gs-logo.png",
                  "alt",
                  "Game Shelf Icon",
                ],
                [1, "d-flex", "justify-content-center"],
                ["id", "login-form", 1, "float-end", "card", "shadow"],
                ["id", "error-container", 1, "text-danger", 3, "hidden"],
                [1, "form-group", "mb-2"],
                ["for", "username"],
                [
                  "type",
                  "text",
                  "name",
                  "email",
                  "placeholder",
                  "Email",
                  1,
                  "form-control",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["for", "password"],
                [
                  "type",
                  "password",
                  "name",
                  "password",
                  "placeholder",
                  "Password",
                  1,
                  "form-control",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                [1, "px-3", "d-flex", "flex-column", "gap-2"],
                [1, "row"],
                [
                  "type",
                  "submit",
                  1,
                  "btn",
                  "btn-primary",
                  "btn-sm",
                  3,
                  "click",
                ],
                [1, "btn", "btn-secondary", "btn-sm", 3, "routerLink"],
                [1, "separator", "text-secondary"],
                [1, "d-flex", "justify-content-center", "gap-2"],
                [
                  "id",
                  "google-icon",
                  "href",
                  "/api/v1/login/federated/google",
                  1,
                  "btn",
                  "btn-light",
                  "rounded-circle",
                  "auth-btn",
                ],
                [
                  "src",
                  "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                  "alt",
                  "Google Logo",
                  1,
                  "auth-icon",
                ],
                [
                  "id",
                  "twitter-icon",
                  "href",
                  "/api/v1/login/federated/twitter",
                  1,
                  "btn",
                  "btn-primary",
                  "rounded-circle",
                  "auth-btn",
                ],
                [1, "fa", "fa-2x", "fa-twitter", "auth-icon"],
              ],
              template: function (r, i) {
                1 & r &&
                  (p(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  A(3, "img", 3),
                  m(),
                  p(4, "div", 4)(5, "form", 5)(6, "h3"),
                  N(7, "Welcome!"),
                  m(),
                  p(8, "div")(9, "div", 6),
                  N(10),
                  m(),
                  p(11, "div")(12, "div", 7)(13, "label", 8),
                  N(14, "Email"),
                  m(),
                  p(15, "input", 9),
                  P("ngModelChange", function (s) {
                    return (i.email = s);
                  }),
                  m()(),
                  p(16, "div", 7)(17, "label", 10),
                  N(18, "Password"),
                  m(),
                  p(19, "input", 11),
                  P("ngModelChange", function (s) {
                    return (i.password = s);
                  }),
                  m()()(),
                  p(20, "div", 12)(21, "div", 13)(22, "button", 14),
                  P("click", function () {
                    return i.login();
                  }),
                  N(23, "Login "),
                  m()(),
                  p(24, "div", 13)(25, "a", 15),
                  N(26, "Register "),
                  m()()(),
                  p(27, "div", 16),
                  N(28, "Or Sign In Using"),
                  m(),
                  p(29, "div", 17)(30, "a", 18),
                  A(31, "img", 19),
                  m(),
                  p(32, "a", 20),
                  A(33, "i", 21),
                  m()()()()()()()),
                  2 & r &&
                    (g(9),
                    v("hidden", !i.errorOccured),
                    g(1),
                    Je(" *", i.errorMsg, " "),
                    g(5),
                    v("ngModel", i.email),
                    g(4),
                    v("ngModel", i.password),
                    g(6),
                    v("routerLink", xe(5, YG)));
              },
              dependencies: [lr, Ja, Dr, _i, za, Kr, ji],
              styles: [
                '#login-form[_ngcontent-%COMP%]{max-width:600px;min-width:300px;padding:15px;background-color:#eee;border-radius:.5em;margin-top:1em;margin-right:1em;height:-moz-fit-content;height:fit-content;width:-moz-fit-content;width:fit-content}#error-container[_ngcontent-%COMP%]{max-width:260px}#game-shelf-icon[_ngcontent-%COMP%]{max-width:100px}.things-title[_ngcontent-%COMP%]{font-size:400%;text-shadow:3px 3px 3px black;font-family:Montserrat,sans-serif;font-weight:700;color:#fff;letter-spacing:3px}.auth-icon[_ngcontent-%COMP%]{max-width:35px;max-height:35px;min-height:35px;min-width:35px;margin:0;padding:0}#google-icon[_ngcontent-%COMP%]:hover{background-color:#d3d3d3}#twitter-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{padding-top:3px!important;color:#fff}.auth-btn[_ngcontent-%COMP%]{padding:5px;border:0}.separator[_ngcontent-%COMP%]{display:flex;align-items:center;text-align:center;margin:10px 0}.separator[_ngcontent-%COMP%]:before, .separator[_ngcontent-%COMP%]:after{content:"";flex:1;border-bottom:1px solid gray}.separator[_ngcontent-%COMP%]:not(:empty):before{margin-right:.5em}.separator[_ngcontent-%COMP%]:not(:empty):after{margin-left:.5em}',
              ],
            })),
            n
          );
        })(),
        PS = (() => {
          var e;
          class n {
            constructor(r) {
              (this.http = r), (this.URL = Tl.API_VERSION);
            }
            search(r) {
              return this.http
                .get(this.URL + `/search?name=${r}`, { observe: "response" })
                .pipe(
                  Z((i) => {
                    let o = i.headers.get("Search-Count");
                    return null === i.body
                      ? { games: [], count: 0 }
                      : { games: i.body, count: parseInt(o ?? "", 10) };
                  })
                );
            }
            orderBy(r) {
              return this.http.get(this.URL + `/search?orderBy=${r}`);
            }
            getOne(r) {
              return this.http.get(this.URL + `/games/${r}`);
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(L(ys));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        gm = (() => {
          var e;
          class n {
            constructor(r) {
              (this.http = r), (this.URL = Tl.API_VERSION);
            }
            getGameShelf() {
              return this.http.get(this.URL + "/gameshelf");
            }
            addGameToShelf(r) {
              return this.http.put(this.URL + "/gameshelf", { game: r });
            }
            removeGameFromShelf(r) {
              return this.http.delete(this.URL + `/gameshelf/${r}`);
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(L(ys));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            n
          );
        })();
      function ZG(e, n) {
        1 & e && (re(0), A(1, "i", 33), ie());
      }
      const mm = function () {
        return [1, 2, 3, 4, 5];
      };
      function QG(e, n) {
        1 & e &&
          (re(0), C(1, ZG, 2, 0, "ng-container", 16), tr(2, "slice"), ie()),
          2 & e && (g(1), v("ngForOf", di(2, 1, xe(5, mm), 0, 5)));
      }
      function XG(e, n) {
        1 & e && (re(0), A(1, "i", 34), ie());
      }
      function ej(e, n) {
        1 & e && (re(0), A(1, "i", 35), ie());
      }
      function tj(e, n) {
        1 & e && (re(0), A(1, "i", 33), ie());
      }
      const Si = function () {
        return [];
      };
      function nj(e, n) {
        if (
          (1 & e && (re(0), C(1, tj, 2, 0, "ng-container", 16), ie()), 2 & e)
        ) {
          const t = M(2).$implicit,
            r = M();
          g(1),
            v(
              "ngForOf",
              xe(1, Si).constructor(
                r.Math.floor(5 - r.Math.round(2 * t.rating) / 2)
              )
            );
        }
      }
      function rj(e, n) {
        if (
          (1 & e &&
            (re(0),
            C(1, XG, 2, 0, "ng-container", 16),
            C(2, ej, 2, 0, "ng-container", 19),
            C(3, nj, 2, 2, "ng-container", 19),
            ie()),
          2 & e)
        ) {
          const t = M().$implicit,
            r = M();
          g(1),
            v("ngForOf", xe(3, Si).constructor(r.Math.floor(t.rating))),
            g(1),
            v("ngIf", t.rating - r.Math.floor(t.rating) == 0.5),
            g(1),
            v("ngIf", 5 != r.Math.ceil(t.rating));
        }
      }
      function ij(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 36),
            P("click", function () {
              K(t);
              const i = M().$implicit;
              return Y(M().addGameToShelf(i));
            }),
            A(1, "i", 37),
            p(2, "span"),
            N(3, "Add to Game Shelf"),
            m()();
        }
      }
      function oj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 38),
            P("click", function () {
              K(t);
              const i = M().$implicit;
              return Y(M().removeFromShelf(i.bggGameId));
            }),
            A(1, "i", 39),
            p(2, "span"),
            N(3, "Remove from Shelf"),
            m()();
        }
      }
      const Os = function (e) {
        return ["/games", e];
      };
      function sj(e, n) {
        if (
          (1 & e &&
            (p(0, "tr")(1, "td", 20)(2, "a", 21),
            A(3, "img", 22),
            m()(),
            p(4, "td")(5, "div", 23)(6, "a", 24)(7, "strong"),
            N(8),
            m()()(),
            p(9, "div", 25)(10, "div", 4)(11, "div", 26)(12, "span"),
            A(13, "i", 27),
            N(14),
            m(),
            p(15, "span", 28),
            A(16, "i", 29),
            N(17),
            m()(),
            p(18, "div", 26),
            C(19, QG, 3, 6, "ng-container", 19),
            C(20, rj, 4, 4, "ng-container", 19),
            p(21, "span"),
            N(22),
            m()()(),
            p(23, "div", 30),
            C(24, ij, 4, 0, "button", 31),
            C(25, oj, 4, 0, "button", 32),
            m()()()()),
          2 & e)
        ) {
          const t = n.$implicit,
            r = M();
          g(2),
            v("routerLink", Ut(12, Os, t.bggGameId)),
            g(1),
            Ur("src", t.image, li),
            g(3),
            v("routerLink", Ut(14, Os, t.bggGameId)),
            g(2),
            Ue(t.name),
            g(6),
            $r(" ", t.minPlayers, "-", t.maxPlayers, ""),
            g(3),
            Je(" ", t.playtime, "m"),
            g(2),
            v("ngIf", !t.rating),
            g(1),
            v("ngIf", t.rating),
            g(2),
            Je(" - released ", t.year, ""),
            g(2),
            v("ngIf", !r.isGameInShelf(t)),
            g(1),
            v("ngIf", r.isGameInShelf(t));
        }
      }
      function aj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 40),
            P("click", function () {
              K(t);
              const i = M();
              return Y((i.currentSearchCount = i.currentSearchCount - 10));
            }),
            N(1, "\u2190"),
            m();
        }
      }
      function lj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 40),
            P("click", function () {
              K(t);
              const i = M();
              return Y((i.currentSearchCount = i.currentSearchCount + 10));
            }),
            N(1, "\u2192"),
            m();
        }
      }
      function cj(e, n) {
        1 & e && (p(0, "tr"), A(1, "td", 41)(2, "td", 41), m());
      }
      function uj(e, n) {
        1 & e && (p(0, "tbody"), C(1, cj, 3, 0, "tr", 16), m()),
          2 & e && (g(1), v("ngForOf", xe(1, Si).constructor(10)));
      }
      function dj(e, n) {
        1 & e && (re(0), A(1, "i", 33), ie());
      }
      function fj(e, n) {
        1 & e &&
          (re(0), C(1, dj, 2, 0, "ng-container", 16), tr(2, "slice"), ie()),
          2 & e && (g(1), v("ngForOf", di(2, 1, xe(5, mm), 0, 5)));
      }
      function hj(e, n) {
        1 & e && (re(0), A(1, "i", 34), ie());
      }
      function pj(e, n) {
        1 & e && (re(0), A(1, "i", 35), ie());
      }
      function gj(e, n) {
        1 & e && (re(0), A(1, "i", 33), ie());
      }
      function mj(e, n) {
        if (
          (1 & e && (re(0), C(1, gj, 2, 0, "ng-container", 16), ie()), 2 & e)
        ) {
          const t = M(2).$implicit,
            r = M(2);
          g(1),
            v(
              "ngForOf",
              xe(1, Si).constructor(
                r.Math.floor(5 - r.Math.round(2 * t.rating) / 2)
              )
            );
        }
      }
      function _j(e, n) {
        if (
          (1 & e &&
            (re(0),
            C(1, hj, 2, 0, "ng-container", 16),
            C(2, pj, 2, 0, "ng-container", 19),
            C(3, mj, 2, 2, "ng-container", 19),
            ie()),
          2 & e)
        ) {
          const t = M().$implicit,
            r = M(2);
          g(1),
            v("ngForOf", xe(3, Si).constructor(r.Math.floor(t.rating))),
            g(1),
            v("ngIf", t.rating - r.Math.floor(t.rating) == 0.5),
            g(1),
            v("ngIf", 5 != r.Math.ceil(t.rating));
        }
      }
      function vj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 36),
            P("click", function () {
              K(t);
              const i = M().$implicit;
              return Y(M(2).addGameToShelf(i));
            }),
            A(1, "i", 37),
            p(2, "span"),
            N(3, "Add to Game Shelf"),
            m()();
        }
      }
      function yj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 38),
            P("click", function () {
              K(t);
              const i = M().$implicit;
              return Y(M(2).removeFromShelf(i.bggGameId));
            }),
            A(1, "i", 39),
            p(2, "span"),
            N(3, "Remove from Shelf"),
            m()();
        }
      }
      function bj(e, n) {
        if (
          (1 & e &&
            (p(0, "tr")(1, "td", 20)(2, "a", 21),
            A(3, "img", 22),
            m()(),
            p(4, "td")(5, "div", 23)(6, "a", 24)(7, "strong"),
            N(8),
            m()()(),
            p(9, "div", 25)(10, "div", 4)(11, "div", 26)(12, "span"),
            A(13, "i", 27),
            N(14),
            m(),
            p(15, "span", 28),
            A(16, "i", 29),
            N(17),
            m()(),
            p(18, "div", 26),
            C(19, fj, 3, 6, "ng-container", 19),
            C(20, _j, 4, 4, "ng-container", 19),
            p(21, "span"),
            N(22),
            m()()(),
            p(23, "div", 30),
            C(24, vj, 4, 0, "button", 31),
            C(25, yj, 4, 0, "button", 32),
            m()()()()),
          2 & e)
        ) {
          const t = n.$implicit,
            r = M(2);
          g(2),
            v("routerLink", Ut(12, Os, t.bggGameId)),
            g(1),
            Ur("src", t.image, li),
            g(3),
            v("routerLink", Ut(14, Os, t.bggGameId)),
            g(2),
            Ue(t.name),
            g(6),
            $r(" ", t.minPlayers, "-", t.maxPlayers, ""),
            g(3),
            Je(" ", t.playtime, "m"),
            g(2),
            v("ngIf", !t.rating),
            g(1),
            v("ngIf", t.rating),
            g(2),
            Je(" - released ", t.year, ""),
            g(2),
            v("ngIf", !r.isGameInShelf(t)),
            g(1),
            v("ngIf", r.isGameInShelf(t));
        }
      }
      function Dj(e, n) {
        if (
          (1 & e && (p(0, "tbody"), C(1, bj, 26, 16, "tr", 16), m()), 2 & e)
        ) {
          const t = M();
          g(1), v("ngForOf", t.trendingGames);
        }
      }
      function Cj(e, n) {
        1 & e && (p(0, "tr"), A(1, "td", 41)(2, "td", 41), m());
      }
      function wj(e, n) {
        1 & e && (p(0, "tbody"), C(1, Cj, 3, 0, "tr", 16), m()),
          2 & e && (g(1), v("ngForOf", xe(1, Si).constructor(10)));
      }
      function Ej(e, n) {
        1 & e && (re(0), A(1, "i", 33), ie());
      }
      function Sj(e, n) {
        1 & e &&
          (re(0), C(1, Ej, 2, 0, "ng-container", 16), tr(2, "slice"), ie()),
          2 & e && (g(1), v("ngForOf", di(2, 1, xe(5, mm), 0, 5)));
      }
      function Mj(e, n) {
        1 & e && (re(0), A(1, "i", 34), ie());
      }
      function Tj(e, n) {
        1 & e && (re(0), A(1, "i", 35), ie());
      }
      function Nj(e, n) {
        1 & e && (re(0), A(1, "i", 33), ie());
      }
      function Ij(e, n) {
        if (
          (1 & e && (re(0), C(1, Nj, 2, 0, "ng-container", 16), ie()), 2 & e)
        ) {
          const t = M(2).$implicit,
            r = M(2);
          g(1),
            v(
              "ngForOf",
              xe(1, Si).constructor(
                r.Math.floor(5 - r.Math.round(2 * t.rating) / 2)
              )
            );
        }
      }
      function Oj(e, n) {
        if (
          (1 & e &&
            (re(0),
            C(1, Mj, 2, 0, "ng-container", 16),
            C(2, Tj, 2, 0, "ng-container", 19),
            C(3, Ij, 2, 2, "ng-container", 19),
            ie()),
          2 & e)
        ) {
          const t = M().$implicit,
            r = M(2);
          g(1),
            v("ngForOf", xe(3, Si).constructor(r.Math.floor(t.rating))),
            g(1),
            v("ngIf", t.rating - r.Math.floor(t.rating) == 0.5),
            g(1),
            v("ngIf", 5 != r.Math.ceil(t.rating));
        }
      }
      function Aj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 36),
            P("click", function () {
              K(t);
              const i = M().$implicit;
              return Y(M(2).addGameToShelf(i));
            }),
            A(1, "i", 37),
            p(2, "span"),
            N(3, "Add to Game Shelf"),
            m()();
        }
      }
      function Rj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 38),
            P("click", function () {
              K(t);
              const i = M().$implicit;
              return Y(M(2).removeFromShelf(i.bggGameId));
            }),
            A(1, "i", 39),
            p(2, "span"),
            N(3, "Remove from Shelf"),
            m()();
        }
      }
      function xj(e, n) {
        if (
          (1 & e &&
            (p(0, "tr")(1, "td", 20)(2, "a", 21),
            A(3, "img", 22),
            m()(),
            p(4, "td")(5, "div", 23)(6, "a", 24)(7, "strong"),
            N(8),
            m()()(),
            p(9, "div", 25)(10, "div", 4)(11, "div", 26)(12, "span"),
            A(13, "i", 27),
            N(14),
            m(),
            p(15, "span", 28),
            A(16, "i", 29),
            N(17),
            m()(),
            p(18, "div", 26),
            C(19, Sj, 3, 6, "ng-container", 19),
            C(20, Oj, 4, 4, "ng-container", 19),
            p(21, "span"),
            N(22),
            m()()(),
            p(23, "div", 30),
            C(24, Aj, 4, 0, "button", 31),
            C(25, Rj, 4, 0, "button", 32),
            m()()()()),
          2 & e)
        ) {
          const t = n.$implicit,
            r = M(2);
          g(2),
            v("routerLink", Ut(12, Os, t.bggGameId)),
            g(1),
            Ur("src", t.image, li),
            g(3),
            v("routerLink", Ut(14, Os, t.bggGameId)),
            g(2),
            Ue(t.name),
            g(6),
            $r(" ", t.minPlayers, "-", t.maxPlayers, ""),
            g(3),
            Je(" ", t.playtime, "m"),
            g(2),
            v("ngIf", !t.rating),
            g(1),
            v("ngIf", t.rating),
            g(2),
            Je(" - released ", t.year, ""),
            g(2),
            v("ngIf", !r.isGameInShelf(t)),
            g(1),
            v("ngIf", r.isGameInShelf(t));
        }
      }
      function Pj(e, n) {
        if (
          (1 & e && (p(0, "tbody"), C(1, xj, 26, 16, "tr", 16), m()), 2 & e)
        ) {
          const t = M();
          g(1), v("ngForOf", t.randomGames);
        }
      }
      let kj = (() => {
          var e;
          class n {
            constructor(r, i) {
              (this.gameApi = r),
                (this.gameShelfApi = i),
                (this.searchGames = null),
                (this.currentSearchCount = 0),
                (this.maxSearchCount = 0),
                (this.searched = !1),
                (this.Math = window.Math);
            }
            ngOnInit() {
              this.getGameShelf(), this.trending(), this.random();
            }
            getGameShelf() {
              this.gameShelfApi.getGameShelf().subscribe((r) => {
                r.owner && (this.gameShelf = r);
              });
            }
            trending() {
              this.gameApi.orderBy("rank").subscribe((r) => {
                this.trendingGames = r;
              });
            }
            random() {
              this.gameApi.orderBy("random").subscribe((r) => {
                this.randomGames = r;
              });
            }
            search() {
              this.value &&
                "" != this.value.trim() &&
                (this.gameApi.search(this.value).subscribe((r) => {
                  (this.searchGames = r.games),
                    (this.currentSearchCount = 1),
                    (this.maxSearchCount = r.count);
                }),
                (this.searched = !0));
            }
            clearSearch() {
              (this.searchGames = null),
                (this.value = ""),
                (this.searched = !1);
            }
            addGameToShelf(r) {
              this.gameShelfApi.addGameToShelf(r).subscribe((i) => {
                i &&
                  this.gameShelf &&
                  -1 != i.games.findIndex((o) => o.bggGameId == r.bggGameId) &&
                  this.gameShelf.games.push(r);
              });
            }
            isGameInShelf(r) {
              return !(
                !this.gameShelf ||
                -1 ==
                  this.gameShelf.games.findIndex(
                    (i) => i.bggGameId == r.bggGameId
                  )
              );
            }
            removeFromShelf(r) {
              this.gameShelfApi.removeGameFromShelf(r).subscribe((i) => {
                i &&
                  this.gameShelf &&
                  (this.gameShelf.games = this.gameShelf?.games.filter(
                    (o) => o.bggGameId !== r
                  ));
              });
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(_(PS), _(gm));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["app-discover"]],
              inputs: { value: "value" },
              decls: 48,
              vars: 17,
              consts: [
                [1, "background"],
                [1, "container", "my-5"],
                [1, "row", "my-3", "justify-content-center"],
                [
                  "id",
                  "search-container",
                  1,
                  "row",
                  "w-75",
                  "justify-content-between",
                ],
                [1, "col"],
                [
                  "type",
                  "text",
                  "id",
                  "search",
                  "placeholder",
                  "Enter name here... (Ex. Catan, Uno, Betrayal, etc.)",
                  1,
                  "form-control",
                  "w-100",
                  3,
                  "ngModel",
                  "ngModelChange",
                  "keyup.enter",
                ],
                [1, "col", "search-button"],
                ["type", "submit", 1, "btn", "btn-primary", 3, "click"],
                [1, "fa", "fa-search"],
                [1, "row", "gap-5"],
                [1, "col", 3, "hidden"],
                [1, "row", "my-3"],
                [1, "d-flex", "mb-2"],
                [1, "btn", "btn-secondary", "mx-4", 3, "click"],
                [1, "fa", "fa-arrow-left"],
                [1, "game-list", "table", "table-striped"],
                [4, "ngFor", "ngForOf"],
                [1, "d-flex", "justify-content-end", "gap-2"],
                ["class", "btn btn-outline-primary", 3, "click", 4, "ngIf"],
                [4, "ngIf"],
                [1, "thumbnail-cell"],
                [3, "routerLink"],
                ["alt", "Game Image", 1, "thumbnail", 3, "src"],
                [1, "game-name"],
                [1, "text-dark", "text-decoration-none", 3, "routerLink"],
                [1, "row"],
                [1, "game-info"],
                [1, "fa", "fa-users"],
                [1, "mx-2"],
                [1, "fa", "fa-clock-o"],
                [1, "col", "text-end", "button-container"],
                ["class", "btn btn-success mx-3", 3, "click", 4, "ngIf"],
                ["class", "btn btn-danger mx-3", 3, "click", 4, "ngIf"],
                [1, "fa", "fa-star-o"],
                [1, "fa", "fa-star"],
                [1, "fa", "fa-star-half-o"],
                [1, "btn", "btn-success", "mx-3", 3, "click"],
                [1, "fa", "fa-plus"],
                [1, "btn", "btn-danger", "mx-3", 3, "click"],
                [1, "fa", "fa-minus"],
                [1, "btn", "btn-outline-primary", 3, "click"],
                [1, "fill-cell"],
              ],
              template: function (r, i) {
                1 & r &&
                  (p(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                    4,
                    "div",
                    4
                  )(5, "input", 5),
                  P("ngModelChange", function (s) {
                    return (i.value = s);
                  })("keyup.enter", function () {
                    return i.search();
                  }),
                  m()(),
                  p(6, "div", 6)(7, "button", 7),
                  P("click", function () {
                    return i.search();
                  }),
                  A(8, "i", 8),
                  N(9, " Search "),
                  m()()()(),
                  p(10, "div", 9)(11, "div", 10)(12, "div", 11)(13, "div", 12)(
                    14,
                    "h2"
                  ),
                  N(15, "Search Results"),
                  m(),
                  p(16, "button", 13),
                  P("click", function () {
                    return i.clearSearch();
                  }),
                  A(17, "i", 14),
                  N(18, " Back to Discover"),
                  m()(),
                  A(19, "hr"),
                  p(20, "table", 15)(21, "tbody"),
                  C(22, sj, 26, 16, "tr", 16),
                  tr(23, "slice"),
                  m()(),
                  p(24, "div", 17)(25, "div")(26, "span"),
                  N(27),
                  m()(),
                  p(28, "div", 6),
                  C(29, aj, 2, 0, "button", 18),
                  m(),
                  p(30, "div", 6),
                  C(31, lj, 2, 0, "button", 18),
                  m()()()(),
                  p(32, "div", 10)(33, "div", 11)(34, "h2"),
                  N(35, "Top 10 trending Games"),
                  m(),
                  A(36, "hr"),
                  p(37, "table", 15),
                  C(38, uj, 2, 2, "tbody", 19),
                  C(39, Dj, 2, 1, "tbody", 19),
                  m()()(),
                  p(40, "div", 10)(41, "div", 11)(42, "h2"),
                  N(43, "Top 10 random Games"),
                  m(),
                  A(44, "hr"),
                  p(45, "table", 15),
                  C(46, wj, 2, 2, "tbody", 19),
                  C(47, Pj, 2, 1, "tbody", 19),
                  m()()()()()()),
                  2 & r &&
                    (g(5),
                    v("ngModel", i.value),
                    g(6),
                    v("hidden", !i.searched),
                    g(11),
                    v(
                      "ngForOf",
                      di(
                        23,
                        13,
                        i.searchGames,
                        i.currentSearchCount - 1,
                        i.currentSearchCount - 1 + 10
                      )
                    ),
                    g(5),
                    $r(
                      "Page 1-",
                      i.Math.ceil(i.maxSearchCount / 10),
                      " (",
                      i.maxSearchCount,
                      " results)"
                    ),
                    g(2),
                    v("ngIf", i.currentSearchCount > 1),
                    g(2),
                    v(
                      "ngIf",
                      i.maxSearchCount > 10 &&
                        i.maxSearchCount - 10 > i.currentSearchCount
                    ),
                    g(1),
                    v("hidden", i.searched),
                    g(6),
                    v("ngIf", !i.trendingGames),
                    g(1),
                    v("ngIf", i.trendingGames),
                    g(1),
                    v("hidden", i.searched),
                    g(6),
                    v("ngIf", !i.randomGames),
                    g(1),
                    v("ngIf", i.randomGames));
              },
              dependencies: [Zt, kt, lr, Dr, _i, Kr, lu],
              styles: [
                "#search-container[_ngcontent-%COMP%]{min-width:320px}.fill-cell[_ngcontent-%COMP%]{height:96.44px}.button-container[_ngcontent-%COMP%]{width:-moz-fit-content!important;width:fit-content!important;flex:unset!important}.game-list[_ngcontent-%COMP%]{min-width:300px}.thumbnail[_ngcontent-%COMP%]{height:80px;max-width:80px;float:right}.thumbnail-cell[_ngcontent-%COMP%]{width:70px}.game-info[_ngcontent-%COMP%]{font-size:.8rem}.game-name[_ngcontent-%COMP%]{text-overflow:ellipsis;text-decoration:none!important}.search-button[_ngcontent-%COMP%]{flex:unset!important;width:-moz-fit-content;width:fit-content}button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{max-width:0;transition:max-width 1s;display:inline-block;vertical-align:top;white-space:nowrap;overflow:hidden}button[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%]{margin-left:6px;max-width:9rem}tr[_ngcontent-%COMP%]:first-child   td[_ngcontent-%COMP%]:first-child{border-top-left-radius:10px}tr[_ngcontent-%COMP%]:first-child   td[_ngcontent-%COMP%]:last-child{border-top-right-radius:10px}tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%]:first-child{border-bottom-left-radius:10px;border-style:none}tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%]:last-child{border-bottom-right-radius:10px;border-style:none}@media (max-width: 620px){button[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%]{display:none!important}}",
              ],
            })),
            n
          );
        })(),
        As = (() => {
          var e;
          class n {
            constructor(r, i) {
              (this.authService = r), (this.router = i);
            }
            canActivate() {
              let r = this.authService.isAuthenticated();
              return (
                r ||
                  (this.authService.logout(), this.router.navigate(["/login"])),
                r
              );
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(L(Qr), L(et));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        Fj = (() => {
          var e;
          class n {
            constructor(r, i) {
              (this.authService = r), (this.router = i);
            }
            canActivate() {
              let r = !this.authService.isAuthenticated();
              return (
                r
                  ? this.authService.logout()
                  : this.router.navigate(["/discover"]),
                r
              );
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(L(Qr), L(et));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            n
          );
        })();
      function Lj(e, n) {
        1 & e && (p(0, "div"), N(1, "No games added yet."), m());
      }
      function Bj(e, n) {
        1 & e && (re(0), A(1, "i", 21), ie());
      }
      const Vj = function () {
        return [1, 2, 3, 4, 5];
      };
      function Hj(e, n) {
        1 & e &&
          (re(0), C(1, Bj, 2, 0, "ng-container", 6), tr(2, "slice"), ie()),
          2 & e && (g(1), v("ngForOf", di(2, 1, xe(5, Vj), 0, 5)));
      }
      function Uj(e, n) {
        1 & e && (re(0), A(1, "i", 22), ie());
      }
      function $j(e, n) {
        1 & e && (re(0), A(1, "i", 23), ie());
      }
      function Gj(e, n) {
        1 & e && (re(0), A(1, "i", 21), ie());
      }
      const kS = function () {
        return [];
      };
      function jj(e, n) {
        if (
          (1 & e && (re(0), C(1, Gj, 2, 0, "ng-container", 6), ie()), 2 & e)
        ) {
          const t = M(2).$implicit,
            r = M();
          g(1),
            v(
              "ngForOf",
              xe(1, kS).constructor(
                r.Math.floor(5 - r.Math.round(2 * t.rating) / 2)
              )
            );
        }
      }
      function zj(e, n) {
        if (
          (1 & e &&
            (re(0),
            C(1, Uj, 2, 0, "ng-container", 6),
            C(2, $j, 2, 0, "ng-container", 4),
            C(3, jj, 2, 2, "ng-container", 4),
            ie()),
          2 & e)
        ) {
          const t = M().$implicit,
            r = M();
          g(1),
            v("ngForOf", xe(3, kS).constructor(r.Math.floor(t.rating))),
            g(1),
            v("ngIf", t.rating - r.Math.floor(t.rating) == 0.5),
            g(1),
            v("ngIf", 5 != r.Math.ceil(t.rating));
        }
      }
      const FS = function (e) {
        return ["/games", e];
      };
      function Wj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "tr")(1, "td", 8)(2, "a", 9),
            A(3, "img", 10),
            m()(),
            p(4, "td")(5, "div", 11)(6, "a", 12)(7, "strong"),
            N(8),
            m()()(),
            p(9, "div", 13)(10, "div", 2)(11, "div", 14)(12, "span"),
            A(13, "i", 15),
            N(14),
            m(),
            p(15, "span", 16),
            A(16, "i", 17),
            N(17),
            m()(),
            p(18, "div", 14),
            C(19, Hj, 3, 6, "ng-container", 4),
            C(20, zj, 4, 4, "ng-container", 4),
            p(21, "span"),
            N(22),
            m()()(),
            p(23, "div", 18)(24, "button", 19),
            P("click", function () {
              const o = K(t).$implicit;
              return Y(M().removeFromShelf(o.bggGameId));
            }),
            A(25, "i", 20),
            p(26, "span"),
            N(27, "Remove from Shelf"),
            m()()()()()();
        }
        if (2 & e) {
          const t = n.$implicit;
          g(2),
            v("routerLink", Ut(10, FS, t.bggGameId)),
            g(1),
            Ur("src", t.image, li),
            g(3),
            v("routerLink", Ut(12, FS, t.bggGameId)),
            g(2),
            Ue(t.name),
            g(6),
            $r(" ", t.minPlayers, "-", t.maxPlayers, ""),
            g(3),
            Je(" ", t.playtime, "m"),
            g(2),
            v("ngIf", !t.rating),
            g(1),
            v("ngIf", t.rating),
            g(2),
            Je(" - released ", t.year, "");
        }
      }
      function qj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 27),
            P("click", function () {
              K(t);
              const i = M(2);
              return Y((i.currentGameCount = i.currentGameCount - 10));
            }),
            N(1, "\u2190"),
            m();
        }
      }
      function Kj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 27),
            P("click", function () {
              K(t);
              const i = M(2);
              return Y((i.currentGameCount = i.currentGameCount + 10));
            }),
            N(1, "\u2192"),
            m();
        }
      }
      function Yj(e, n) {
        if (
          (1 & e &&
            (p(0, "div", 24)(1, "div")(2, "span"),
            N(3),
            m()(),
            p(4, "div", 25),
            C(5, qj, 2, 0, "button", 26),
            m(),
            p(6, "div", 25),
            C(7, Kj, 2, 0, "button", 26),
            m()()),
          2 & e)
        ) {
          const t = M();
          g(3),
            $r(
              "Page 1-",
              t.Math.ceil(t.maxGameCount / 10),
              " (",
              t.maxGameCount,
              " results)"
            ),
            g(2),
            v("ngIf", t.currentGameCount > 1),
            g(2),
            v(
              "ngIf",
              t.maxGameCount > 10 && t.maxGameCount - 10 > t.currentGameCount
            );
        }
      }
      let Jj = (() => {
          var e;
          class n {
            constructor(r) {
              (this.gameShelfApi = r),
                (this.Math = window.Math),
                (this.currentGameCount = 0),
                (this.maxGameCount = 0);
            }
            ngOnInit() {
              this.getGameShelf();
            }
            getGameShelf() {
              this.gameShelfApi.getGameShelf().subscribe((r) => {
                r.owner &&
                  ((this.gameShelf = r),
                  this.gameShelf.games.length > 0 &&
                    ((this.currentGameCount = 1),
                    (this.maxGameCount = this.gameShelf.games.length)));
              });
            }
            removeFromShelf(r) {
              this.gameShelfApi.removeGameFromShelf(r).subscribe((i) => {
                i &&
                  this.gameShelf &&
                  (this.gameShelf.games = this.gameShelf?.games.filter(
                    (o) => o.bggGameId !== r
                  ));
              });
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(_(gm));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["app-gameshelf"]],
              decls: 14,
              vars: 7,
              consts: [
                [1, "background"],
                [1, "container", "my-5"],
                [1, "col"],
                [1, "row", "my-3"],
                [4, "ngIf"],
                [1, "table", "table-striped"],
                [4, "ngFor", "ngForOf"],
                ["class", "d-flex justify-content-end gap-2", 4, "ngIf"],
                [1, "thumbnail-cell"],
                [3, "routerLink"],
                ["alt", "Game Image", 1, "thumbnail", 3, "src"],
                [1, "game-name"],
                [1, "text-dark", "text-decoration-none", 3, "routerLink"],
                [1, "row"],
                [1, "game-info"],
                [1, "fa", "fa-users"],
                [1, "mx-2"],
                [1, "fa", "fa-clock-o"],
                [1, "col", "text-end"],
                [1, "btn", "btn-danger", "mx-3", 3, "click"],
                [1, "fa", "fa-minus"],
                [1, "fa", "fa-star-o"],
                [1, "fa", "fa-star"],
                [1, "fa", "fa-star-half-o"],
                [1, "d-flex", "justify-content-end", "gap-2"],
                [1, "col", "game-button"],
                ["class", "btn btn-outline-primary", 3, "click", 4, "ngIf"],
                [1, "btn", "btn-outline-primary", 3, "click"],
              ],
              template: function (r, i) {
                1 & r &&
                  (p(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                    4,
                    "h2"
                  ),
                  N(5, "My Game Shelf"),
                  m(),
                  A(6, "hr"),
                  C(7, Lj, 2, 0, "div", 4),
                  A(8, "div"),
                  p(9, "table", 5)(10, "tbody"),
                  C(11, Wj, 28, 14, "tr", 6),
                  tr(12, "slice"),
                  m()(),
                  C(13, Yj, 8, 4, "div", 7),
                  m()()()()),
                  2 & r &&
                    (g(7),
                    v(
                      "ngIf",
                      0 ==
                        (null == i.gameShelf || null == i.gameShelf.games
                          ? null
                          : i.gameShelf.games.length)
                    ),
                    g(4),
                    v(
                      "ngForOf",
                      di(
                        12,
                        3,
                        null == i.gameShelf ? null : i.gameShelf.games,
                        i.currentGameCount - 1,
                        i.currentGameCount - 1 + 10
                      )
                    ),
                    g(2),
                    v(
                      "ngIf",
                      0 !=
                        (null == i.gameShelf || null == i.gameShelf.games
                          ? null
                          : i.gameShelf.games.length)
                    ));
              },
              dependencies: [Zt, kt, lr, lu],
              styles: [
                ".thumbnail[_ngcontent-%COMP%]{height:80px;max-width:80px;float:right}.thumbnail-cell[_ngcontent-%COMP%]{width:70px}.game-info[_ngcontent-%COMP%]{font-size:.8rem}.game-name[_ngcontent-%COMP%]{text-overflow:ellipsis}.game-button[_ngcontent-%COMP%]{flex:unset!important;width:-moz-fit-content;width:fit-content}button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{max-width:0;transition:max-width 1s;display:inline-block;vertical-align:top;white-space:nowrap;overflow:hidden}button[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%]{margin-left:6px;max-width:9rem}tr[_ngcontent-%COMP%]:first-child   td[_ngcontent-%COMP%]:first-child{border-top-left-radius:10px}tr[_ngcontent-%COMP%]:first-child   td[_ngcontent-%COMP%]:last-child{border-top-right-radius:10px}tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%]:first-child{border-bottom-left-radius:10px;border-style:none}tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%]:last-child{border-bottom-right-radius:10px;border-style:none}@media (max-width: 620px){button[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%]{display:none!important}}",
              ],
            })),
            n
          );
        })(),
        _m = (() => {
          var e;
          class n {
            constructor(r) {
              (this.http = r), (this.URL = Tl.API_VERSION);
            }
            getGameLogsForGame(r) {
              return this.http.get(this.URL + `/gamelogs?bggGameId=${r}`);
            }
            getGameLog(r) {
              return this.http.get(this.URL + `/gamelogs/${r}`);
            }
            getGameLogs() {
              return this.http.get(this.URL + "/gamelogs");
            }
            updateGameLog(r) {
              return this.http.put(this.URL + `/gamelogs/${r._id}`, {
                gameLog: r,
              });
            }
            createGameLog(r, i, o, s, a) {
              return this.http.post(this.URL + "/gamelogs", {
                bggGameId: r,
                bgaGameName: i,
                date: o,
                note: s,
                rating: a,
              });
            }
            deleteGameLog(r) {
              return this.http.delete(this.URL + `/gamelogs/${r._id}`);
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(L(ys));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            n
          );
        })();
      var Rs;
      function Zj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 27),
            P("click", function () {
              K(t);
              const i = M();
              return Y(i.addGameToShelf(i.game));
            }),
            A(1, "i", 12),
            p(2, "span"),
            N(3, " Add to Game Shelf"),
            m()();
        }
      }
      function Qj(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "button", 28),
            P("click", function () {
              K(t);
              const i = M();
              return Y(i.removeFromShelf(i.game.bggGameId));
            }),
            A(1, "i", 29),
            p(2, "span"),
            N(3, " Remove from Shelf"),
            m()();
        }
      }
      function Xj(e, n) {
        1 & e && (re(0), A(1, "i", 38), ie());
      }
      function e4(e, n) {
        1 & e && (re(0), A(1, "i", 39), ie());
      }
      const Nl = function () {
        return [];
      };
      function t4(e, n) {
        if (
          (1 & e && (re(0), C(1, e4, 2, 0, "ng-container", 35), ie()), 2 & e)
        ) {
          const t = M(2).$implicit;
          g(1), v("ngForOf", xe(1, Nl).constructor(5 - t.rating));
        }
      }
      function n4(e, n) {
        if (
          (1 & e &&
            (p(0, "td"),
            C(1, Xj, 2, 0, "ng-container", 35),
            C(2, t4, 2, 2, "ng-container", 17),
            m()),
          2 & e)
        ) {
          const t = M().$implicit;
          g(1),
            v("ngForOf", xe(2, Nl).constructor(t.rating)),
            g(1),
            v("ngIf", 5 != t.rating);
        }
      }
      function r4(e, n) {
        1 & e && (re(0), A(1, "i", 40), ie());
      }
      function i4(e, n) {
        1 & e && (p(0, "td"), C(1, r4, 2, 0, "ng-container", 35), m()),
          2 & e && (g(1), v("ngForOf", xe(1, Nl).constructor(5)));
      }
      const o4 = function (e) {
        return ["/gamelogs", e];
      };
      function s4(e, n) {
        if (
          (1 & e &&
            (p(0, "tr")(1, "td")(2, "a", 36),
            A(3, "i", 37),
            m()(),
            p(4, "td")(5, "span"),
            N(6),
            tr(7, "date"),
            m()(),
            C(8, n4, 3, 3, "td", 17),
            C(9, i4, 2, 2, "td", 17),
            m()),
          2 & e)
        ) {
          const t = n.$implicit;
          g(2),
            v("routerLink", Ut(7, o4, t._id)),
            g(4),
            Ue(Lh(7, 4, t.date, "EEE MMM d y")),
            g(2),
            v("ngIf", t.rating),
            g(1),
            v("ngIf", !t.rating);
        }
      }
      function a4(e, n) {
        if (
          (1 & e &&
            (p(0, "div", 30)(1, "div", 14)(2, "div", 31)(3, "h2"),
            N(4, "My Game History"),
            m(),
            A(5, "hr", 32),
            m(),
            p(6, "div", 33)(7, "table", 34)(8, "tbody"),
            C(9, s4, 10, 9, "tr", 35),
            m()()()()()),
          2 & e)
        ) {
          const t = M();
          g(9), v("ngForOf", t.gameLogs);
        }
      }
      function l4(e, n) {
        1 & e && (re(0), A(1, "i", 41), ie());
      }
      const c4 = function () {
        return [1, 2, 3, 4, 5];
      };
      function u4(e, n) {
        1 & e &&
          (re(0), C(1, l4, 2, 0, "ng-container", 35), tr(2, "slice"), ie()),
          2 & e && (g(1), v("ngForOf", di(2, 1, xe(5, c4), 0, 5)));
      }
      function d4(e, n) {
        1 & e && (re(0), A(1, "i", 42), ie());
      }
      function f4(e, n) {
        1 & e && (re(0), A(1, "i", 43), ie());
      }
      function h4(e, n) {
        1 & e && (re(0), A(1, "i", 41), ie());
      }
      function p4(e, n) {
        if (
          (1 & e && (re(0), C(1, h4, 2, 0, "ng-container", 35), ie()), 2 & e)
        ) {
          const t = M(2);
          g(1),
            v(
              "ngForOf",
              xe(1, Nl).constructor(
                t.Math.floor(5 - t.Math.round(2 * t.game.rating) / 2)
              )
            );
        }
      }
      function g4(e, n) {
        if (
          (1 & e &&
            (re(0),
            C(1, d4, 2, 0, "ng-container", 35),
            C(2, f4, 2, 0, "ng-container", 17),
            C(3, p4, 2, 2, "ng-container", 17),
            ie()),
          2 & e)
        ) {
          const t = M();
          g(1),
            v("ngForOf", xe(3, Nl).constructor(t.Math.floor(t.game.rating))),
            g(1),
            v("ngIf", t.game.rating - t.Math.floor(t.game.rating) == 0.5),
            g(1),
            v("ngIf", 5 != t.Math.ceil(t.game.rating));
        }
      }
      class vd {
        constructor(n, t, r, i, o) {
          (this.router = n),
            (this.route = t),
            (this.gameApi = r),
            (this.gameShelfApi = i),
            (this.gameLogApi = o),
            (this.game = Object.assign({}, vd.EMPTY_Game)),
            (this.gameId = ""),
            (this.Math = window.Math),
            (this.inShelf = !1);
        }
        ngOnInit() {
          this.route.params.subscribe((n) => {
            (this.gameId = n.gid),
              this.gameApi.getOne(this.gameId).subscribe((t) => {
                (t.description = this.ensureHTMLTags(t.description)),
                  (this.game = t),
                  this.getGameShelf(),
                  this.getGameLogs();
              });
          });
        }
        getGameShelf() {
          this.gameShelfApi.getGameShelf().subscribe((n) => {
            n.owner &&
              ((this.gameShelf = n),
              (this.inShelf = this.isGameInShelf(this.game)));
          });
        }
        isGameInShelf(n) {
          return !(
            !this.gameShelf ||
            -1 ==
              this.gameShelf.games.findIndex((t) => t.bggGameId == n.bggGameId)
          );
        }
        addGameToShelf(n) {
          this.gameShelfApi.addGameToShelf(n).subscribe((t) => {
            t &&
              this.gameShelf &&
              -1 != t.games.findIndex((r) => r.bggGameId == n.bggGameId) &&
              (this.gameShelf.games.push(n), (this.inShelf = !0));
          });
        }
        removeFromShelf(n) {
          this.gameShelfApi.removeGameFromShelf(n).subscribe((t) => {
            t &&
              this.gameShelf &&
              ((this.gameShelf.games = this.gameShelf?.games.filter(
                (r) => r.bggGameId !== n
              )),
              (this.inShelf = !1));
          });
        }
        ensureHTMLTags(n) {
          return n && ((n = "<div>" + n), (n += "</div>")), n;
        }
        createGameLog() {
          this.gameLogApi
            .createGameLog(
              this.game.bggGameId,
              this.game.name || "-",
              new Date(Date.now()).toDateString(),
              void 0,
              void 0
            )
            .subscribe((n) => this.router.navigate(["/gamelogs", n._id]));
        }
        getGameLogs() {
          this.gameLogApi.getGameLogsForGame(this.gameId).subscribe((n) => {
            this.gameLogs = n;
          });
        }
      }
      ((Rs = vd).EMPTY_Game = {
        bggGameId: "",
        name: void 0,
        rating: void 0,
        image: void 0,
        thumbnail: void 0,
        minPlayers: void 0,
        maxPlayers: void 0,
        year: void 0,
        playtime: void 0,
        plays: void 0,
        rank: void 0,
        randomRank: void 0,
        description: void 0,
        minAge: void 0,
        rules: void 0,
        publisher: void 0,
      }),
        (Rs.ɵfac = function (n) {
          return new (n || Rs)(_(et), _(Nr), _(PS), _(gm), _(_m));
        }),
        (Rs.ɵcmp = Oe({
          type: Rs,
          selectors: [["app-game"]],
          decls: 48,
          vars: 24,
          consts: [
            [1, "background"],
            [1, "container", "my-5"],
            ["id", "display", 1, "row", "my-3"],
            [1, "col", "flex-unset", "w-fit-content"],
            [1, "d-flex", "flex-column", "gap-2"],
            [1, "bg-white", "rounded-3", "mb-3"],
            ["alt", "Game Image", 1, "thumbnail", "rounded-3", 3, "src"],
            ["class", "btn btn-success mx-3", 3, "click", 4, "ngIf"],
            ["class", "btn btn-danger mx-3", 3, "click", 4, "ngIf"],
            [
              "target",
              "_blank",
              1,
              "btn",
              "btn-outline-secondary",
              "mx-3",
              3,
              "href",
              "hidden",
            ],
            [1, "fa", "fa-book"],
            [1, "btn", "btn-primary", "mx-3", 3, "click"],
            [1, "fa", "fa-plus"],
            ["class", "row mt-5 mb-2", 4, "ngIf"],
            [1, "col"],
            [1, "row", "my-2"],
            [1, "text-goldenrod"],
            [4, "ngIf"],
            ["id", "description", 1, "row", "my-2", 3, "innerHTML"],
            ["id", "info", 1, "my-2"],
            [3, "hidden"],
            [1, "fa", "fa-users"],
            [1, "fa", "fa-user"],
            [1, "fa", "fa-clock-o"],
            [1, "fa", "fa-calendar"],
            [1, "fa", "fa-trophy", "text-goldenrod"],
            [1, "bi-fire", "text-burnt"],
            [1, "btn", "btn-success", "mx-3", 3, "click"],
            [1, "btn", "btn-danger", "mx-3", 3, "click"],
            [1, "fa", "fa-minus"],
            [1, "row", "mt-5", "mb-2"],
            [1, "row", "justify-content-center", "text-center"],
            [1, "w-75"],
            [1, "row", "justify-content-center"],
            [1, "table", "table-striped", "w-fit-content"],
            [4, "ngFor", "ngForOf"],
            [1, "btn", "btn-xs", "btn-outline-secondary", 3, "routerLink"],
            [1, "fa", "fa-eye"],
            [1, "bi-heart-fill", "text-danger", "heart-icon"],
            [1, "bi-heart", "text-danger", "heart-icon"],
            [1, "bi-heart", "text-secondary", "heart-icon"],
            [1, "fa", "fa-2x", "fa-star-o"],
            [1, "fa", "fa-2x", "fa-star"],
            [1, "fa", "fa-2x", "fa-star-half-o"],
          ],
          template: function (n, t) {
            1 & n &&
              (p(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                4,
                "div",
                4
              )(5, "div", 5),
              A(6, "img", 6),
              m(),
              C(7, Zj, 4, 0, "button", 7),
              C(8, Qj, 4, 0, "button", 8),
              p(9, "a", 9),
              A(10, "i", 10),
              N(11, " Read Rules"),
              m(),
              p(12, "button", 11),
              P("click", function () {
                return t.createGameLog();
              }),
              A(13, "i", 12),
              p(14, "span"),
              N(15, " Add Game Log"),
              m()(),
              C(16, a4, 10, 1, "div", 13),
              m()(),
              p(17, "div", 14)(18, "div", 15)(19, "h1"),
              N(20),
              m(),
              p(21, "h2"),
              N(22),
              m()(),
              p(23, "div", 15)(24, "div", 16),
              C(25, u4, 3, 6, "ng-container", 17),
              C(26, g4, 4, 4, "ng-container", 17),
              m()(),
              A(27, "div", 18)(28, "hr"),
              p(29, "div", 19)(30, "span", 20),
              A(31, "i", 21),
              N(32),
              m(),
              p(33, "span", 20),
              A(34, "i", 22),
              N(35),
              m(),
              p(36, "span", 20),
              A(37, "i", 23),
              N(38),
              m(),
              p(39, "span", 20),
              A(40, "i", 24),
              N(41),
              m(),
              p(42, "span", 20),
              A(43, "i", 25),
              N(44),
              m(),
              p(45, "span", 20),
              A(46, "i", 26),
              N(47),
              m()()()()()()),
              2 & n &&
                (g(6),
                Ur("src", t.game.thumbnail, li),
                g(1),
                v("ngIf", !t.inShelf),
                g(1),
                v("ngIf", t.inShelf),
                g(1),
                Ur("href", t.game.rules, li),
                v("hidden", !t.game.rules),
                g(7),
                v(
                  "ngIf",
                  0 !== (null == t.gameLogs ? null : t.gameLogs.length)
                ),
                g(4),
                Ue(t.game.name),
                g(2),
                Ue(t.game.publisher),
                g(3),
                v("ngIf", !t.game.rating),
                g(1),
                v("ngIf", t.game.rating),
                g(1),
                v("innerHTML", t.game.description, Pv),
                g(3),
                v("hidden", !t.game.minPlayers || !t.game.maxPlayers),
                g(2),
                $r(" ", t.game.minPlayers, "-", t.game.maxPlayers, ""),
                g(1),
                v("hidden", !t.game.minAge),
                g(2),
                Je(" Ages ", t.game.minAge, "+"),
                g(1),
                v("hidden", !t.game.playtime),
                g(2),
                Je(" ", t.game.playtime, "m"),
                g(1),
                v("hidden", !t.game.year),
                g(2),
                Je(" ", t.game.year, ""),
                g(1),
                v("hidden", 9999999 == t.game.rank),
                g(2),
                Je(" ", t.game.rank, ""),
                g(1),
                v("hidden", 0 == t.game.randomRank),
                g(2),
                Je(" ", t.game.randomRank, ""));
          },
          dependencies: [Zt, kt, lr, lu, Tp],
          styles: [
            ".flex-unset[_ngcontent-%COMP%]{flex:unset!important}.w-fit-content[_ngcontent-%COMP%]{width:-moz-fit-content!important;width:fit-content!important}.thumbnail[_ngcontent-%COMP%]{width:300px}.text-goldenrod[_ngcontent-%COMP%]{color:#daa520}.heart-icon[_ngcontent-%COMP%]{margin-right:1px}.text-burnt[_ngcontent-%COMP%]{color:#ff4500}.btn-xs[_ngcontent-%COMP%]{padding:.2rem .4rem;font-size:.75rem;border-radius:.2rem}#description[_ngcontent-%COMP%]{min-width:300px}#info[_ngcontent-%COMP%]{display:flex;gap:1rem;flex-wrap:wrap;justify-content:flex-start;align-items:center}#info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{gap:4px;display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:center;white-space:nowrap}#info[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{width:16px}h2[_ngcontent-%COMP%]{font-size:1.25rem;font-weight:400}@media (max-width: 620px){#display[_ngcontent-%COMP%], #info[_ngcontent-%COMP%]{justify-content:center}}",
          ],
        }));
      let LS = (() => {
        var e;
        class n {
          constructor(r) {
            (this.http = r), (this.URL = Tl.API_VERSION);
          }
          updateUser(r, i, o, s, a, l) {
            return this.http.put(this.URL + "/users", {
              firstName: r,
              lastName: i,
              enabled: o,
              admin: s,
              password: a,
              user: l,
            });
          }
          getUsers() {
            return this.http.get(this.URL + "/users");
          }
          getUser(r) {
            return this.http.get(this.URL + `/users/${r}`);
          }
        }
        return (
          ((e = n).ɵfac = function (r) {
            return new (r || e)(L(ys));
          }),
          (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function m4(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "div", 5)(1, "label", 15),
            N(2, "New Password"),
            m(),
            p(3, "input", 16),
            P("ngModelChange", function (i) {
              return K(t), Y((M(2).password = i));
            }),
            m()();
        }
        if (2 & e) {
          const t = M(2);
          g(3), v("ngModel", t.password);
        }
      }
      function _4(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "div", 5)(1, "label", 17),
            N(2, "Confirm New Password"),
            m(),
            p(3, "input", 18),
            P("ngModelChange", function (i) {
              return K(t), Y((M(2).confirmPassword = i));
            }),
            m()();
        }
        if (2 & e) {
          const t = M(2);
          g(3), v("ngModel", t.confirmPassword);
        }
      }
      function v4(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "div", 5)(1, "button", 19),
            P("click", function () {
              return K(t), Y(M(2).generatePassword());
            }),
            N(2, "Generate Temporary Password"),
            m()();
        }
      }
      function y4(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "form")(1, "div", 5)(2, "label", 6),
            N(3, "Email"),
            m(),
            p(4, "input", 7),
            P("ngModelChange", function (i) {
              return K(t), Y((M().email = i));
            }),
            m()(),
            p(5, "div", 5)(6, "label", 8),
            N(7, "First Name"),
            m(),
            p(8, "input", 9),
            P("ngModelChange", function (i) {
              return K(t), Y((M().firstName = i));
            }),
            m()(),
            p(9, "div", 5)(10, "label", 10),
            N(11, "Last Name"),
            m(),
            p(12, "input", 11),
            P("ngModelChange", function (i) {
              return K(t), Y((M().lastName = i));
            }),
            m()(),
            A(13, "hr"),
            C(14, m4, 4, 1, "div", 12),
            C(15, _4, 4, 1, "div", 12),
            C(16, v4, 3, 0, "div", 12),
            p(17, "button", 13),
            P("click", function () {
              return K(t), Y(M().onSubmit());
            }),
            N(18, "Save Changes"),
            m(),
            p(19, "button", 14),
            P("click", function () {
              return K(t), Y(M().onCancel());
            }),
            N(20, "Cancel"),
            m()();
        }
        if (2 & e) {
          const t = M();
          g(4),
            v("ngModel", t.email),
            g(4),
            v("ngModel", t.firstName),
            g(4),
            v("ngModel", t.lastName),
            g(2),
            v(
              "ngIf",
              (null == t.currentUser ? null : t.currentUser.email) ==
                (null == t.user ? null : t.user.email)
            ),
            g(1),
            v(
              "ngIf",
              (null == t.currentUser ? null : t.currentUser.email) ==
                (null == t.user ? null : t.user.email)
            ),
            g(1),
            v(
              "ngIf",
              (null == t.currentUser ? null : t.currentUser.email) !=
                (null == t.user ? null : t.user.email)
            );
        }
      }
      let b4 = (() => {
        var e;
        class n {
          constructor(r, i, o, s, a) {
            (this.router = r),
              (this.route = i),
              (this.userApi = o),
              (this.authApi = s),
              (this.location = a),
              (this.userId = ""),
              (this.email = ""),
              (this.firstName = ""),
              (this.lastName = ""),
              (this.password = ""),
              (this.confirmPassword = ""),
              (this.errorOccured = !1),
              (this.errorMsg = "");
          }
          ngOnInit() {
            this.resetError(),
              this.route.params.subscribe((r) => {
                (this.userId = r.uid),
                  this.authApi.fetchUser().subscribe((i) => {
                    (this.currentUser = i),
                      i &&
                        (i.admin || i._id == this.userId) &&
                        this.userApi.getUser(this.userId).subscribe((o) => {
                          (this.user = o),
                            (this.email = o.email),
                            (this.firstName = o.firstName),
                            (this.lastName = o.lastName);
                        });
                  });
              });
          }
          onSubmit() {
            this.resetError(),
              this.user &&
                (this.password == this.confirmPassword
                  ? "" == this.password || this.validatePassword(this.password)
                    ? this.userApi
                        .updateUser(
                          this.firstName,
                          this.lastName,
                          this.user.enabled,
                          this.user.admin,
                          this.password,
                          this.user
                        )
                        .subscribe({
                          next: (r) => {
                            (this.user = r),
                              this.currentUser?.admin ||
                                this.authApi.setUser(r),
                              this.router.navigateByUrl("login");
                          },
                          error: (r) => {
                            (this.errorMsg = r.error), (this.errorOccured = !0);
                          },
                        })
                    : ((this.errorMsg =
                        "Password must be at least 8 characters."),
                      (this.errorOccured = !0))
                  : ((this.errorMsg = "Passwords must match."),
                    (this.errorOccured = !0)));
          }
          onCancel() {
            this.location.back();
          }
          generatePassword() {
            this.resetError(),
              this.user &&
                this.currentUser &&
                this.currentUser.admin &&
                this.userApi
                  .updateUser(
                    this.user.firstName,
                    this.user.lastName,
                    this.user.enabled,
                    this.user.admin,
                    "placeholder",
                    this.user
                  )
                  .subscribe({
                    next: (r) => {
                      (this.user = r),
                        this.currentUser?.admin || this.authApi.setUser(r),
                        this.router.navigateByUrl("login");
                    },
                    error: (r) => {
                      (this.errorMsg = r.error), (this.errorOccured = !0);
                    },
                  });
          }
          validatePassword(r) {
            return !(r.length < 8 || /\s/.test(r));
          }
          resetError() {
            (this.errorOccured = !1), (this.errorMsg = "");
          }
        }
        return (
          ((e = n).ɵfac = function (r) {
            return new (r || e)(_(et), _(Nr), _(LS), _(Qr), _($i));
          }),
          (e.ɵcmp = Oe({
            type: e,
            selectors: [["app-profile"]],
            decls: 9,
            vars: 3,
            consts: [
              [1, "background"],
              [1, "container", "my-5", "justify-content-center", "d-flex"],
              [
                "id",
                "edit-profile-form",
                1,
                "w-25",
                "card",
                "shadow",
                "p-4",
                "rounded-3",
                "h-fit-content",
              ],
              [1, "text-danger", 3, "hidden"],
              [4, "ngIf"],
              [1, "form-group", "my-2"],
              ["for", "email"],
              [
                "type",
                "email",
                "id",
                "email",
                "required",
                "",
                "aria-describedby",
                "emailHelp",
                "placeholder",
                "Email address",
                "readonly",
                "",
                "name",
                "email",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["for", "firstName"],
              [
                "type",
                "text",
                "id",
                "firstName",
                "required",
                "",
                "placeholder",
                "Enter first name",
                "name",
                "firstName",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["for", "lastName"],
              [
                "type",
                "text",
                "id",
                "lastName",
                "required",
                "",
                "placeholder",
                "Enter last name",
                "name",
                "lastName",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["class", "form-group my-2", 4, "ngIf"],
              [1, "btn", "btn-primary", "my-2", 3, "click"],
              [1, "btn", "btn-secondary", "my-2", "mx-2", 3, "click"],
              ["for", "password"],
              [
                "type",
                "password",
                "name",
                "password",
                "placeholder",
                "New password",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["for", "confirmPassword"],
              [
                "type",
                "password",
                "name",
                "confirmPassword",
                "placeholder",
                "Confirm new password",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              [1, "btn", "btn-outline-dark", "my-2", 3, "click"],
            ],
            template: function (r, i) {
              1 & r &&
                (p(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "h2"),
                N(4, "Edit Profile"),
                m(),
                A(5, "hr"),
                p(6, "div", 3),
                N(7),
                m(),
                C(8, y4, 21, 6, "form", 4),
                m()()()),
                2 & r &&
                  (g(6),
                  v("hidden", !i.errorOccured),
                  g(1),
                  Je(" *", i.errorMsg, " "),
                  g(1),
                  v("ngIf", null != i.user));
            },
            dependencies: [kt, Ja, Dr, _i, za, Nu, Kr, ji],
            styles: [
              "#edit-profile-form[_ngcontent-%COMP%]{background-color:#eee;min-width:300px}.h-fit-content[_ngcontent-%COMP%]{height:-moz-fit-content;height:fit-content}",
            ],
          })),
          n
        );
      })();
      const D4 = function () {
        return ["/login"];
      };
      let C4 = (() => {
        var e;
        class n {
          constructor(r, i) {
            (this.router = r),
              (this.authService = i),
              (this.errorOccured = !1),
              (this.errorMsg = "");
          }
          register() {
            (this.errorOccured = !1),
              this.email &&
                this.password &&
                this.confirmPassword &&
                this.firstName &&
                this.lastName &&
                (this.validateEmail(this.email)
                  ? this.confirmPassword == this.password
                    ? this.validatePassword(this.password)
                      ? this.authService
                          .register(
                            this.email,
                            this.password,
                            this.firstName,
                            this.lastName
                          )
                          .subscribe({
                            next: (r) => {
                              "object" == typeof r && "email" in r && r.email
                                ? ((this.email = ""),
                                  (this.password = ""),
                                  (this.confirmPassword = ""),
                                  this.router.navigateByUrl("login"))
                                : this.setError("There was an issue.");
                            },
                            error: (r) => {
                              this.setError(r.error);
                            },
                          })
                      : this.setError("Passwords be at least 8 characters.")
                    : this.setError("Passwords must match.")
                  : this.setError("Invalid email provided."));
          }
          setError(r) {
            (this.errorMsg = r),
              (this.errorOccured = !0),
              (this.password = ""),
              (this.confirmPassword = "");
          }
          validatePassword(r) {
            return !(r.length < 8 || /\s/.test(r));
          }
          validateEmail(r) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r);
          }
        }
        return (
          ((e = n).ɵfac = function (r) {
            return new (r || e)(_(et), _(Qr));
          }),
          (e.ɵcmp = Oe({
            type: e,
            selectors: [["app-register"]],
            inputs: {
              email: "email",
              password: "password",
              confirmPassword: "confirmPassword",
              firstName: "firstName",
              lastName: "lastName",
            },
            decls: 36,
            vars: 9,
            consts: [
              [1, "background"],
              [1, "flex-column", "d-flex"],
              [1, "d-flex", "justify-content-center", "mt-3"],
              [
                "id",
                "game-shelf-icon",
                "src",
                "../../../assets/gs-logo.png",
                "alt",
                "Game Shelf Icon",
              ],
              [1, "d-flex", "justify-content-center"],
              ["id", "register-form", 1, "float-end", "card", "shadow"],
              ["id", "error-container", 1, "text-danger", 3, "hidden"],
              [1, "form-group", "mb-2"],
              ["for", "email"],
              [
                "type",
                "text",
                "name",
                "email",
                "placeholder",
                "Email",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["for", "firstName"],
              [
                "type",
                "text",
                "name",
                "firstName",
                "placeholder",
                "First name",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["for", "lastName"],
              [
                "type",
                "text",
                "name",
                "lastName",
                "placeholder",
                "Last name",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["for", "password"],
              [
                "type",
                "password",
                "name",
                "password",
                "placeholder",
                "Password",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["for", "confirmPassword"],
              [
                "type",
                "password",
                "name",
                "confirmPassword",
                "placeholder",
                "Confirm password",
                1,
                "form-control",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["type", "submit", 1, "btn", "btn-primary", "btn-sm", 3, "click"],
              [1, "btn", "btn-secondary", "btn-sm", "mx-2", 3, "routerLink"],
            ],
            template: function (r, i) {
              1 & r &&
                (p(0, "div", 0)(1, "div", 1)(2, "div", 2),
                A(3, "img", 3),
                m(),
                p(4, "div", 4)(5, "form", 5)(6, "h3"),
                N(7, "Register"),
                m(),
                p(8, "div")(9, "div", 6),
                N(10),
                m(),
                p(11, "div")(12, "div", 7)(13, "label", 8),
                N(14, "Email"),
                m(),
                p(15, "input", 9),
                P("ngModelChange", function (s) {
                  return (i.email = s);
                }),
                m()(),
                p(16, "div", 7)(17, "label", 10),
                N(18, "First Name"),
                m(),
                p(19, "input", 11),
                P("ngModelChange", function (s) {
                  return (i.firstName = s);
                }),
                m()(),
                p(20, "div", 7)(21, "label", 12),
                N(22, "Last Name"),
                m(),
                p(23, "input", 13),
                P("ngModelChange", function (s) {
                  return (i.lastName = s);
                }),
                m()(),
                p(24, "div", 7)(25, "label", 14),
                N(26, "Password"),
                m(),
                p(27, "input", 15),
                P("ngModelChange", function (s) {
                  return (i.password = s);
                }),
                m()(),
                p(28, "div", 7)(29, "label", 16),
                N(30, "Confirm Password"),
                m(),
                p(31, "input", 17),
                P("ngModelChange", function (s) {
                  return (i.confirmPassword = s);
                }),
                m()()(),
                p(32, "button", 18),
                P("click", function () {
                  return i.register();
                }),
                N(33, "Register "),
                m(),
                p(34, "a", 19),
                N(35, "Back to Login "),
                m()()()()()()),
                2 & r &&
                  (g(9),
                  v("hidden", !i.errorOccured),
                  g(1),
                  Je(" *", i.errorMsg, " "),
                  g(5),
                  v("ngModel", i.email),
                  g(4),
                  v("ngModel", i.firstName),
                  g(4),
                  v("ngModel", i.lastName),
                  g(4),
                  v("ngModel", i.password),
                  g(4),
                  v("ngModel", i.confirmPassword),
                  g(3),
                  v("routerLink", xe(8, D4)));
            },
            dependencies: [lr, Ja, Dr, _i, za, Kr, ji],
            styles: [
              "#register-form[_ngcontent-%COMP%]{max-width:600px;min-width:300px;padding:15px;background-color:#eee;border-radius:.5em;margin-top:1em;margin-right:1em;height:-moz-fit-content;height:fit-content;width:-moz-fit-content;width:fit-content}#game-shelf-icon[_ngcontent-%COMP%]{max-width:100px}#error-container[_ngcontent-%COMP%]{max-width:260px}.things-title[_ngcontent-%COMP%]{font-size:400%;text-shadow:3px 3px 3px black;font-family:Montserrat,sans-serif;font-weight:700;color:#fff;letter-spacing:3px}",
            ],
          })),
          n
        );
      })();
      function w4(e, n) {
        if (1 & e) {
          const t = fe();
          p(0, "tr")(1, "td")(2, "input", 29),
            P("change", function () {
              return K(t), Y(M().resetError());
            })("ngModelChange", function (i) {
              return Y((K(t).$implicit.selected = i));
            }),
            m()(),
            p(3, "td"),
            N(4),
            m(),
            p(5, "td"),
            N(6),
            m(),
            p(7, "td"),
            N(8),
            m(),
            p(9, "td", 30)(10, "input", 31),
            P("ngModelChange", function (i) {
              return Y((K(t).$implicit.enabled = i));
            }),
            m()(),
            p(11, "td", 32)(12, "input", 31),
            P("ngModelChange", function (i) {
              return Y((K(t).$implicit.admin = i));
            }),
            m()()();
        }
        if (2 & e) {
          const t = n.$implicit;
          g(2),
            v("ngModel", t.selected),
            g(2),
            Ue(t.email),
            g(2),
            Ue(t.firstName),
            g(2),
            Ue(t.lastName),
            g(2),
            v("ngModel", t.enabled),
            g(2),
            v("ngModel", t.admin);
        }
      }
      let E4 = (() => {
          var e;
          class n {
            constructor(r, i, o) {
              (this.userApi = r),
                (this.authApi = i),
                (this.router = o),
                (this.users = []),
                (this.errorMsg = ""),
                (this.errorOccured = !1),
                (this.visibleUsers = []),
                (this.value = "");
            }
            ngOnInit() {
              this.getUsers();
            }
            resetError() {
              (this.errorOccured = !1), (this.errorMsg = "");
            }
            selectAll(r) {
              this.resetError();
              let i = !1;
              r.target.checked && (i = !0);
              const o = this.visibleUsers.map((s) => ((s.selected = i), s));
              this.users = o;
            }
            manageUser() {
              this.resetError();
              const r = this.visibleUsers
                .filter((i) => i.selected)
                .map((i) => ({
                  _id: i._id,
                  email: i.email,
                  firstName: i.firstName,
                  lastName: i.lastName,
                  enabled: i.enabled,
                  admin: i.admin,
                  issuer: i.issuer,
                }));
              r.length > 1 || r.length < 1
                ? ((this.errorMsg =
                    "Only 1 user can be selected for this action."),
                  (this.errorOccured = !0))
                : this.router.navigateByUrl(`profile/${r[0]._id}`);
            }
            getUsers() {
              this.resetError(),
                this.userApi.getUsers().subscribe((r) => {
                  for (const i of r)
                    this.users.push({
                      _id: i._id,
                      email: i.email,
                      firstName: i.firstName,
                      lastName: i.lastName,
                      enabled: i.enabled,
                      admin: i.admin,
                      issuer: i.issuer,
                      selected: !1,
                    });
                  this.visibleUsers = this.users;
                });
            }
            search() {
              this.visibleUsers =
                this.users && "" != this.value
                  ? this.users.filter((r) => r.email.includes(this.value))
                  : this.users;
            }
            setAdmin(r) {
              this.resetError();
              const i = this.visibleUsers
                .filter((o) => o.selected)
                .map((o) => ({
                  _id: o._id,
                  email: o.email,
                  firstName: o.firstName,
                  lastName: o.lastName,
                  enabled: o.enabled,
                  admin: o.admin,
                  issuer: o.issuer,
                }));
              for (const o of i)
                this.userApi
                  .updateUser(o.firstName, o.lastName, o.enabled, r, "", o)
                  .subscribe((s) => {
                    if (o.admin != s.admin) {
                      const a = this.visibleUsers.map(
                        (l) => (l.email === s.email && (l.admin = s.admin), l)
                      );
                      (this.users = a), (this.visibleUsers = a);
                    }
                  });
            }
            setEnabled(r) {
              this.resetError();
              const i = this.visibleUsers
                .filter((o) => o.selected)
                .map((o) => ({
                  _id: o._id,
                  email: o.email,
                  firstName: o.firstName,
                  lastName: o.lastName,
                  enabled: o.enabled,
                  admin: o.admin,
                  issuer: o.issuer,
                }));
              for (const o of i)
                this.userApi
                  .updateUser(o.firstName, o.lastName, r, o.admin, "", o)
                  .subscribe((s) => {
                    if (o.enabled != s.enabled) {
                      const a = this.visibleUsers.map(
                        (l) => (
                          l.email === s.email && (l.enabled = s.enabled), l
                        )
                      );
                      (this.users = a), (this.visibleUsers = a);
                    }
                  });
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(_(LS), _(Qr), _(et));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["app-manage-users"]],
              decls: 57,
              vars: 4,
              consts: [
                [1, "background"],
                [1, "container", "my-5"],
                [1, "col"],
                [1, "row", "my-3"],
                [1, "mt-0", "mb-2"],
                [1, "text-danger", 3, "hidden"],
                ["id", "action-container", 1, "d-flex", "mb-2"],
                [1, "dropdown", "me-4"],
                [
                  "id",
                  "dropdownMenuButton",
                  "role",
                  "button",
                  "data-bs-toggle",
                  "dropdown",
                  "aria-expanded",
                  "false",
                  1,
                  "btn",
                  "btn-primary",
                  "dropdown-toggle",
                ],
                ["aria-labelledby", "dropdownMenuButton", 1, "dropdown-menu"],
                [1, "dropdown-item", 3, "click"],
                [1, "fa", "fa-toggle-on", "text-success"],
                [1, "fa", "fa-toggle-on", "fa-flip-horizontal", "text-danger"],
                [1, "dropdown-divider"],
                [1, "fa", "fa-arrow-up", "text-success"],
                [1, "fa", "fa-arrow-down", "text-danger"],
                [1, "fa", "fa-lock"],
                ["id", "search-container", 1, "row", "p-0"],
                [
                  "type",
                  "text",
                  "id",
                  "search",
                  "placeholder",
                  "Enter email here...",
                  1,
                  "form-control",
                  3,
                  "ngModel",
                  "ngModelChange",
                  "keyup.enter",
                ],
                [1, "col", "search-button"],
                ["type", "submit", 1, "btn", "btn-primary", 3, "click"],
                [1, "fa", "fa-search"],
                [1, "table-container"],
                [1, "table", "table-striped"],
                [1, "table-light"],
                ["scope", "col"],
                ["type", "checkbox", 3, "change"],
                ["scope", "col", 1, "align-middle", "text-center", "w-boolean"],
                [4, "ngFor", "ngForOf"],
                ["type", "checkbox", 3, "ngModel", "change", "ngModelChange"],
                [1, "w-auto", "text-center"],
                [
                  "type",
                  "checkbox",
                  "disabled",
                  "",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                [1, "w-auto", "align-middle", "text-center"],
              ],
              template: function (r, i) {
                1 & r &&
                  (p(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                    4,
                    "h2"
                  ),
                  N(5, "Manage Users"),
                  m(),
                  A(6, "hr"),
                  p(7, "div", 4)(8, "span", 5),
                  N(9),
                  m()(),
                  p(10, "div", 6)(11, "div", 7)(12, "a", 8),
                  N(13, " Actions "),
                  m(),
                  p(14, "div", 9)(15, "button", 10),
                  P("click", function () {
                    return i.setEnabled(!0);
                  }),
                  A(16, "i", 11),
                  N(17, " Enable"),
                  m(),
                  p(18, "button", 10),
                  P("click", function () {
                    return i.setEnabled(!1);
                  }),
                  A(19, "i", 12),
                  N(20, " Disable"),
                  m(),
                  A(21, "div", 13),
                  p(22, "button", 10),
                  P("click", function () {
                    return i.setAdmin(!0);
                  }),
                  A(23, "i", 14),
                  N(24, " Promote to Admin"),
                  m(),
                  p(25, "button", 10),
                  P("click", function () {
                    return i.setAdmin(!1);
                  }),
                  A(26, "i", 15),
                  N(27, " Demote to User"),
                  m(),
                  A(28, "div", 13),
                  p(29, "button", 10),
                  P("click", function () {
                    return i.manageUser();
                  }),
                  A(30, "i", 16),
                  N(31, " Manage Profile"),
                  m()()(),
                  p(32, "div", 17)(33, "div", 2)(34, "input", 18),
                  P("ngModelChange", function (s) {
                    return (i.value = s);
                  })("keyup.enter", function () {
                    return i.search();
                  }),
                  m()(),
                  p(35, "div", 19)(36, "button", 20),
                  P("click", function () {
                    return i.search();
                  }),
                  A(37, "i", 21),
                  N(38, " Search "),
                  m()()()(),
                  p(39, "div", 22)(40, "table", 23)(41, "thead", 24)(42, "tr")(
                    43,
                    "th",
                    25
                  )(44, "input", 26),
                  P("change", function (s) {
                    return i.selectAll(s);
                  }),
                  m()(),
                  p(45, "th", 25),
                  N(46, "Email"),
                  m(),
                  p(47, "th", 25),
                  N(48, "First Name"),
                  m(),
                  p(49, "th", 25),
                  N(50, "Last Name"),
                  m(),
                  p(51, "th", 27),
                  N(52, "Enabled"),
                  m(),
                  p(53, "th", 27),
                  N(54, "Admin"),
                  m()()(),
                  p(55, "tbody"),
                  C(56, w4, 13, 6, "tr", 28),
                  m()()()()()()()),
                  2 & r &&
                    (g(8),
                    v("hidden", !i.errorOccured),
                    g(1),
                    Je(" *", i.errorMsg, " "),
                    g(25),
                    v("ngModel", i.value),
                    g(22),
                    v("ngForOf", i.visibleUsers));
              },
              dependencies: [Zt, Dr, jp, _i, Kr],
              styles: [
                "#search-container[_ngcontent-%COMP%]{min-width:300px;width:600px}.w-boolean[_ngcontent-%COMP%]{width:5rem}.table-container[_ngcontent-%COMP%]{position:relative;max-height:calc(100vh - 400px);overflow:auto}",
              ],
            })),
            n
          );
        })(),
        S4 = (() => {
          var e;
          class n {
            constructor(r, i) {
              (this.authService = r), (this.router = i);
            }
            canActivate() {
              let r =
                this.authService.isAdmin() &&
                this.authService.isAuthenticated();
              return (
                r ||
                  (this.authService.logout(), this.router.navigate(["/login"])),
                r
              );
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(L(Qr), L(et));
            }),
            (e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
            n
          );
        })();
      var xs;
      function M4(e, n) {
        if ((1 & e && A(0, "i"), 2 & e)) {
          const t = n.fill,
            r = n.index;
          (function D1(e, n, t) {
            er(Sn, br, $o(x(), e, n, t), !0);
          })("bi-heart", 100 === t ? "-fill" : "", ""),
            te("filled", 100 === t)("low", r < 3);
        }
      }
      const T4 = function (e) {
        return ["/games", e];
      };
      class yd {
        constructor(n, t, r) {
          (this.route = n),
            (this.gameLogApi = t),
            (this.location = r),
            (this.gameLog = Object.assign({}, yd.EMPTY_GameLog)),
            (this.gameLogId = ""),
            (this.date = ""),
            (this.selectedStar = 0);
        }
        ngOnInit() {
          this.route.params.subscribe((n) => {
            (this.gameLogId = n.glid),
              this.gameLogApi.getGameLog(this.gameLogId).subscribe((t) => {
                (this.gameLog = t),
                  (this.date = new Date(t.date).toISOString().substring(0, 10)),
                  (this.selectedStar = this.gameLog.rating || 0);
              });
          });
        }
        back() {
          this.location.back();
        }
        update() {
          (this.gameLog.date = this.date),
            (this.gameLog.rating = this.selectedStar),
            this.gameLogApi.updateGameLog(this.gameLog).subscribe((n) => {
              this.location.back();
            });
        }
        delete() {
          this.gameLogApi.deleteGameLog(this.gameLog).subscribe((n) => {
            this.location.back();
          });
        }
      }
      function N4(e, n) {
        1 & e && (re(0), A(1, "i", 19), ie());
      }
      function I4(e, n) {
        1 & e && (re(0), A(1, "i", 20), ie());
      }
      ((xs = yd).EMPTY_GameLog = {
        _id: "",
        bggGameId: "",
        bgaGameName: "",
        owner: "",
        date: "",
        note: void 0,
        rating: void 0,
      }),
        (xs.ɵfac = function (n) {
          return new (n || xs)(_(Nr), _(_m), _($i));
        }),
        (xs.ɵcmp = Oe({
          type: xs,
          selectors: [["app-gamelog"]],
          decls: 37,
          vars: 8,
          consts: [
            [1, "background"],
            [1, "flex-column", "d-flex"],
            [1, "d-flex", "justify-content-center"],
            ["id", "gameLog-form", 1, "float-end", "card", "shadow"],
            [1, "col"],
            ["id", "game-name", 3, "routerLink"],
            [1, "bi", "bi-box-arrow-down-right", "text-primary"],
            [1, "row"],
            [1, "form-group", "mb-2", "w-50"],
            ["for", "date"],
            [
              "type",
              "date",
              "name",
              "date",
              "placeholder",
              "Date",
              1,
              "form-control",
              3,
              "ngModel",
              "ngModelChange",
            ],
            [1, "form-group", "mb-2", "w-fit-content"],
            ["for", "rating"],
            [
              "name",
              "rating",
              1,
              "text-danger",
              3,
              "max",
              "ngModel",
              "ngModelChange",
            ],
            [1, "form-group", "mb-2"],
            ["for", "note"],
            [
              "name",
              "note",
              "placeholder",
              "Add a note here....",
              1,
              "form-control",
              3,
              "ngModel",
              "ngModelChange",
            ],
            [1, "mt-2"],
            ["type", "submit", 1, "btn", "btn-primary", "btn-sm", 3, "click"],
            [1, "btn", "btn-secondary", "btn-sm", "mx-2", 3, "click"],
            [1, "fa", "fa-arrow-left"],
            [1, "btn", "btn-danger", "btn-sm", "float-end", "me-4", 3, "click"],
            [1, "fa", "fa-trash-o"],
          ],
          template: function (n, t) {
            1 & n &&
              (p(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                4,
                "form",
                4
              )(5, "div")(6, "h6"),
              N(7, "Game Log"),
              m()(),
              p(8, "div")(9, "h3", 5),
              N(10),
              A(11, "i", 6),
              m()(),
              p(12, "div", 7)(13, "div", 7)(14, "div", 8)(15, "label", 9),
              N(16, "Date"),
              m(),
              p(17, "input", 10),
              P("ngModelChange", function (i) {
                return (t.date = i);
              }),
              m()(),
              p(18, "div", 11)(19, "p", 12),
              N(20, "Rate Your Experience"),
              m(),
              p(21, "ngb-rating", 13),
              P("ngModelChange", function (i) {
                return (t.selectedStar = i);
              }),
              C(22, M4, 1, 7, "ng-template"),
              m()()(),
              p(23, "div", 7)(24, "div", 14)(25, "label", 15),
              N(26, "Note"),
              m(),
              p(27, "textarea", 16),
              P("ngModelChange", function (i) {
                return (t.gameLog.note = i);
              }),
              m()()()(),
              p(28, "div", 17)(29, "button", 18),
              P("click", function () {
                return t.update();
              }),
              N(30, "Save Changes "),
              m(),
              p(31, "button", 19),
              P("click", function () {
                return t.back();
              }),
              A(32, "i", 20),
              N(33, " Back "),
              m(),
              p(34, "button", 21),
              P("click", function () {
                return t.delete();
              }),
              A(35, "i", 22),
              N(36, " Delete "),
              m()()()()()()()),
              2 & n &&
                (g(9),
                v("routerLink", Ut(6, T4, t.gameLog.bggGameId)),
                g(1),
                Je("", t.gameLog.bgaGameName, " "),
                g(7),
                v("ngModel", t.date),
                g(4),
                v("max", 5)("ngModel", t.selectedStar),
                g(6),
                v("ngModel", t.gameLog.note));
          },
          dependencies: [lr, eE, Ja, Dr, _i, za, Kr, ji],
          styles: [
            "#gameLog-form[_ngcontent-%COMP%]{width:600px;padding:15px;background-color:#eee;border-radius:.5em;margin:1em 1em 0;height:-moz-fit-content;height:fit-content}.thumbnail[_ngcontent-%COMP%]{width:300px}.w-fit-content[_ngcontent-%COMP%]{width:-moz-fit-content!important;width:fit-content!important}textarea[_ngcontent-%COMP%]{height:8em}p[_ngcontent-%COMP%]{margin:0 0 5px}ngb-rating[_ngcontent-%COMP%]{margin:-10px 0;gap:1px;font-size:30px}#game-name[_ngcontent-%COMP%]:hover{cursor:pointer}#game-name[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:.5em}@media (max-width: 620px){textarea[_ngcontent-%COMP%]{height:16em!important}}",
          ],
        }));
      const vm = function () {
        return [];
      };
      function O4(e, n) {
        if (
          (1 & e && (re(0), C(1, I4, 2, 0, "ng-container", 18), ie()), 2 & e)
        ) {
          const t = M(2).$implicit;
          g(1), v("ngForOf", xe(1, vm).constructor(5 - t.rating));
        }
      }
      function A4(e, n) {
        if (
          (1 & e &&
            (p(0, "td", 17),
            C(1, N4, 2, 0, "ng-container", 18),
            C(2, O4, 2, 2, "ng-container", 12),
            m()),
          2 & e)
        ) {
          const t = M().$implicit;
          g(1),
            v("ngForOf", xe(2, vm).constructor(t.rating)),
            g(1),
            v("ngIf", 5 != t.rating);
        }
      }
      function R4(e, n) {
        1 & e && (re(0), A(1, "i", 21), ie());
      }
      function x4(e, n) {
        1 & e && (p(0, "td", 17), C(1, R4, 2, 0, "ng-container", 18), m()),
          2 & e && (g(1), v("ngForOf", xe(1, vm).constructor(5)));
      }
      const P4 = function (e) {
        return ["/gamelogs", e];
      };
      function k4(e, n) {
        if (
          (1 & e &&
            (p(0, "tr", 13)(1, "td", 14),
            N(2),
            m(),
            p(3, "td"),
            N(4),
            tr(5, "date"),
            m(),
            C(6, A4, 3, 3, "td", 15),
            C(7, x4, 2, 2, "td", 15),
            p(8, "td", 16),
            N(9),
            m()()),
          2 & e)
        ) {
          const t = n.$implicit;
          v("routerLink", Ut(9, P4, t._id)),
            g(2),
            Ue(t.bgaGameName),
            g(2),
            Ue(Lh(5, 6, t.date, "MM-dd-y")),
            g(2),
            v("ngIf", t.rating),
            g(1),
            v("ngIf", !t.rating),
            g(2),
            Ue(t.note);
        }
      }
      function F4(e, n) {
        1 & e && (p(0, "div"), N(1, "No game logs found."), m());
      }
      const L4 = [
        { path: "login", component: JG, canActivate: [Fj] },
        { path: "register", component: C4 },
        { path: "discover", component: kj, canActivate: [As] },
        { path: "profile/:uid", component: b4, canActivate: [As] },
        { path: "manage", component: E4, canActivate: [S4] },
        { path: "gameshelf", component: Jj, canActivate: [As] },
        { path: "games/:gid", component: vd, canActivate: [As] },
        { path: "gamelogs/:glid", component: yd, canActivate: [As] },
        {
          path: "history",
          component: (() => {
            var e;
            class n {
              constructor(r, i, o, s) {
                (this.router = r),
                  (this.route = i),
                  (this.gameLogApi = o),
                  (this.location = s),
                  (this.gameLogs = null),
                  (this.visibleGameLogs = null),
                  (this.value = "");
              }
              ngOnInit() {
                this.gameLogApi.getGameLogs().subscribe((r) => {
                  (this.gameLogs = r), (this.visibleGameLogs = r);
                });
              }
              search() {
                this.visibleGameLogs =
                  this.gameLogs && "" != this.value
                    ? this.gameLogs.filter((r) =>
                        r.bgaGameName.includes(this.value)
                      )
                    : this.gameLogs;
              }
            }
            return (
              ((e = n).ɵfac = function (r) {
                return new (r || e)(_(et), _(Nr), _(_m), _($i));
              }),
              (e.ɵcmp = Oe({
                type: e,
                selectors: [["app-history"]],
                decls: 29,
                vars: 3,
                consts: [
                  [1, "background"],
                  [1, "container", "my-5"],
                  [1, "col"],
                  [1, "row", "my-3"],
                  [
                    "id",
                    "search-container",
                    1,
                    "row",
                    "justify-content-between",
                    "p-0",
                    "mb-2",
                  ],
                  [
                    "type",
                    "text",
                    "id",
                    "search",
                    "placeholder",
                    "Enter name here... (Ex. Catan, Uno, Betrayal, etc.)",
                    1,
                    "form-control",
                    "w-100",
                    3,
                    "ngModel",
                    "ngModelChange",
                    "keyup.enter",
                  ],
                  [1, "col", "search-button"],
                  ["type", "submit", 1, "btn", "btn-primary", 3, "click"],
                  [1, "fa", "fa-search"],
                  [1, "table-container", "p-0"],
                  [1, "table", "table-striped"],
                  [
                    "class",
                    "clickable-row",
                    3,
                    "routerLink",
                    4,
                    "ngFor",
                    "ngForOf",
                  ],
                  [4, "ngIf"],
                  [1, "clickable-row", 3, "routerLink"],
                  [1, "name-row"],
                  ["class", "rating-row", 4, "ngIf"],
                  [1, "note-row"],
                  [1, "rating-row"],
                  [4, "ngFor", "ngForOf"],
                  [1, "bi-heart-fill", "text-danger", "heart-icon"],
                  [1, "bi-heart", "text-danger", "heart-icon"],
                  [1, "bi-heart", "text-secondary", "heart-icon"],
                ],
                template: function (r, i) {
                  1 & r &&
                    (p(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                      4,
                      "h2"
                    ),
                    N(5, "My Game Logs"),
                    m(),
                    A(6, "hr"),
                    p(7, "div", 4)(8, "div", 2)(9, "input", 5),
                    P("ngModelChange", function (s) {
                      return (i.value = s);
                    })("keyup.enter", function () {
                      return i.search();
                    }),
                    m()(),
                    p(10, "div", 6)(11, "button", 7),
                    P("click", function () {
                      return i.search();
                    }),
                    A(12, "i", 8),
                    N(13, " Search "),
                    m()()(),
                    p(14, "div", 9)(15, "table", 10)(16, "thead")(17, "tr")(
                      18,
                      "th"
                    ),
                    N(19, "Name"),
                    m(),
                    p(20, "th"),
                    N(21, "Date"),
                    m(),
                    p(22, "th"),
                    N(23, "Rating"),
                    m(),
                    p(24, "th"),
                    N(25, "Note"),
                    m()()(),
                    p(26, "tbody"),
                    C(27, k4, 10, 11, "tr", 11),
                    m()()(),
                    C(28, F4, 2, 0, "div", 12),
                    m()()()()),
                    2 & r &&
                      (g(9),
                      v("ngModel", i.value),
                      g(18),
                      v("ngForOf", i.visibleGameLogs),
                      g(1),
                      v(
                        "ngIf",
                        0 ==
                          (null == i.visibleGameLogs
                            ? null
                            : i.visibleGameLogs.length)
                      ));
                },
                dependencies: [Zt, kt, lr, Dr, _i, Kr, Tp],
                styles: [
                  "#log-list[_ngcontent-%COMP%]{background-color:#eee;min-width:370px;width:-moz-fit-content;width:fit-content}#search[_ngcontent-%COMP%]{min-width:100px;margin-left:5px}.rating-row[_ngcontent-%COMP%]{min-width:100px!important}.name-row[_ngcontent-%COMP%]{font-weight:500}.note-row[_ngcontent-%COMP%]{max-width:400px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.clickable-row[_ngcontent-%COMP%]:hover{cursor:pointer;background-color:#d9d9d9}.table-container[_ngcontent-%COMP%]{position:relative;max-height:calc(100vh - 350px);overflow:auto}@media (max-width: 620px){.note-row[_ngcontent-%COMP%]{max-width:100px!important}}",
                ],
              })),
              n
            );
          })(),
          canActivate: [As],
        },
        { path: "**", redirectTo: "login", pathMatch: "full" },
      ];
      let B4 = (() => {
        var e;
        class n {}
        return (
          ((e = n).ɵfac = function (r) {
            return new (r || e)();
          }),
          (e.ɵmod = ke({ type: e })),
          (e.ɵinj = Ie({ imports: [RS.forRoot(L4), RS] })),
          n
        );
      })();
      const V4 = function () {
          return ["/discover"];
        },
        H4 = function () {
          return ["/gameshelf"];
        },
        U4 = function (e) {
          return ["/profile", e];
        },
        $4 = function () {
          return ["/history"];
        },
        G4 = function () {
          return ["/manage"];
        };
      let j4 = (() => {
          var e;
          class n {
            isAuthenticated() {
              return null != this.user;
            }
            constructor(r, i) {
              (this.authService = r), (this.router = i);
            }
            userString() {
              return JSON.stringify(this.user);
            }
            ngOnInit() {
              this.authService.userSubject.subscribe((r) => {
                this.user = r;
              });
            }
            ngOnDestroy() {}
            logout() {
              this.authService
                .logout()
                .subscribe(() => this.router.navigate(["/"]));
            }
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(_(Qr), _(et));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["app-navbar"]],
              decls: 33,
              vars: 17,
              consts: [
                [
                  "id",
                  "navbar",
                  1,
                  "navbar",
                  "navbar-expand",
                  "navbar-dark",
                  "bg-dark",
                ],
                ["href", "#", 1, "navbar-brand", "ms-2", "position-absolute"],
                [
                  "src",
                  "../../../assets/gs-logo.png",
                  "alt",
                  "Game Shelf Logo",
                  1,
                  "logo",
                  "mx-2",
                ],
                [1, "container-fluid", "w-100"],
                [1, "d-flex", "justify-content-center", "w-100"],
                [1, "d-flex", "justify-content-between", "gap-2"],
                [
                  "routerLinkActive",
                  "active",
                  1,
                  "nav-link",
                  "mx-auto",
                  "link",
                  3,
                  "hidden",
                  "routerLink",
                ],
                [
                  1,
                  "nav-link",
                  "separator",
                  "mx-2",
                  "text-secondary",
                  3,
                  "hidden",
                ],
                ["id", "profile", 1, "collapse", "navbar-collapse"],
                ["id", "dropdown", 1, "navbar-nav"],
                [
                  "id",
                  "profile-dropdown",
                  1,
                  "nav-item",
                  "dropdown",
                  3,
                  "hidden",
                ],
                [
                  "href",
                  "#",
                  "id",
                  "navbarDarkDropdownMenuLink",
                  "role",
                  "button",
                  "data-bs-toggle",
                  "dropdown",
                  "aria-expanded",
                  "false",
                  1,
                  "nav-link",
                  "dropdown-toggle",
                ],
                ["id", "user-full-name"],
                [
                  "aria-labelledby",
                  "navbarDarkDropdownMenuLink",
                  1,
                  "dropdown-menu",
                  "dropdown-menu-dark",
                ],
                ["id", "profile-button", 1, "dropdown-item", 3, "routerLink"],
                ["id", "logs-button", 1, "dropdown-item", 3, "routerLink"],
                [
                  "id",
                  "manage-button",
                  1,
                  "dropdown-item",
                  3,
                  "hidden",
                  "routerLink",
                ],
                ["id", "logout-button", 1, "dropdown-item", 3, "click"],
              ],
              template: function (r, i) {
                1 & r &&
                  (p(0, "nav", 0)(1, "a", 1),
                  A(2, "img", 2),
                  p(3, "span"),
                  N(4, "Game Shelf"),
                  m()(),
                  p(5, "div", 3)(6, "div", 4)(7, "div", 5)(8, "a", 6),
                  N(9, "Discover"),
                  m(),
                  p(10, "span", 7),
                  N(11, "|"),
                  m(),
                  p(12, "a", 6),
                  N(13, "My Game Shelf"),
                  m()()(),
                  p(14, "div", 8)(15, "ul", 9)(16, "li", 10)(17, "a", 11)(
                    18,
                    "span",
                    12
                  ),
                  N(19),
                  m()(),
                  p(20, "ul", 13)(21, "li")(22, "a", 14),
                  N(23, "Edit Profile"),
                  m()(),
                  p(24, "li")(25, "a", 15),
                  N(26, "View Game Logs"),
                  m()(),
                  p(27, "li")(28, "a", 16),
                  N(29, "Manage Users"),
                  m()(),
                  p(30, "li")(31, "button", 17),
                  P("click", function () {
                    return i.logout();
                  }),
                  N(32, "Logout"),
                  m()()()()()()()()),
                  2 & r &&
                    (g(8),
                    v("hidden", null == i.user)("routerLink", xe(11, V4)),
                    g(2),
                    v("hidden", null == i.user),
                    g(2),
                    v("hidden", null == i.user)("routerLink", xe(12, H4)),
                    g(4),
                    v("hidden", null == i.user),
                    g(3),
                    Ue(null == i.user ? null : i.user.email),
                    g(3),
                    v(
                      "routerLink",
                      Ut(13, U4, null == i.user ? null : i.user._id)
                    ),
                    g(3),
                    v("routerLink", xe(15, $4)),
                    g(3),
                    v("hidden", !(null != i.user && i.user.admin))(
                      "routerLink",
                      xe(16, G4)
                    ));
              },
              dependencies: [lr, ES],
              styles: [
                "#profile[_ngcontent-%COMP%]{flex-grow:unset}#dropdown[_ngcontent-%COMP%]{position:absolute;right:0;margin-right:3em}.logo[_ngcontent-%COMP%]{width:24px}.link[_ngcontent-%COMP%]{color:var(--bs-white);text-decoration:none!important;width:-moz-fit-content;width:fit-content;display:inline-block;text-align:center;font-weight:700}.link[_ngcontent-%COMP%]:hover{color:var(--bs-blue);transition:color .2s ease}.link.active[_ngcontent-%COMP%]{color:var(--bs-secondary)}nav[_ngcontent-%COMP%]{min-height:56px}@media (max-width: 620px){.navbar-brand[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], #user-full-name[_ngcontent-%COMP%]{display:none}.nav-item[_ngcontent-%COMP%]{text-align:left}.dropdown-menu[data-bs-popper][_ngcontent-%COMP%]{top:100%;left:-120px;margin-top:var(--bs-dropdown-spacer)}#dropdown[_ngcontent-%COMP%]{margin-right:1em}}",
              ],
            })),
            n
          );
        })(),
        z4 = (() => {
          var e;
          class n {
            isAuthenticated() {
              return null != this.user;
            }
            constructor(r) {
              r.userSubject.subscribe((i) => {
                this.user = i;
              });
            }
            userString() {
              return JSON.stringify(this.user);
            }
            ngOnInit() {}
            ngOnDestroy() {}
          }
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)(_(Qr));
            }),
            (e.ɵcmp = Oe({
              type: e,
              selectors: [["app-root"]],
              decls: 11,
              vars: 0,
              consts: [
                ["id", "app-container"],
                [1, "bg-dark", "text-center", "text-white", "py-3"],
                [1, "container"],
                [1, "row"],
                [1, "col-md-12"],
              ],
              template: function (r, i) {
                1 & r &&
                  (p(0, "div", 0)(1, "div"),
                  A(2, "app-navbar"),
                  m(),
                  p(3, "main"),
                  A(4, "router-outlet"),
                  m(),
                  p(5, "footer", 1)(6, "div", 2)(7, "div", 3)(8, "div", 4)(
                    9,
                    "p"
                  ),
                  N(10, "\xa9 2023 Dakota Kallas. All Rights Reserved."),
                  m()()()()()());
              },
              dependencies: [nm, j4],
            })),
            n
          );
        })(),
        W4 = (() => {
          var e;
          class n {}
          return (
            ((e = n).ɵfac = function (r) {
              return new (r || e)();
            }),
            (e.ɵmod = ke({ type: e, bootstrap: [z4] })),
            (e.ɵinj = Ie({ providers: [$i], imports: [OF, B4, MU, rU, dL] })),
            n
          );
        })();
      IF()
        .bootstrapModule(W4)
        .catch((e) => console.error(e));
    },
    321: () => {
      const _e = ":";
      class Qe extends Error {
        constructor(D) {
          super(`No translation found for ${Us(D)}.`),
            (this.parsedMessage = D),
            (this.type = "MissingTranslationError");
        }
      }
      const Hl = function (E, ...D) {
          if (Hl.translate) {
            const R = Hl.translate(E, D);
            (E = R[0]), (D = R[1]);
          }
          let I = kd(E[0], E.raw[0]);
          for (let R = 1; R < E.length; R++) I += D[R - 1] + kd(E[R], E.raw[R]);
          return I;
        },
        Sm = ":";
      function kd(E, D) {
        return D.charAt(0) === Sm
          ? E.substring(
              (function Hs(E, D) {
                for (let I = 1, R = 1; I < E.length; I++, R++)
                  if ("\\" === D[R]) R++;
                  else if (E[I] === _e) return I;
                throw new Error(
                  `Unterminated $localize metadata block in "${D}".`
                );
              })(E, D) + 1
            )
          : E;
      }
      (() =>
        (typeof globalThis < "u" && globalThis) ||
        (typeof global < "u" && global) ||
        (typeof window < "u" && window) ||
        (typeof self < "u" &&
          typeof WorkerGlobalScope < "u" &&
          self instanceof WorkerGlobalScope &&
          self))().$localize = Hl;
    },
  },
  (_e) => {
    var Xr = (ei) => _e((_e.s = ei));
    Xr(321), Xr(146);
  },
]);
