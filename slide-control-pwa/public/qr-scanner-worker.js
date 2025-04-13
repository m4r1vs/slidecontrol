(function () {
  "use strict";
  var aa =
      "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (d, c, a) {
            d != Array.prototype && d != Object.prototype && (d[c] = a.value);
          },
    e =
      "undefined" != typeof window && window === this
        ? this
        : "undefined" != typeof global && null != global
          ? global
          : this;
  function ca() {
    ca = function () {};
    e.Symbol || (e.Symbol = xa);
  }
  var xa = (function () {
    var d = 0;
    return function (c) {
      return "jscomp_symbol_" + (c || "") + d++;
    };
  })();
  function f() {
    ca();
    var d = e.Symbol.iterator;
    d || (d = e.Symbol.iterator = e.Symbol("iterator"));
    "function" != typeof Array.prototype[d] &&
      aa(Array.prototype, d, {
        configurable: !0,
        writable: !0,
        value: function () {
          return ya(this);
        },
      });
    f = function () {};
  }
  function ya(d) {
    var c = 0;
    return za(function () {
      return c < d.length ? { done: !1, value: d[c++] } : { done: !0 };
    });
  }
  function za(d) {
    f();
    d = { next: d };
    d[e.Symbol.iterator] = function () {
      return this;
    };
    return d;
  }
  function Aa(d) {
    f();
    ca();
    f();
    var c = d[Symbol.iterator];
    return c ? c.call(d) : ya(d);
  }
  function Ba(d, c) {
    if (c) {
      var a = e;
      d = d.split(".");
      for (var b = 0; b < d.length - 1; b++) {
        var g = d[b];
        g in a || (a[g] = {});
        a = a[g];
      }
      d = d[d.length - 1];
      b = a[d];
      c = c(b);
      c != b &&
        null != c &&
        aa(a, d, { configurable: !0, writable: !0, value: c });
    }
  }
  Ba("String.prototype.startsWith", function (d) {
    return d
      ? d
      : function (c, a) {
          if (null == this)
            throw new TypeError(
              "The 'this' value for String.prototype.startsWith must not be null or undefined",
            );
          if (c instanceof RegExp)
            throw new TypeError(
              "First argument to String.prototype.startsWith must not be a regular expression",
            );
          var b = this + "";
          c += "";
          var g = b.length,
            d = c.length;
          a = Math.max(0, Math.min(a | 0, b.length));
          for (var h = 0; h < d && a < g; ) if (b[a++] != c[h++]) return !1;
          return h >= d;
        };
  });
  Ba("Array.prototype.find", function (d) {
    return d
      ? d
      : function (c, a) {
          a: {
            var b = this;
            b instanceof String && (b = String(b));
            for (var g = b.length, d = 0; d < g; d++) {
              var h = b[d];
              if (c.call(a, h, d, b)) {
                c = h;
                break a;
              }
            }
            c = void 0;
          }
          return c;
        };
  });
  self.onmessage = function (d) {
    var c = d.data.data;
    switch (d.data.type) {
      case "setDebug":
        cb = c;
        break;
      case "decode":
        var a = null;
        try {
          n = c.width;
          r = c.height;
          var b = c.data,
            g = 0,
            k = new Uint8ClampedArray(b.buffer, g, n * r);
          g += n * r;
          var h = new Uint8ClampedArray(b.buffer, g, n * r);
          g += n * r;
          var l = Aa(db(n, r));
          l.next();
          for (
            var m = l.next().value,
              p = l.next().value,
              w = new Uint8ClampedArray(b.buffer, g, m * p),
              q = n,
              u = r,
              t = 0;
            t < u;
            t++
          )
            for (var x = 0; x < q; x++) {
              var v = t * q + x,
                ba = 4 * v;
              k[v] =
                (eb.red * b[ba] +
                  eb.blue * b[ba + 1] +
                  eb.green * b[ba + 2] +
                  128) >>
                8;
            }
          for (
            var ib = "invert" === fb, jb = "both" === fb ? 2 : 1, E = 1;
            E <= jb;
            ++E
          ) {
            if (ib)
              for (var I = k, V = k, P = n, da = r, Ca = 0; Ca < da; Ca++)
                for (var Da = 0; Da < P; Da++) {
                  var kb = Ca * P + Da;
                  V[kb] = 255 - I[kb];
                }
            var Q = void 0,
              Ea = k,
              ea = h,
              M = w,
              W = n,
              Fa = r;
            ea = void 0 === ea ? Ea : ea;
            M = void 0 === M ? null : M;
            var Ga = Aa(db(W, Fa)),
              N = Ga.next().value,
              C = Ga.next().value,
              X = Ga.next().value;
            if (M) {
              if (!(M instanceof Uint8ClampedArray) || M.byteLength !== C * X)
                throw Error("QR Error: Illegal Buffer.");
              Q = M;
            } else Q = new Uint8ClampedArray(C * X);
            for (var R = 0; R < X; ++R)
              for (var S = 0; S < C; ++S) {
                for (
                  var J = 255,
                    Y = 0,
                    lb = Math.min(R * N, Fa - N) * W + Math.min(S * N, W - N),
                    mb = 0;
                  mb < N;
                  ++mb
                ) {
                  for (var Ha = 0; Ha < N; ++Ha) {
                    var fa = Ea[lb + Ha];
                    fa < J && (J = fa);
                    fa > Y && (Y = fa);
                  }
                  lb += W;
                }
                if (Y - J > gb) {
                  var nb = (J + Y) / 2;
                  var Ia = Math.min(255, nb + (J + Y) / 4, 1.1 * nb);
                } else if (0 === S || 0 === R) Ia = J - 1;
                else {
                  var Ja = R * C + S,
                    ob = (Q[Ja - 1] + Q[Ja - C] + C[Ja - C - 1]) / 3;
                  Ia = ob > J ? ob : J - 1;
                }
                Q[R * C + S] = Ia;
              }
            for (var ha = 0; ha < X; ++ha)
              for (var ia = 0; ia < C; ++ia) {
                for (var pb = 0, Ka = -2; 2 >= Ka; ++Ka)
                  for (var La = -2; 2 >= La; ++La)
                    pb +=
                      Q[
                        Math.max(0, Math.min(X - 1, ha + La)) * C +
                          Math.max(0, Math.min(C - 1, ia + Ka))
                      ];
                var qb = Ea,
                  Ma = W,
                  T = N,
                  bc = pb / 25,
                  ja = ea;
                ja = void 0 === ja ? qb : ja;
                for (
                  var rb =
                      Math.min(ha * T, Fa - T) * Ma + Math.min(ia * T, Ma - T),
                    sb = 0;
                  sb < T;
                  ++sb
                ) {
                  for (var Na = 0; Na < T; ++Na) {
                    var tb = rb + Na;
                    ja[tb] = qb[tb] <= bc;
                  }
                  rb += Ma;
                }
              }
            if (cb) {
              var ka = new ImageData(new Uint8ClampedArray(n * r * 4), n, r);
              for (var cc = h, la = ka, Oa = n, dc = r, ma = 0; ma < dc; ma++)
                for (var na = 0; na < Oa; na++) {
                  var oa = 4 * na + ma * Oa * 4,
                    Pa = cc[ma * Oa + na] ? 0 : 255;
                  la.data[oa] = Pa;
                  la.data[oa + 1] = Pa;
                  la.data[oa + 2] = Pa;
                  la.data[oa + 3] = 255;
                }
            }
            try {
              var ub = new hb(h).Oa();
              if (cb)
                for (
                  var Qa = ub, Ra = ka, fc = n, pa = 0;
                  pa < Qa.i.height;
                  pa++
                )
                  for (var qa = 0; qa < Qa.i.width; qa++) {
                    var Sa = 8 * qa + 2 * pa * fc * 4,
                      vb = Qa.i.ga(qa, pa);
                    Ra.data[Sa] = vb ? 0 : 255;
                    Ra.data[Sa + 1] = vb ? 0 : 255;
                    Ra.data[Sa + 2] = 255;
                  }
              break;
            } catch (D) {
              if (E === jb) throw D;
            } finally {
              cb &&
                self.postMessage({ type: "debugImage", data: ka }, [
                  ka.data.buffer,
                ]),
                (ib = !0);
            }
          }
          var Ta = new Lb(ub.i),
            Ua = Ta.Ba(),
            wb = Ta.Aa().Pa,
            ra = Ta.jb();
          if (ra.length != Ua.na) throw Error("QR Error: ArgumentException");
          for (
            var Va = Ua.Za(wb), xb = 0, sa = Va.da, A = 0;
            A < sa.length;
            A++
          )
            xb += sa[A].count;
          for (var B = Array(xb), ta = 0, z = 0; z < sa.length; z++) {
            var yb = sa[z];
            for (A = 0; A < yb.count; A++) {
              var zb = yb.ra,
                hc = Va.ka + zb;
              B[ta++] = new Mb(zb, Array(hc));
            }
          }
          for (
            var Ab = B[0].T.length, U = B.length - 1;
            0 <= U && B[U].T.length != Ab;

          )
            U--;
          U++;
          var Wa = Ab - Va.ka,
            Xa = 0;
          for (A = 0; A < Wa; A++)
            for (z = 0; z < ta; z++) B[z].T[A] = ra[Xa++];
          for (z = U; z < ta; z++) B[z].T[Wa] = ra[Xa++];
          var jc = B[0].T.length;
          for (A = Wa; A < jc; A++)
            for (z = 0; z < ta; z++) B[z].T[z < U ? A : A + 1] = ra[Xa++];
          for (var Bb = 0, O = 0; O < B.length; O++) Bb += B[O].ya;
          for (var Cb = Array(Bb), kc = 0, Ya = 0; Ya < B.length; Ya++) {
            for (
              var Db = B[Ya],
                Eb = Db.T,
                Fb = Db.ya,
                ua = Eb,
                Gb = Fb,
                Hb = ua.length,
                Za = Array(Hb),
                F = 0;
              F < Hb;
              F++
            )
              Za[F] = ua[F] & 255;
            var lc = ua.length - Gb;
            try {
              Nb.decode(Za, lc);
            } catch (D) {
              throw D;
            }
            for (F = 0; F < Gb; F++) ua[F] = Za[F];
            for (O = 0; O < Fb; O++) Cb[kc++] = Eb[O];
          }
          var $a = new Ob(Cb, Ua.oa, wb.i).Xa(),
            Ib = "";
          for (E = 0; E < $a.length; E++)
            for (var ab = 0; ab < $a[E].length; ab++)
              Ib += String.fromCharCode($a[E][ab]);
          var va = Ib;
          try {
            new URL(va);
            var Jb = !0;
          } catch (D) {
            Jb = !1;
          }
          if (Jb) {
            var wa = "";
            try {
              wa = escape(va);
            } catch (D) {
              console.log(D), (wa = va);
            }
            var bb = "";
            try {
              bb = decodeURIComponent(wa);
            } catch (D) {
              console.log(D), (bb = wa);
            }
            var Kb = bb;
          } else Kb = va;
          a = Kb;
        } catch (D) {
          if (!D.message.startsWith("QR Error")) throw D;
        } finally {
          self.postMessage({ type: "qrResult", data: a });
        }
        break;
      case "grayscaleWeights":
        if (256 !== c.red + c.green + c.blue)
          throw Error("Weights have to sum up to 256");
        eb = c;
        break;
      case "inversionMode":
        if ("original" !== c && "invert" !== c && "both" !== c)
          throw Error("Invalid inversion mode");
        fb = c;
        break;
      case "close":
        self.close();
    }
  };
  function db(d, c) {
    var a = Math.max(Math.floor(Math.min(d, c) / Pb), Qb);
    return [a, Math.ceil(d / a), Math.ceil(c / a)];
  }
  var Pb = 40,
    Qb = 16,
    gb = 12;
  function y(d, c) {
    this.count = d;
    this.ra = c;
  }
  function G(d, c, a) {
    this.ka = d;
    this.da = a ? [c, a] : Array(c);
  }
  function H(d, c, a, b, g, k) {
    this.oa = d;
    this.ca = c;
    this.da = [a, b, g, k];
    d = 0;
    c = a.ka;
    a = a.da;
    for (b = 0; b < a.length; b++) (g = a[b]), (d += g.count * (g.ra + c));
    this.na = d;
    this.fa = function () {
      return 17 + 4 * this.oa;
    };
    this.Ia = function () {
      var b = this.fa(),
        a = new Rb(b);
      a.P(0, 0, 9, 9);
      a.P(b - 8, 0, 8, 9);
      a.P(0, b - 8, 9, 8);
      for (var c = this.ca.length, g = 0; g < c; g++)
        for (var d = this.ca[g] - 2, k = 0; k < c; k++)
          (0 == g && (0 == k || k == c - 1)) ||
            (g == c - 1 && 0 == k) ||
            a.P(this.ca[k] - 2, d, 5, 5);
      a.P(6, 9, 1, b - 17);
      a.P(9, 6, b - 17, 1);
      6 < this.oa && (a.P(b - 11, 0, 3, 6), a.P(0, b - 11, 6, 3));
      return a;
    };
    this.Za = function (b) {
      return this.da[b.gb];
    };
  }
  var Sb = [
      31892, 34236, 39577, 42195, 48118, 51042, 55367, 58893, 63784, 68472,
      70749, 76311, 79154, 84390, 87683, 92361, 96236, 102084, 102881, 110507,
      110734, 117786, 119615, 126325, 127568, 133589, 136944, 141498, 145311,
      150283, 152622, 158308, 161089, 167017,
    ],
    Tb = [
      new H(
        1,
        [],
        new G(7, new y(1, 19)),
        new G(10, new y(1, 16)),
        new G(13, new y(1, 13)),
        new G(17, new y(1, 9)),
      ),
      new H(
        2,
        [6, 18],
        new G(10, new y(1, 34)),
        new G(16, new y(1, 28)),
        new G(22, new y(1, 22)),
        new G(28, new y(1, 16)),
      ),
      new H(
        3,
        [6, 22],
        new G(15, new y(1, 55)),
        new G(26, new y(1, 44)),
        new G(18, new y(2, 17)),
        new G(22, new y(2, 13)),
      ),
      new H(
        4,
        [6, 26],
        new G(20, new y(1, 80)),
        new G(18, new y(2, 32)),
        new G(26, new y(2, 24)),
        new G(16, new y(4, 9)),
      ),
      new H(
        5,
        [6, 30],
        new G(26, new y(1, 108)),
        new G(24, new y(2, 43)),
        new G(18, new y(2, 15), new y(2, 16)),
        new G(22, new y(2, 11), new y(2, 12)),
      ),
      new H(
        6,
        [6, 34],
        new G(18, new y(2, 68)),
        new G(16, new y(4, 27)),
        new G(24, new y(4, 19)),
        new G(28, new y(4, 15)),
      ),
      new H(
        7,
        [6, 22, 38],
        new G(20, new y(2, 78)),
        new G(18, new y(4, 31)),
        new G(18, new y(2, 14), new y(4, 15)),
        new G(26, new y(4, 13), new y(1, 14)),
      ),
      new H(
        8,
        [6, 24, 42],
        new G(24, new y(2, 97)),
        new G(22, new y(2, 38), new y(2, 39)),
        new G(22, new y(4, 18), new y(2, 19)),
        new G(26, new y(4, 14), new y(2, 15)),
      ),
      new H(
        9,
        [6, 26, 46],
        new G(30, new y(2, 116)),
        new G(22, new y(3, 36), new y(2, 37)),
        new G(20, new y(4, 16), new y(4, 17)),
        new G(24, new y(4, 12), new y(4, 13)),
      ),
      new H(
        10,
        [6, 28, 50],
        new G(18, new y(2, 68), new y(2, 69)),
        new G(26, new y(4, 43), new y(1, 44)),
        new G(24, new y(6, 19), new y(2, 20)),
        new G(28, new y(6, 15), new y(2, 16)),
      ),
      new H(
        11,
        [6, 30, 54],
        new G(20, new y(4, 81)),
        new G(30, new y(1, 50), new y(4, 51)),
        new G(28, new y(4, 22), new y(4, 23)),
        new G(24, new y(3, 12), new y(8, 13)),
      ),
      new H(
        12,
        [6, 32, 58],
        new G(24, new y(2, 92), new y(2, 93)),
        new G(22, new y(6, 36), new y(2, 37)),
        new G(26, new y(4, 20), new y(6, 21)),
        new G(28, new y(7, 14), new y(4, 15)),
      ),
      new H(
        13,
        [6, 34, 62],
        new G(26, new y(4, 107)),
        new G(22, new y(8, 37), new y(1, 38)),
        new G(24, new y(8, 20), new y(4, 21)),
        new G(22, new y(12, 11), new y(4, 12)),
      ),
      new H(
        14,
        [6, 26, 46, 66],
        new G(30, new y(3, 115), new y(1, 116)),
        new G(24, new y(4, 40), new y(5, 41)),
        new G(20, new y(11, 16), new y(5, 17)),
        new G(24, new y(11, 12), new y(5, 13)),
      ),
      new H(
        15,
        [6, 26, 48, 70],
        new G(22, new y(5, 87), new y(1, 88)),
        new G(24, new y(5, 41), new y(5, 42)),
        new G(30, new y(5, 24), new y(7, 25)),
        new G(24, new y(11, 12), new y(7, 13)),
      ),
      new H(
        16,
        [6, 26, 50, 74],
        new G(24, new y(5, 98), new y(1, 99)),
        new G(28, new y(7, 45), new y(3, 46)),
        new G(24, new y(15, 19), new y(2, 20)),
        new G(30, new y(3, 15), new y(13, 16)),
      ),
      new H(
        17,
        [6, 30, 54, 78],
        new G(28, new y(1, 107), new y(5, 108)),
        new G(28, new y(10, 46), new y(1, 47)),
        new G(28, new y(1, 22), new y(15, 23)),
        new G(28, new y(2, 14), new y(17, 15)),
      ),
      new H(
        18,
        [6, 30, 56, 82],
        new G(30, new y(5, 120), new y(1, 121)),
        new G(26, new y(9, 43), new y(4, 44)),
        new G(28, new y(17, 22), new y(1, 23)),
        new G(28, new y(2, 14), new y(19, 15)),
      ),
      new H(
        19,
        [6, 30, 58, 86],
        new G(28, new y(3, 113), new y(4, 114)),
        new G(26, new y(3, 44), new y(11, 45)),
        new G(26, new y(17, 21), new y(4, 22)),
        new G(26, new y(9, 13), new y(16, 14)),
      ),
      new H(
        20,
        [6, 34, 62, 90],
        new G(28, new y(3, 107), new y(5, 108)),
        new G(26, new y(3, 41), new y(13, 42)),
        new G(30, new y(15, 24), new y(5, 25)),
        new G(28, new y(15, 15), new y(10, 16)),
      ),
      new H(
        21,
        [6, 28, 50, 72, 94],
        new G(28, new y(4, 116), new y(4, 117)),
        new G(26, new y(17, 42)),
        new G(28, new y(17, 22), new y(6, 23)),
        new G(30, new y(19, 16), new y(6, 17)),
      ),
      new H(
        22,
        [6, 26, 50, 74, 98],
        new G(28, new y(2, 111), new y(7, 112)),
        new G(28, new y(17, 46)),
        new G(30, new y(7, 24), new y(16, 25)),
        new G(24, new y(34, 13)),
      ),
      new H(
        23,
        [6, 30, 54, 74, 102],
        new G(30, new y(4, 121), new y(5, 122)),
        new G(28, new y(4, 47), new y(14, 48)),
        new G(30, new y(11, 24), new y(14, 25)),
        new G(30, new y(16, 15), new y(14, 16)),
      ),
      new H(
        24,
        [6, 28, 54, 80, 106],
        new G(30, new y(6, 117), new y(4, 118)),
        new G(28, new y(6, 45), new y(14, 46)),
        new G(30, new y(11, 24), new y(16, 25)),
        new G(30, new y(30, 16), new y(2, 17)),
      ),
      new H(
        25,
        [6, 32, 58, 84, 110],
        new G(26, new y(8, 106), new y(4, 107)),
        new G(28, new y(8, 47), new y(13, 48)),
        new G(30, new y(7, 24), new y(22, 25)),
        new G(30, new y(22, 15), new y(13, 16)),
      ),
      new H(
        26,
        [6, 30, 58, 86, 114],
        new G(28, new y(10, 114), new y(2, 115)),
        new G(28, new y(19, 46), new y(4, 47)),
        new G(28, new y(28, 22), new y(6, 23)),
        new G(30, new y(33, 16), new y(4, 17)),
      ),
      new H(
        27,
        [6, 34, 62, 90, 118],
        new G(30, new y(8, 122), new y(4, 123)),
        new G(28, new y(22, 45), new y(3, 46)),
        new G(30, new y(8, 23), new y(26, 24)),
        new G(30, new y(12, 15), new y(28, 16)),
      ),
      new H(
        28,
        [6, 26, 50, 74, 98, 122],
        new G(30, new y(3, 117), new y(10, 118)),
        new G(28, new y(3, 45), new y(23, 46)),
        new G(30, new y(4, 24), new y(31, 25)),
        new G(30, new y(11, 15), new y(31, 16)),
      ),
      new H(
        29,
        [6, 30, 54, 78, 102, 126],
        new G(30, new y(7, 116), new y(7, 117)),
        new G(28, new y(21, 45), new y(7, 46)),
        new G(30, new y(1, 23), new y(37, 24)),
        new G(30, new y(19, 15), new y(26, 16)),
      ),
      new H(
        30,
        [6, 26, 52, 78, 104, 130],
        new G(30, new y(5, 115), new y(10, 116)),
        new G(28, new y(19, 47), new y(10, 48)),
        new G(30, new y(15, 24), new y(25, 25)),
        new G(30, new y(23, 15), new y(25, 16)),
      ),
      new H(
        31,
        [6, 30, 56, 82, 108, 134],
        new G(30, new y(13, 115), new y(3, 116)),
        new G(28, new y(2, 46), new y(29, 47)),
        new G(30, new y(42, 24), new y(1, 25)),
        new G(30, new y(23, 15), new y(28, 16)),
      ),
      new H(
        32,
        [6, 34, 60, 86, 112, 138],
        new G(30, new y(17, 115)),
        new G(28, new y(10, 46), new y(23, 47)),
        new G(30, new y(10, 24), new y(35, 25)),
        new G(30, new y(19, 15), new y(35, 16)),
      ),
      new H(
        33,
        [6, 30, 58, 86, 114, 142],
        new G(30, new y(17, 115), new y(1, 116)),
        new G(28, new y(14, 46), new y(21, 47)),
        new G(30, new y(29, 24), new y(19, 25)),
        new G(30, new y(11, 15), new y(46, 16)),
      ),
      new H(
        34,
        [6, 34, 62, 90, 118, 146],
        new G(30, new y(13, 115), new y(6, 116)),
        new G(28, new y(14, 46), new y(23, 47)),
        new G(30, new y(44, 24), new y(7, 25)),
        new G(30, new y(59, 16), new y(1, 17)),
      ),
      new H(
        35,
        [6, 30, 54, 78, 102, 126, 150],
        new G(30, new y(12, 121), new y(7, 122)),
        new G(28, new y(12, 47), new y(26, 48)),
        new G(30, new y(39, 24), new y(14, 25)),
        new G(30, new y(22, 15), new y(41, 16)),
      ),
      new H(
        36,
        [6, 24, 50, 76, 102, 128, 154],
        new G(30, new y(6, 121), new y(14, 122)),
        new G(28, new y(6, 47), new y(34, 48)),
        new G(30, new y(46, 24), new y(10, 25)),
        new G(30, new y(2, 15), new y(64, 16)),
      ),
      new H(
        37,
        [6, 28, 54, 80, 106, 132, 158],
        new G(30, new y(17, 122), new y(4, 123)),
        new G(28, new y(29, 46), new y(14, 47)),
        new G(30, new y(49, 24), new y(10, 25)),
        new G(30, new y(24, 15), new y(46, 16)),
      ),
      new H(
        38,
        [6, 32, 58, 84, 110, 136, 162],
        new G(30, new y(4, 122), new y(18, 123)),
        new G(28, new y(13, 46), new y(32, 47)),
        new G(30, new y(48, 24), new y(14, 25)),
        new G(30, new y(42, 15), new y(32, 16)),
      ),
      new H(
        39,
        [6, 26, 54, 82, 110, 138, 166],
        new G(30, new y(20, 117), new y(4, 118)),
        new G(28, new y(40, 47), new y(7, 48)),
        new G(30, new y(43, 24), new y(22, 25)),
        new G(30, new y(10, 15), new y(67, 16)),
      ),
      new H(
        40,
        [6, 30, 58, 86, 114, 142, 170],
        new G(30, new y(19, 118), new y(6, 119)),
        new G(28, new y(18, 47), new y(31, 48)),
        new G(30, new y(34, 24), new y(34, 25)),
        new G(30, new y(20, 15), new y(61, 16)),
      ),
    ];
  function Ub(d) {
    if (1 > d || 40 < d) throw Error("QR Error: ArgumentException");
    return Tb[d - 1];
  }
  function Vb(d) {
    for (var c = 4294967295, a = 0, b = 0; b < Sb.length; b++) {
      var g = Sb[b];
      if (g == d) return Ub(b + 7);
      g = Wb(d, g);
      g < c && ((a = b + 7), (c = g));
    }
    return 3 >= c ? Ub(a) : null;
  }
  function Xb(d, c, a, b, g, k, h, l, m) {
    this.o = d;
    this.s = b;
    this.u = h;
    this.v = c;
    this.w = g;
    this.A = l;
    this.B = a;
    this.C = k;
    this.D = m;
    this.sb = function (b) {
      for (
        var a = b.length,
          c = this.o,
          g = this.s,
          d = this.u,
          k = this.v,
          h = this.w,
          l = this.A,
          m = this.B,
          p = this.C,
          E = this.D,
          I = 0;
        I < a;
        I += 2
      ) {
        var V = b[I],
          P = b[I + 1],
          da = d * V + l * P + E;
        b[I] = (c * V + k * P + m) / da;
        b[I + 1] = (g * V + h * P + p) / da;
      }
    };
    this.Ha = function () {
      return new Xb(
        this.w * this.D - this.A * this.C,
        this.A * this.B - this.v * this.D,
        this.v * this.C - this.w * this.B,
        this.u * this.C - this.s * this.D,
        this.o * this.D - this.u * this.B,
        this.s * this.B - this.o * this.C,
        this.s * this.A - this.u * this.w,
        this.u * this.v - this.o * this.A,
        this.o * this.w - this.s * this.v,
      );
    };
    this.pb = function (b) {
      return new Xb(
        this.o * b.o + this.v * b.s + this.B * b.u,
        this.o * b.v + this.v * b.w + this.B * b.A,
        this.o * b.B + this.v * b.C + this.B * b.D,
        this.s * b.o + this.w * b.s + this.C * b.u,
        this.s * b.v + this.w * b.w + this.C * b.A,
        this.s * b.B + this.w * b.C + this.C * b.D,
        this.u * b.o + this.A * b.s + this.D * b.u,
        this.u * b.v + this.A * b.w + this.D * b.A,
        this.u * b.B + this.A * b.C + this.D * b.D,
      );
    };
  }
  function Yb(d, c, a, b, g, k, h, l) {
    var m = l - k,
      p = c - b + k - l;
    if (0 == m && 0 == p)
      return new Xb(a - d, g - a, d, b - c, k - b, c, 0, 0, 1);
    var w = a - g,
      q = h - g;
    g = d - a + g - h;
    k = b - k;
    var u = w * m - q * k;
    m = (g * m - q * p) / u;
    p = (w * p - g * k) / u;
    return new Xb(
      a - d + m * a,
      h - d + p * h,
      d,
      b - c + m * b,
      l - c + p * l,
      c,
      m,
      p,
      1,
    );
  }
  function Zb(d) {
    this.i = d;
  }
  function hb(d) {
    this.H = d;
    this.U = null;
    this.Ca = function (c, a, b, g) {
      var d = Math.abs(g - a) > Math.abs(b - c);
      if (d) {
        var h = c;
        c = a;
        a = h;
        h = b;
        b = g;
        g = h;
      }
      var l = Math.abs(b - c),
        m = Math.abs(g - a),
        p = -l >> 1,
        w = a < g ? 1 : -1,
        q = c < b ? 1 : -1,
        u = 0,
        t = c;
      for (h = a; t != b; t += q) {
        var x = d ? h : t,
          v = d ? t : h;
        1 == u ? this.H[x + v * n] && u++ : this.H[x + v * n] || u++;
        if (3 == u) return (g = t - c), (a = h - a), Math.sqrt(g * g + a * a);
        p += m;
        if (0 < p) {
          if (h == g) break;
          h += w;
          p -= l;
        }
      }
      c = b - c;
      a = g - a;
      return Math.sqrt(c * c + a * a);
    };
    this.Da = function (c, a, b, g) {
      var d = this.Ca(c, a, b, g),
        h = 1;
      b = c - (b - c);
      0 > b
        ? ((h = c / (c - b)), (b = 0))
        : b >= n && ((h = (n - 1 - c) / (b - c)), (b = n - 1));
      g = Math.floor(a - (g - a) * h);
      h = 1;
      0 > g
        ? ((h = a / (a - g)), (g = 0))
        : g >= r && ((h = (r - 1 - a) / (g - a)), (g = r - 1));
      b = Math.floor(c + (b - c) * h);
      d += this.Ca(c, a, b, g);
      return d - 1;
    };
    this.qa = function (c, a) {
      var b = this.Da(
        Math.floor(c.g()),
        Math.floor(c.h()),
        Math.floor(a.g()),
        Math.floor(a.h()),
      );
      c = this.Da(
        Math.floor(a.g()),
        Math.floor(a.h()),
        Math.floor(c.g()),
        Math.floor(c.h()),
      );
      return isNaN(b) ? c / 7 : isNaN(c) ? b / 7 : (b + c) / 14;
    };
    this.Ja = function (c, a, b) {
      return (this.qa(c, a) + this.qa(c, b)) / 2;
    };
    this.sa = function (c, a) {
      var b = c.g() - a.g();
      c = c.h() - a.h();
      return Math.sqrt(b * b + c * c);
    };
    this.Ka = function (c, a, b, g) {
      c =
        ((Math.round(this.sa(c, a) / g) + Math.round(this.sa(c, b) / g)) >> 1) +
        7;
      switch (c & 3) {
        case 0:
          c++;
          break;
        case 2:
          c--;
          break;
        case 3:
          throw Error("QR Error: in detector");
      }
      return c;
    };
    this.Qa = function (c, a, b, g) {
      g = Math.floor(g * c);
      var d = Math.max(0, a - g);
      a = Math.min(n - 1, a + g);
      if (a - d < 3 * c) throw Error("QR Error: in detector");
      var h = Math.max(0, b - g);
      return new $b(
        this.H,
        d,
        h,
        a - d,
        Math.min(r - 1, b + g) - h,
        c,
        this.U,
      ).find();
    };
    this.La = function (c, a, b, g, d) {
      d -= 3.5;
      var k;
      if (null != g) {
        var l = g.g();
        g = g.h();
        var m = (k = d - 3);
      } else
        (l = a.g() - c.g() + b.g()), (g = a.h() - c.h() + b.h()), (m = k = d);
      return Yb(c.g(), c.h(), a.g(), a.h(), l, g, b.g(), b.h()).pb(
        Yb(3.5, 3.5, d, 3.5, m, k, 3.5, d).Ha(),
      );
    };
    this.lb = function (c, a, b) {
      for (var g = new Rb(b), d = Array(b << 1), h = 0; h < b; h++) {
        for (var l = d.length, m = h + 0.5, p = 0; p < l; p += 2)
          (d[p] = (p >> 1) + 0.5), (d[p + 1] = m);
        a.sb(d);
        m = d;
        for (var w = n, q = r, u = !0, t = 0; t < m.length && u; t += 2) {
          var x = Math.floor(m[t]),
            v = Math.floor(m[t + 1]);
          if (-1 > x || x > w || -1 > v || v > q)
            throw Error("QR Error: Error.checkAndNudgePoints");
          u = !1;
          -1 == x
            ? ((m[t] = 0), (u = !0))
            : x == w && ((m[t] = w - 1), (u = !0));
          -1 == v
            ? ((m[t + 1] = 0), (u = !0))
            : v == q && ((m[t + 1] = q - 1), (u = !0));
        }
        u = !0;
        for (t = m.length - 2; 0 <= t && u; t -= 2) {
          x = Math.floor(m[t]);
          v = Math.floor(m[t + 1]);
          if (-1 > x || x > w || -1 > v || v > q)
            throw Error("QR Error: Error.checkAndNudgePoints");
          u = !1;
          -1 == x
            ? ((m[t] = 0), (u = !0))
            : x == w && ((m[t] = w - 1), (u = !0));
          -1 == v
            ? ((m[t + 1] = 0), (u = !0))
            : v == q && ((m[t + 1] = q - 1), (u = !0));
        }
        try {
          for (p = 0; p < l; p += 2)
            c[Math.floor(d[p]) + n * Math.floor(d[p + 1])] && g.nb(p >> 1, h);
        } catch (ba) {
          throw Error("QR Error: Error.checkAndNudgePoints");
        }
      }
      return g;
    };
    this.ib = function (c) {
      var a = c.qb,
        b = c.rb;
      c = c.Ga;
      var g = this.Ja(a, b, c);
      if (1 > g) throw Error("QR Error: in detector");
      var d = this.Ka(a, b, c, g);
      if (1 != d % 4)
        throw Error("QR Error: Error getProvisionalVersionForDimension");
      try {
        var h = Ub((d - 17) >> 2);
      } catch (w) {
        throw Error("QR Error: Error getVersionForNumber");
      }
      var l = h.fa() - 7,
        m = null;
      if (0 < h.ca.length) {
        l = 1 - 3 / l;
        h = Math.floor(a.g() + l * (b.g() - a.g() + c.g() - a.g()));
        l = Math.floor(a.h() + l * (b.h() - a.h() + c.h() - a.h()));
        for (var p = 4; 16 >= p; p <<= 1)
          try {
            m = this.Qa(g, h, l, p);
            break;
          } catch (w) {}
      }
      a = this.lb(this.H, this.La(a, b, c, m, d), d);
      return new Zb(a);
    };
    this.Oa = function () {
      var c = new ac().Ta(this.H);
      return this.ib(c);
    };
  }
  var ec = [
      [21522, 0],
      [20773, 1],
      [24188, 2],
      [23371, 3],
      [17913, 4],
      [16590, 5],
      [20375, 6],
      [19104, 7],
      [30660, 8],
      [29427, 9],
      [32170, 10],
      [30877, 11],
      [26159, 12],
      [25368, 13],
      [27713, 14],
      [26998, 15],
      [5769, 16],
      [5054, 17],
      [7399, 18],
      [6608, 19],
      [1890, 20],
      [597, 21],
      [3340, 22],
      [2107, 23],
      [13663, 24],
      [12392, 25],
      [16177, 26],
      [14854, 27],
      [9396, 28],
      [8579, 29],
      [11994, 30],
      [11245, 31],
    ],
    K = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];
  function gc(d) {
    var c = (d >> 3) & 3;
    if (0 > c || c >= ic.length) throw Error("QR Error: ArgumentException");
    this.Pa = ic[c];
    this.Na = d & 7;
  }
  function Wb(d, c) {
    d ^= c;
    return (
      K[d & 15] +
      K[L(d, 4) & 15] +
      K[L(d, 8) & 15] +
      K[L(d, 12) & 15] +
      K[L(d, 16) & 15] +
      K[L(d, 20) & 15] +
      K[L(d, 24) & 15] +
      K[L(d, 28) & 15]
    );
  }
  function mc(d) {
    var c = nc(d);
    return null != c ? c : nc(d ^ 21522);
  }
  function nc(d) {
    for (var c = 4294967295, a = 0, b = 0; b < ec.length; b++) {
      var g = ec[b],
        k = g[0];
      if (k == d) return new gc(g[1]);
      k = Wb(d, k);
      k < c && ((a = g[1]), (c = k));
    }
    return 3 >= c ? new gc(a) : null;
  }
  function oc(d, c, a) {
    this.gb = d;
    this.i = c;
    this.name = a;
    this.getName = function () {
      return this.name;
    };
  }
  var ic = [
    new oc(1, 0, "M"),
    new oc(0, 1, "L"),
    new oc(3, 2, "H"),
    new oc(2, 3, "Q"),
  ];
  function Rb(d) {
    var c;
    c || (c = d);
    if (1 > d || 1 > c)
      throw Error("QR Error: Both dimensions must be greater than 0");
    this.width = d;
    this.height = c;
    var a = d >> 5;
    0 != (d & 31) && a++;
    this.X = a;
    this.i = Array(a * c);
    for (d = 0; d < this.i.length; d++) this.i[d] = 0;
    this.ea = function () {
      if (this.width != this.height)
        throw Error(
          "QR Error: Can't call getDimension() on a non-square matrix",
        );
      return this.width;
    };
    this.ga = function (b, a) {
      return 0 != (L(this.i[a * this.X + (b >> 5)], b & 31) & 1);
    };
    this.nb = function (b, a) {
      this.i[a * this.X + (b >> 5)] |= 1 << (b & 31);
    };
    this.M = function (b, a) {
      this.i[a * this.X + (b >> 5)] ^= 1 << (b & 31);
    };
    this.clear = function () {
      for (var b = this.i.length, a = 0; a < b; a++) this.i[a] = 0;
    };
    this.P = function (b, a, c, d) {
      if (0 > a || 0 > b)
        throw Error("QR Error: Left and top must be nonnegative");
      if (1 > d || 1 > c)
        throw Error("QR Error: Height and width must be at least 1");
      c = b + c;
      d = a + d;
      if (d > this.height || c > this.width)
        throw Error("QR Error: The region must fit inside the matrix");
      for (; a < d; a++)
        for (var g = a * this.X, k = b; k < c; k++)
          this.i[g + (k >> 5)] |= 1 << (k & 31);
    };
  }
  function Mb(d, c) {
    this.ya = d;
    this.T = c;
  }
  function Lb(d) {
    var c = d.ea();
    if (21 > c || 1 != (c & 3)) throw Error("QR Error: Error BitMatrixParser");
    this.V = d;
    this.O = this.J = null;
    this.K = function (a, b, c) {
      return this.V.ga(a, b) ? (c << 1) | 1 : c << 1;
    };
    this.Aa = function () {
      if (null != this.O) return this.O;
      for (var a = 0, b = 0; 6 > b; b++) a = this.K(b, 8, a);
      a = this.K(7, 8, a);
      a = this.K(8, 8, a);
      a = this.K(8, 7, a);
      for (b = 5; 0 <= b; b--) a = this.K(8, b, a);
      this.O = mc(a);
      if (null != this.O) return this.O;
      var c = this.V.ea();
      a = 0;
      var d = c - 8;
      for (b = c - 1; b >= d; b--) a = this.K(b, 8, a);
      for (b = c - 7; b < c; b++) a = this.K(8, b, a);
      this.O = mc(a);
      if (null != this.O) return this.O;
      throw Error("QR Error: Error readFormatInformation");
    };
    this.Ba = function () {
      if (null != this.J) return this.J;
      var a = this.V.ea(),
        b = (a - 17) >> 2;
      if (6 >= b) return Ub(b);
      b = 0;
      for (var c = a - 11, d = 5; 0 <= d; d--)
        for (var h = a - 9; h >= c; h--) b = this.K(h, d, b);
      this.J = Vb(b);
      if (null != this.J && this.J.fa() == a) return this.J;
      b = 0;
      for (h = 5; 0 <= h; h--) for (d = a - 9; d >= c; d--) b = this.K(h, d, b);
      this.J = Vb(b);
      if (null != this.J && this.J.fa() == a) return this.J;
      throw Error("QR Error: Error readVersion");
    };
    this.jb = function () {
      var a = this.Aa(),
        b = this.Ba();
      a = a.Na;
      if (0 > a || 7 < a) throw Error("QR Error: System.ArgumentException");
      var c = pc[a];
      a = this.V.ea();
      c.R(this.V, a);
      c = b.Ia();
      for (
        var d = !0, h = Array(b.na), l = 0, m = 0, p = 0, w = a - 1;
        0 < w;
        w -= 2
      ) {
        6 == w && w--;
        for (var q = 0; q < a; q++)
          for (var u = d ? a - 1 - q : q, t = 0; 2 > t; t++)
            c.ga(w - t, u) ||
              (p++,
              (m <<= 1),
              this.V.ga(w - t, u) && (m |= 1),
              8 == p && ((h[l++] = m), (m = p = 0)));
        d ^= 1;
      }
      if (l != b.na) throw Error("QR Error: Error readCodewords");
      return h;
    };
  }
  var pc = [
    new (function () {
      this.R = function (d, c) {
        for (var a = 0; a < c; a++)
          for (var b = 0; b < c; b++) this.j(a, b) && d.M(b, a);
      };
      this.j = function (d, c) {
        return 0 == ((d + c) & 1);
      };
    })(),
    new (function () {
      this.R = function (d, c) {
        for (var a = 0; a < c; a++)
          for (var b = 0; b < c; b++) this.j(a, b) && d.M(b, a);
      };
      this.j = function (d) {
        return 0 == (d & 1);
      };
    })(),
    new (function () {
      this.R = function (d, c) {
        for (var a = 0; a < c; a++)
          for (var b = 0; b < c; b++) this.j(a, b) && d.M(b, a);
      };
      this.j = function (d, c) {
        return 0 == c % 3;
      };
    })(),
    new (function () {
      this.R = function (d, c) {
        for (var a = 0; a < c; a++)
          for (var b = 0; b < c; b++) this.j(a, b) && d.M(b, a);
      };
      this.j = function (d, c) {
        return 0 == (d + c) % 3;
      };
    })(),
    new (function () {
      this.R = function (d, c) {
        for (var a = 0; a < c; a++)
          for (var b = 0; b < c; b++) this.j(a, b) && d.M(b, a);
      };
      this.j = function (d, c) {
        return 0 == ((L(d, 1) + c / 3) & 1);
      };
    })(),
    new (function () {
      this.R = function (d, c) {
        for (var a = 0; a < c; a++)
          for (var b = 0; b < c; b++) this.j(a, b) && d.M(b, a);
      };
      this.j = function (d, c) {
        d *= c;
        return 0 == (d & 1) + (d % 3);
      };
    })(),
    new (function () {
      this.R = function (d, c) {
        for (var a = 0; a < c; a++)
          for (var b = 0; b < c; b++) this.j(a, b) && d.M(b, a);
      };
      this.j = function (d, c) {
        d *= c;
        return 0 == (((d & 1) + (d % 3)) & 1);
      };
    })(),
    new (function () {
      this.R = function (d, c) {
        for (var a = 0; a < c; a++)
          for (var b = 0; b < c; b++) this.j(a, b) && d.M(b, a);
      };
      this.j = function (d, c) {
        return 0 == ((((d + c) & 1) + ((d * c) % 3)) & 1);
      };
    })(),
  ];
  function Z(d, c) {
    if (null == c || 0 == c.length)
      throw Error("QR Error: System.ArgumentException");
    this.a = d;
    var a = c.length;
    if (1 < a && 0 == c[0]) {
      for (var b = 1; b < a && 0 == c[b]; ) b++;
      if (b == a) this.f = d.l().f;
      else {
        this.f = Array(a - b);
        for (a = 0; a < this.f.length; a++) this.f[a] = 0;
        for (a = 0; a < this.f.length; a++) this.f[a] = c[b + a];
      }
    } else this.f = c;
    this.l = function () {
      return 0 == this.f[0];
    };
    this.I = function () {
      return this.f.length - 1;
    };
    this.Z = function (b) {
      return this.f[this.f.length - 1 - b];
    };
    this.la = function (b) {
      if (0 == b) return this.Z(0);
      var a = this.f.length;
      if (1 == b) {
        for (var c = (b = 0); c < a; c++) b ^= this.f[c];
        return b;
      }
      var d = this.f[0];
      for (c = 1; c < a; c++) d = qc(this.a.multiply(b, d), this.f[c]);
      return d;
    };
    this.ba = function (b) {
      if (this.a != b.a)
        throw Error("QR Error: GF256Polys do not have same GF256 field");
      if (this.l()) return b;
      if (b.l()) return this;
      var a = this.f;
      b = b.f;
      if (a.length > b.length) {
        var c = a;
        a = b;
        b = c;
      }
      c = Array(b.length);
      for (var g = b.length - a.length, m = 0; m < g; m++) c[m] = b[m];
      for (m = g; m < b.length; m++) c[m] = a[m - g] ^ b[m];
      return new Z(d, c);
    };
    this.wa = function (b) {
      if (this.a != b.a)
        throw Error("QR Error: GF256Polys do not have same GF256 field");
      if (this.l() || b.l()) return this.a.l();
      var a = this.f,
        c = a.length;
      b = b.f;
      for (var d = b.length, g = Array(c + d - 1), p = 0; p < c; p++)
        for (var w = a[p], q = 0; q < d; q++)
          g[p + q] = qc(g[p + q], this.a.multiply(w, b[q]));
      return new Z(this.a, g);
    };
    this.xa = function (b) {
      if (0 == b) return this.a.l();
      if (1 == b) return this;
      for (var a = this.f.length, c = Array(a), d = 0; d < a; d++)
        c[d] = this.a.multiply(this.f[d], b);
      return new Z(this.a, c);
    };
    this.eb = function (b, a) {
      if (0 > b) throw Error("QR Error: System.ArgumentException");
      if (0 == a) return this.a.l();
      var c = this.f.length;
      b = Array(c + b);
      for (var d = 0; d < b.length; d++) b[d] = 0;
      for (d = 0; d < c; d++) b[d] = this.a.multiply(this.f[d], a);
      return new Z(this.a, b);
    };
  }
  function rc(d) {
    this.Y = Array(256);
    this.aa = Array(256);
    for (var c = 1, a = 0; 256 > a; a++)
      (this.Y[a] = c), (c <<= 1), 256 <= c && (c ^= d);
    for (a = 0; 255 > a; a++) this.aa[this.Y[a]] = a;
    d = Array(1);
    d[0] = 0;
    this.Ea = new Z(this, Array(d));
    d = Array(1);
    d[0] = 1;
    this.za = new Z(this, Array(d));
    this.l = function () {
      return this.Ea;
    };
    this.pa = function (b, a) {
      if (0 > b) throw Error("QR Error: System.ArgumentException");
      if (0 == a) return this.Ea;
      b = Array(b + 1);
      for (var c = 0; c < b.length; c++) b[c] = 0;
      b[0] = a;
      return new Z(this, b);
    };
    this.exp = function (b) {
      return this.Y[b];
    };
    this.log = function (b) {
      if (0 == b) throw Error("QR Error: System.ArgumentException");
      return this.aa[b];
    };
    this.inverse = function (b) {
      if (0 == b) throw Error("QR Error: System.ArithmeticException");
      return this.Y[255 - this.aa[b]];
    };
    this.multiply = function (b, a) {
      return 0 == b || 0 == a
        ? 0
        : 1 == b
          ? a
          : 1 == a
            ? b
            : this.Y[(this.aa[b] + this.aa[a]) % 255];
    };
  }
  var sc = new rc(285);
  new rc(301);
  function qc(d, c) {
    return d ^ c;
  }
  var Nb = new (function (d) {
    this.a = d;
    this.decode = function (c, a) {
      for (var b = new Z(this.a, c), d = Array(a), k = 0; k < d.length; k++)
        d[k] = 0;
      var h = !0;
      for (k = 0; k < a; k++) {
        var l = b.la(this.a.exp(k));
        d[d.length - 1 - k] = l;
        0 != l && (h = !1);
      }
      if (!h)
        for (
          k = new Z(this.a, d),
            a = this.kb(this.a.pa(a, 1), k, a),
            k = a[1],
            a = this.Ra(a[0]),
            b = this.Sa(k, a),
            k = 0;
          k < a.length;
          k++
        ) {
          d = c.length - 1 - this.a.log(a[k]);
          if (0 > d)
            throw Error("QR Error: ReedSolomonException Bad error location");
          c[d] ^= b[k];
        }
    };
    this.kb = function (c, a, b) {
      if (c.I() < a.I()) {
        var d = c;
        c = a;
        a = d;
      }
      d = this.a.za;
      for (
        var k = this.a.l(), h = this.a.l(), l = this.a.za;
        a.I() >= Math.floor(b / 2);

      ) {
        var m = c,
          p = d,
          w = h;
        c = a;
        d = k;
        h = l;
        if (c.l()) throw Error("QR Error: r_{i-1} was zero");
        a = m;
        l = this.a.l();
        for (k = this.a.inverse(c.Z(c.I())); a.I() >= c.I() && !a.l(); ) {
          m = a.I() - c.I();
          var q = this.a.multiply(a.Z(a.I()), k);
          l = l.ba(this.a.pa(m, q));
          a = a.ba(c.eb(m, q));
        }
        k = l.wa(d).ba(p);
        l = l.wa(h).ba(w);
      }
      b = l.Z(0);
      if (0 == b)
        throw Error("QR Error: ReedSolomonException sigmaTilde(0) was zero");
      b = this.a.inverse(b);
      c = l.xa(b);
      b = a.xa(b);
      return [c, b];
    };
    this.Ra = function (c) {
      var a = c.I();
      if (1 == a) return Array(c.Z(1));
      for (var b = Array(a), d = 0, k = 1; 256 > k && d < a; k++)
        0 == c.la(k) && ((b[d] = this.a.inverse(k)), d++);
      if (d != a)
        throw Error(
          "QR Error: Error locator degree does not match number of roots",
        );
      return b;
    };
    this.Sa = function (c, a) {
      for (var b = a.length, d = Array(b), k = 0; k < b; k++) {
        for (var h = this.a.inverse(a[k]), l = 1, m = 0; m < b; m++)
          k != m && (l = this.a.multiply(l, qc(1, this.a.multiply(a[m], h))));
        d[k] = this.a.multiply(c.la(h), this.a.inverse(l));
      }
      return d;
    };
  })(sc);
  var n = 0,
    r = 0,
    cb = !1,
    tc = [
      [10, 9, 8, 8],
      [12, 11, 16, 10],
      [14, 13, 16, 12],
    ],
    eb = { red: 77, blue: 150, green: 29 },
    fb = "original";
  function L(d, c) {
    return 0 <= d ? d >> c : (d >> c) + (2 << ~c);
  }
  var uc = 3,
    vc = 57,
    wc = 2;
  function xc(d) {
    function c(b, a) {
      var c = b.g() - a.g();
      b = b.h() - a.h();
      return Math.sqrt(c * c + b * b);
    }
    var a = c(d[0], d[1]),
      b = c(d[1], d[2]),
      g = c(d[0], d[2]);
    b >= a && b >= g
      ? ((b = d[0]), (a = d[1]), (g = d[2]))
      : g >= b && g >= a
        ? ((b = d[1]), (a = d[0]), (g = d[2]))
        : ((b = d[2]), (a = d[0]), (g = d[1]));
    if (
      0 >
      (function (b, a, c) {
        var d = a.x;
        a = a.y;
        return (c.x - d) * (b.y - a) - (c.y - a) * (b.x - d);
      })(a, b, g)
    ) {
      var k = a;
      a = g;
      g = k;
    }
    d[0] = a;
    d[1] = b;
    d[2] = g;
  }
  function yc(d, c, a) {
    this.x = d;
    this.y = c;
    this.count = 1;
    this.G = a;
    this.g = function () {
      return this.x;
    };
    this.h = function () {
      return this.y;
    };
    this.va = function () {
      this.count++;
    };
    this.ha = function (b, a, c) {
      return Math.abs(a - this.y) <= b && Math.abs(c - this.x) <= b
        ? ((b = Math.abs(b - this.G)), 1 >= b || 1 >= b / this.G)
        : !1;
    };
  }
  function zc(d) {
    this.Ga = d[0];
    this.qb = d[1];
    this.rb = d[2];
  }
  function ac() {
    this.H = null;
    this.c = [];
    this.ma = !1;
    this.L = [0, 0, 0, 0, 0];
    this.U = null;
    this.ta = function () {
      this.L[0] = 0;
      this.L[1] = 0;
      this.L[2] = 0;
      this.L[3] = 0;
      this.L[4] = 0;
      return this.L;
    };
    this.N = function (d) {
      for (var c = 0, a = 0; 5 > a; a++) {
        var b = d[a];
        if (0 == b) return !1;
        c += b;
      }
      if (7 > c) return !1;
      c = Math.floor(c / 7);
      a = Math.floor(0.7 * c);
      return (
        Math.abs(c - d[0]) < a &&
        Math.abs(c - d[1]) < a &&
        Math.abs(3 * c - d[2]) < 3 * a &&
        Math.abs(c - d[3]) < a &&
        Math.abs(c - d[4]) < a
      );
    };
    this.W = function (d, c) {
      return c - d[4] - d[3] - d[2] / 2;
    };
    this.ia = function (d, c, a, b) {
      for (
        var g = this.H, k = r, h = this.ta(), l = d;
        0 <= l && g[c + l * n];

      )
        h[2]++, l--;
      if (0 > l) return NaN;
      for (; 0 <= l && !g[c + l * n] && h[1] <= a; ) h[1]++, l--;
      if (0 > l || h[1] > a) return NaN;
      for (; 0 <= l && g[c + l * n] && h[0] <= a; ) h[0]++, l--;
      if (h[0] > a) return NaN;
      for (l = d + 1; l < k && g[c + l * n]; ) h[2]++, l++;
      if (l == k) return NaN;
      for (; l < k && !g[c + l * n] && h[3] < a; ) h[3]++, l++;
      if (l == k || h[3] >= a) return NaN;
      for (; l < k && g[c + l * n] && h[4] < a; ) h[4]++, l++;
      return h[4] >= a ||
        5 * Math.abs(h[0] + h[1] + h[2] + h[3] + h[4] - b) >= 2 * b
        ? NaN
        : this.N(h)
          ? this.W(h, l)
          : NaN;
    };
    this.Ma = function (d, c, a, b) {
      for (
        var g = this.H, k = n, h = this.ta(), l = d;
        0 <= l && g[l + c * n];

      )
        h[2]++, l--;
      if (0 > l) return NaN;
      for (; 0 <= l && !g[l + c * n] && h[1] <= a; ) h[1]++, l--;
      if (0 > l || h[1] > a) return NaN;
      for (; 0 <= l && g[l + c * n] && h[0] <= a; ) h[0]++, l--;
      if (h[0] > a) return NaN;
      for (l = d + 1; l < k && g[l + c * n]; ) h[2]++, l++;
      if (l == k) return NaN;
      for (; l < k && !g[l + c * n] && h[3] < a; ) h[3]++, l++;
      if (l == k || h[3] >= a) return NaN;
      for (; l < k && g[l + c * n] && h[4] < a; ) h[4]++, l++;
      return h[4] >= a ||
        5 * Math.abs(h[0] + h[1] + h[2] + h[3] + h[4] - b) >= b
        ? NaN
        : this.N(h)
          ? this.W(h, l)
          : NaN;
    };
    this.$ = function (d, c, a) {
      var b = d[0] + d[1] + d[2] + d[3] + d[4];
      a = this.W(d, a);
      c = this.ia(c, Math.floor(a), d[2], b);
      if (
        !isNaN(c) &&
        ((a = this.Ma(Math.floor(a), Math.floor(c), d[2], b)), !isNaN(a))
      ) {
        d = b / 7;
        b = !1;
        for (var g = this.c.length, k = 0; k < g; k++) {
          var h = this.c[k];
          if (h.ha(d, c, a)) {
            h.va();
            b = !0;
            break;
          }
        }
        b ||
          ((a = new yc(a, c, d)),
          this.c.push(a),
          null != this.U && this.U.Va(a));
        return !0;
      }
      return !1;
    };
    this.mb = function () {
      var d = this.c.length;
      if (3 > d)
        throw Error(
          "QR Error: Couldn't find enough finder patterns (found " + d + ")",
        );
      if (3 < d) {
        for (var c = 0, a = 0, b = 0; b < d; b++) {
          var g = this.c[b].G;
          c += g;
          a += g * g;
        }
        var k = c / d;
        this.c.sort(function (b, a) {
          a = Math.abs(a.G - k);
          b = Math.abs(b.G - k);
          return a < b ? -1 : a == b ? 0 : 1;
        });
        d = Math.max(0.2 * k, Math.sqrt(a / d - k * k));
        for (b = this.c.length - 1; 0 <= b; b--)
          Math.abs(this.c[b].G - k) > d && this.c.splice(b, 1);
      }
      3 < this.c.length &&
        this.c.sort(function (b, a) {
          return b.count > a.count ? -1 : b.count < a.count ? 1 : 0;
        });
      return [this.c[0], this.c[1], this.c[2]];
    };
    this.Ua = function () {
      var d = this.c.length;
      if (1 >= d) return 0;
      for (var c = null, a = 0; a < d; a++) {
        var b = this.c[a];
        if (b.count >= wc)
          if (null == c) c = b;
          else
            return (
              (this.ma = !0),
              Math.floor(
                (Math.abs(c.g() - b.g()) - Math.abs(c.h() - b.h())) / 2,
              )
            );
      }
      return 0;
    };
    this.ua = function () {
      for (var d = 0, c = 0, a = this.c.length, b = 0; b < a; b++) {
        var g = this.c[b];
        g.count >= wc && (d++, (c += g.G));
      }
      if (3 > d) return !1;
      d = c / a;
      var k = 0;
      for (b = 0; b < a; b++) (g = this.c[b]), (k += Math.abs(g.G - d));
      return k <= 0.05 * c;
    };
    this.Ta = function (d) {
      this.H = d;
      var c = r,
        a = n,
        b = Math.floor((3 * c) / (4 * vc));
      b < uc && (b = uc);
      for (var g = !1, k = Array(5), h = b - 1; h < c && !g; h += b) {
        k[0] = 0;
        k[1] = 0;
        k[2] = 0;
        k[3] = 0;
        for (var l = (k[4] = 0), m = 0; m < a; m++)
          if (d[m + h * n]) 1 == (l & 1) && l++, k[l]++;
          else if (0 == (l & 1))
            if (4 == l)
              if (this.N(k)) {
                if ((l = this.$(k, h, m)))
                  (b = 2),
                    this.ma
                      ? (g = this.ua())
                      : ((l = this.Ua()),
                        l > k[2] && ((h += l - k[2] - b), (m = a - 1)));
                else {
                  do m++;
                  while (m < a && !d[m + h * n]);
                  m--;
                }
                l = 0;
                k[0] = 0;
                k[1] = 0;
                k[2] = 0;
                k[3] = 0;
                k[4] = 0;
              } else
                (k[0] = k[2]),
                  (k[1] = k[3]),
                  (k[2] = k[4]),
                  (k[3] = 1),
                  (k[4] = 0),
                  (l = 3);
            else k[++l]++;
          else k[l]++;
        this.N(k) &&
          (l = this.$(k, h, a)) &&
          ((b = k[0]), this.ma && (g = this.ua()));
      }
      d = this.mb();
      xc(d);
      return new zc(d);
    };
  }
  function Ac(d, c, a) {
    this.x = d;
    this.y = c;
    this.count = 1;
    this.G = a;
    this.g = function () {
      return Math.floor(this.x);
    };
    this.h = function () {
      return Math.floor(this.y);
    };
    this.va = function () {
      this.count++;
    };
    this.ha = function (b, a, c) {
      return Math.abs(a - this.y) <= b && Math.abs(c - this.x) <= b
        ? ((b = Math.abs(b - this.G)), 1 >= b || 1 >= b / this.G)
        : !1;
    };
  }
  function $b(d, c, a, b, g, k, h) {
    this.H = d;
    this.c = [];
    this.ob = c;
    this.width = b;
    this.height = g;
    this.cb = k;
    this.L = [0, 0, 0];
    this.U = h;
    this.W = function (b, a) {
      return a - b[2] - b[1] / 2;
    };
    this.N = function (b) {
      for (var a = this.cb, c = a / 2, d = 0; 3 > d; d++)
        if (Math.abs(a - b[d]) >= c) return !1;
      return !0;
    };
    this.ia = function (b, a, c, d) {
      var g = this.H,
        k = r,
        h = this.L;
      h[0] = 0;
      h[1] = 0;
      h[2] = 0;
      for (var l = b; 0 <= l && g[a + l * n] && h[1] <= c; ) h[1]++, l--;
      if (0 > l || h[1] > c) return NaN;
      for (; 0 <= l && !g[a + l * n] && h[0] <= c; ) h[0]++, l--;
      if (h[0] > c) return NaN;
      for (l = b + 1; l < k && g[a + l * n] && h[1] <= c; ) h[1]++, l++;
      if (l == k || h[1] > c) return NaN;
      for (; l < k && !g[a + l * n] && h[2] <= c; ) h[2]++, l++;
      return h[2] > c || 5 * Math.abs(h[0] + h[1] + h[2] - d) >= 2 * d
        ? NaN
        : this.N(h)
          ? this.W(h, l)
          : NaN;
    };
    this.$ = function (b, a, c) {
      c = this.W(b, c);
      a = this.ia(a, Math.floor(c), 2 * b[1], b[0] + b[1] + b[2]);
      if (!isNaN(a)) {
        b = (b[0] + b[1] + b[2]) / 3;
        for (var d = this.c.length, g = 0; g < d; g++)
          if (this.c[g].ha(b, a, c)) return new Ac(c, a, b);
        c = new Ac(c, a, b);
        this.c.push(c);
        null != this.U && this.U.Va(c);
      }
      return null;
    };
    this.find = function () {
      for (
        var c = this.ob,
          g = this.height,
          k = c + b,
          h = a + (g >> 1),
          q = [0, 0, 0],
          u = 0;
        u < g;
        u++
      ) {
        var t = h + (0 == (u & 1) ? (u + 1) >> 1 : -((u + 1) >> 1));
        q[0] = 0;
        q[1] = 0;
        q[2] = 0;
        for (var x = c; x < k && !d[x + n * t]; ) x++;
        for (var v = 0; x < k; ) {
          if (d[x + t * n])
            if (1 == v) q[v]++;
            else if (2 == v) {
              if (this.N(q) && ((v = this.$(q, t, x)), null != v)) return v;
              q[0] = q[2];
              q[1] = 1;
              q[2] = 0;
              v = 1;
            } else q[++v]++;
          else 1 == v && v++, q[v]++;
          x++;
        }
        if (this.N(q) && ((v = this.$(q, t, k)), null != v)) return v;
      }
      if (0 != this.c.length) return this.c[0];
      throw Error("QR Error: Couldn't find enough alignment patterns");
    };
  }
  function Ob(d, c, a) {
    this.F = 0;
    this.b = 7;
    this.S = d;
    this.fb = a;
    9 >= c
      ? (this.ja = 0)
      : 10 <= c && 26 >= c
        ? (this.ja = 1)
        : 27 <= c && 40 >= c && (this.ja = 2);
    this.m = function (b) {
      var a;
      if (b < this.b + 1) {
        var c = 0;
        for (a = 0; a < b; a++) c += 1 << a;
        c <<= this.b - b + 1;
        a = (this.S[this.F] & c) >> (this.b - b + 1);
        this.b -= b;
        return a;
      }
      if (b < this.b + 1 + 8) {
        var d = 0;
        for (a = 0; a < this.b + 1; a++) d += 1 << a;
        a = (this.S[this.F] & d) << (b - (this.b + 1));
        this.F++;
        a += this.S[this.F] >> (8 - (b - (this.b + 1)));
        this.b -= b % 8;
        0 > this.b && (this.b = 8 + this.b);
        return a;
      }
      if (b < this.b + 1 + 16) {
        for (a = c = d = 0; a < this.b + 1; a++) d += 1 << a;
        d = (this.S[this.F] & d) << (b - (this.b + 1));
        this.F++;
        var l = this.S[this.F] << (b - (this.b + 1 + 8));
        this.F++;
        for (a = 0; a < b - (this.b + 1 + 8); a++) c += 1 << a;
        c <<= 8 - (b - (this.b + 1 + 8));
        a = d + l + ((this.S[this.F] & c) >> (8 - (b - (this.b + 1 + 8))));
        this.b -= (b - 8) % 8;
        0 > this.b && (this.b = 8 + this.b);
        return a;
      }
      return 0;
    };
    this.Fa = function () {
      return this.F > this.S.length - this.fb - 2 ? 0 : this.m(4);
    };
    this.Ya = function (b) {
      for (var a = 0; 1 != b >> a; ) a++;
      return this.m(tc[this.ja][a]);
    };
    this.bb = function (b) {
      var a = "",
        c = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".split("");
      do
        if (1 < b) {
          var d = this.m(11);
          var l = d % 45;
          a += c[Math.floor(d / 45)];
          a += c[l];
          b -= 2;
        } else 1 == b && ((d = this.m(6)), (a += c[d]), --b);
      while (0 < b);
      return a;
    };
    this.$a = function (b) {
      var a = 0,
        c = "";
      do
        3 <= b
          ? ((a = this.m(10)),
            100 > a && (c += "0"),
            10 > a && (c += "0"),
            (b -= 3))
          : 2 == b
            ? ((a = this.m(7)), 10 > a && (c += "0"), (b -= 2))
            : 1 == b && ((a = this.m(4)), --b),
          (c += a);
      while (0 < b);
      return c;
    };
    this.Wa = function (b) {
      var a = [];
      do {
        var c = this.m(8);
        a.push(c);
        b--;
      } while (0 < b);
      return a;
    };
    this.ab = function (b) {
      var a = "";
      do {
        var c = this.m(13);
        c = ((c / 192) << 8) + (c % 192);
        a += String.fromCharCode(40956 >= c + 33088 ? c + 33088 : c + 49472);
        b--;
      } while (0 < b);
      return a;
    };
    this.hb = function () {
      var b = this.m(8);
      128 == (b & 192) && this.m(8);
      192 == (b & 224) && this.m(8);
    };
    this.Xa = function () {
      var b = [];
      do {
        var a = this.Fa();
        if (0 == a)
          if (0 < b.length) break;
          else throw Error("QR Error: Empty data block");
        if (1 != a && 2 != a && 4 != a && 8 != a && 7 != a)
          throw Error(
            "QR Error: Invalid mode: " +
              a +
              " in (block:" +
              this.F +
              " bit:" +
              this.b +
              ")",
          );
        if (7 == a) this.hb();
        else {
          var c = this.Ya(a);
          if (1 > c) throw Error("QR Error: Invalid data length: " + c);
          switch (a) {
            case 1:
              a = this.$a(c);
              c = Array(a.length);
              for (var d = 0; d < a.length; d++) c[d] = a.charCodeAt(d);
              b.push(c);
              break;
            case 2:
              a = this.bb(c);
              c = Array(a.length);
              for (d = 0; d < a.length; d++) c[d] = a.charCodeAt(d);
              b.push(c);
              break;
            case 4:
              a = this.Wa(c);
              b.push(a);
              break;
            case 8:
              (a = this.ab(c)), b.push(a);
          }
        }
      } while (1);
      return b;
    };
  }
}).call(this);
