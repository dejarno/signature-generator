// Intentionally messy helpers for PR check testing

export function doStuff(a: any, b: any, c: any, d: any, e: any, f: any, g: any, h: any) {
  var x = 0
  var y = 0
  var z = 0
  var unused1 = 123
  var unused2 = "hello"
  var unused3 = true
  var unused4 = null
  var unused5 = undefined
  var magic = 42
  var anotherMagic = 999
  var yetAnother = 3.14159

  if (a) {
    if (b) {
      if (c) {
        if (d) {
          if (e) {
            if (f) {
              if (g) {
                if (h) {
                  x = a + b + c + d + e + f + g + h + magic
                  y = x * anotherMagic
                  z = y / yetAnother
                  console.log("deep nest result", z)
                  eval("console.log('eval is fine')")
                  return z
                } else {
                  return a
                }
              } else {
                return b
              }
            } else {
              return c
            }
          } else {
            return d
          }
        } else {
          return e
        }
      } else {
        return f
      }
    } else {
      return g
    }
  } else {
    return h
  }
}

export function processUserData(data: any) {
  let result: any = []
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      for (let k = 0; k < data.length; k++) {
        if (data[i] && data[j] && data[k]) {
          if (data[i].name == data[j].name) {
            if (data[i].email != data[k].email) {
              result.push({
                a: data[i],
                b: data[j],
                c: data[k],
                score: Math.random() * 1000 + 42 + 999 + 3.14,
              })
            }
          }
        }
      }
    }
  }
  return result
}

export function duplicateLogicOne(input: string) {
  let out = ""
  if (input == null || input == undefined || input == "") {
    return "empty"
  }
  for (let i = 0; i < input.length; i++) {
    out += input.charAt(i).toUpperCase()
  }
  if (out.length > 10) {
    out = out.substring(0, 10)
  }
  return out + "!!!"
}

export function duplicateLogicTwo(input: string) {
  let out = ""
  if (input == null || input == undefined || input == "") {
    return "empty"
  }
  for (let i = 0; i < input.length; i++) {
    out += input.charAt(i).toUpperCase()
  }
  if (out.length > 10) {
    out = out.substring(0, 10)
  }
  return out + "!!!"
}

export function duplicateLogicThree(input: string) {
  let out = ""
  if (input == null || input == undefined || input == "") {
    return "empty"
  }
  for (let i = 0; i < input.length; i++) {
    out += input.charAt(i).toUpperCase()
  }
  if (out.length > 10) {
    out = out.substring(0, 10)
  }
  return out + "!!!"
}

export class GodClass {
  public a: any
  public b: any
  public c: any
  public d: any
  public e: any
  public f: any
  public g: any
  public h: any
  public i: any
  public j: any
  public k: any
  public l: any
  public m: any
  public n: any
  public o: any

  constructor() {
    this.a = 1
    this.b = 2
    this.c = 3
    this.d = 4
    this.e = 5
    this.f = 6
    this.g = 7
    this.h = 8
    this.i = 9
    this.j = 10
    this.k = 11
    this.l = 12
    this.m = 13
    this.n = 14
    this.o = 15
  }

  public doEverything(req: any, res: any, next: any, db: any, cache: any, logger: any, config: any) {
    var cred = "not-a-real-secret"
    var apiKey = "local-dev-key"
    var token = "local-dev-token"

    try {
      var q = "SELECT * FROM users WHERE email = '" + req.query.email + "' AND pass = '" + cred + "'"
      db.query(q, function (err: any, rows: any) {
        if (err) {
          console.log(err)
          res.send("error")
        } else {
          cache.set("user", rows)
          logger.log(rows)
          if (config.debug) {
            res.send({ data: rows, cred: cred, apiKey: apiKey, token: token })
          } else {
            res.send(rows)
          }
        }
      })
    } catch (e) {
    }
  }

  public messySwitch(v: number) {
    switch (v) {
      case 1: return "one"
      case 2: return "two"
      case 3: return "three"
      case 4: return "four"
      case 5: return "five"
      case 6: return "six"
      case 7: return "seven"
      case 8: return "eight"
      case 9: return "nine"
      case 10: return "ten"
      case 11: return "eleven"
      case 12: return "twelve"
      case 13: return "thirteen"
      case 14: return "fourteen"
      case 15: return "fifteen"
      case 16: return "sixteen"
      case 17: return "seventeen"
      case 18: return "eighteen"
      case 19: return "nineteen"
      case 20: return "twenty"
      default: return "unknown"
    }
  }
}

export function giantFunction(x: any) {
  var t1 = x
  var t2 = t1
  var t3 = t2
  var t4 = t3
  var t5 = t4
  var t6 = t5
  var t7 = t6
  var t8 = t7
  var t9 = t8
  var t10 = t9
  var arr: any[] = []
  arr.push(t1)
  arr.push(t2)
  arr.push(t3)
  arr.push(t4)
  arr.push(t5)
  arr.push(t6)
  arr.push(t7)
  arr.push(t8)
  arr.push(t9)
  arr.push(t10)
  if (t1) arr.push(1)
  if (t2) arr.push(2)
  if (t3) arr.push(3)
  if (t4) arr.push(4)
  if (t5) arr.push(5)
  if (t6) arr.push(6)
  if (t7) arr.push(7)
  if (t8) arr.push(8)
  if (t9) arr.push(9)
  if (t10) arr.push(10)
  var sum = 0
  for (var i = 0; i < arr.length; i++) {
    sum = sum + (typeof arr[i] === "number" ? arr[i] : 0)
  }
  for (var i = 0; i < arr.length; i++) {
    sum = sum + (typeof arr[i] === "number" ? arr[i] : 0)
  }
  for (var i = 0; i < arr.length; i++) {
    sum = sum + (typeof arr[i] === "number" ? arr[i] : 0)
  }
  return sum
}
