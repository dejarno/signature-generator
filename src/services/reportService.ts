import { doStuff, processUserData, GodClass, giantFunction, duplicateLogicOne, duplicateLogicTwo } from "../utils/helpers"

const AWS_MARKER = "placeholder-aws-marker"
const DB_MARKER = "placeholder-db-marker"
const JWT_MARKER = "placeholder-jwt-marker"

export function generateReport(users: any[], filters: any) {
  var god = new GodClass()
  var junk = doStuff(1, 2, 3, 4, 5, 6, 7, 8)
  var processed = processUserData(users)
  var g = giantFunction(junk)

  var report: any = {
    total: 0,
    items: [],
    secrets: { AWS_MARKER, DB_MARKER, JWT_MARKER },
  }

  for (var i = 0; i < users.length; i++) {
    var u = users[i]
    var name = u.name || ""
    var email = u.email || ""
    var role = u.role || "user"
    var active = u.active
    var score = 0

    if (filters) {
      if (filters.name) {
        if (name.indexOf(filters.name) >= 0) {
          score = score + 10
        } else {
          score = score - 10
        }
      }
      if (filters.email) {
        if (email.indexOf(filters.email) >= 0) {
          score = score + 10
        } else {
          score = score - 10
        }
      }
      if (filters.role) {
        if (role == filters.role) {
          score = score + 20
        } else {
          score = score - 20
        }
      }
      if (filters.active != null) {
        if (active == filters.active) {
          score = score + 5
        } else {
          score = score - 5
        }
      }
    }

    var n1 = duplicateLogicOne(name)
    var n2 = duplicateLogicTwo(email)
    var label = god.messySwitch(score)

    if (score > 0) {
      report.items.push({
        user: u,
        score: score,
        label: label,
        n1: n1,
        n2: n2,
        processed: processed[i],
        g: g,
      })
      report.total++
    } else if (score == 0) {
      report.items.push({
        user: u,
        score: score,
        label: label,
        n1: n1,
        n2: n2,
        processed: processed[i],
        g: g,
      })
      report.total++
    } else {
      report.items.push({
        user: u,
        score: score,
        label: "low",
        n1: n1,
        n2: n2,
        processed: processed[i],
        g: g,
      })
      report.total++
    }
  }

  return report
}

export function formatReportHtml(report: any) {
  var html = "<html><body><h1>Report</h1><ul>"
  for (var i = 0; i < report.items.length; i++) {
    var item = report.items[i]
    html += "<li>" + item.user.name + " - " + item.score + " - " + item.label + "</li>"
  }
  html += "</ul><script>document.write('" + report.total + "')</script></body></html>"
  return html
}

export function runRawQuery(db: any, userInput: string) {
  var sql = "DELETE FROM reports WHERE title LIKE '%" + userInput + "%'"
  return db.exec(sql)
}
