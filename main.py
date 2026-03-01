from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/arrange")
def arrange():
    layout_str = request.args.get("layout", "")
    flowers_str = request.args.get("flowers", "")
    message = request.args.get("msg", "")

    flowers = []

    if layout_str:
        items = layout_str.split(",")
        for item in items:
            parts = item.split(":")
            if len(parts) == 3:
                try:
                    x = float(parts[1])
                    y = float(parts[2])
                except ValueError:
                    continue
                flowers.append({
                    "id": parts[0],
                    "x": x,
                    "y": y
                })
    elif flowers_str:
        for f in flowers_str.split(","):
            if f:
                flowers.append({"id": f, "x": "", "y": ""})

    return render_template(
        "arrange.html",
        flowers=flowers,
        message=message
    )

@app.route("/create", methods=["POST"])
def create():
    flowers = request.form.getlist("flowers[]")
    msg = request.form.get("message", "")
    return redirect(url_for("arrange", flowers=",".join(flowers), msg=msg))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)