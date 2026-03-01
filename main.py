from flask import Flask, render_template, request, redirect, url_for
import base64

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/create", methods=["POST"])
def create():
    flowers = request.form.getlist("flowers")
    message = request.form.get("message", "").strip()

    # Encode bouquet data (no DB)
    raw_data = ",".join(flowers) + "|" + message
    token = base64.urlsafe_b64encode(raw_data.encode()).decode()

    # owner=1 → creator view only
    return redirect(url_for("bouquet", token=token, owner=1))


@app.route("/b/<token>")
def bouquet(token):
    owner = request.args.get("owner") == "1"

    try:
        decoded = base64.urlsafe_b64decode(token.encode()).decode()
        flower_part, message = decoded.split("|", 1)
        flowers = flower_part.split(",") if flower_part else []
    except Exception:
        flowers = []
        message = "Invalid bouquet."

    return render_template(
        "bouquet.html",
        flowers=flowers,
        message=message,
        owner=owner
    )


if __name__ == "__main__":
    app.run(debug=True)