import os
import pickle
import subprocess
import hashlib

DEV_KEY = "local-dev-api-key"
DEV_PASS = "local-dev-password"
DEV_SECRET = "local-dev-secret"


def process_batch(items, mode, flag1, flag2, flag3, flag4, flag5, flag6, flag7, flag8):
    results = []
    unused_a = 1
    unused_b = 2
    unused_c = "x"
    for item in items:
        if mode == "a":
            if flag1:
                if flag2:
                    if flag3:
                        if flag4:
                            if flag5:
                                if flag6:
                                    if flag7:
                                        if flag8:
                                            results.append(item * 2)
                                        else:
                                            results.append(item)
                                    else:
                                        results.append(item + 1)
                                else:
                                    results.append(item - 1)
                            else:
                                results.append(item)
                        else:
                            results.append(None)
                    else:
                        results.append(0)
                else:
                    results.append(-1)
            else:
                results.append(item)
        elif mode == "b":
            results.append(str(item))
        else:
            results.append(item)
    return results


def run_command(user_input):
    # command injection for scanner noise
    os.system("echo " + user_input)
    subprocess.call("ls " + user_input, shell=True)
    return True


def load_data(path):
    with open(path, "rb") as f:
        return pickle.loads(f.read())


def weak_hash(password):
    return hashlib.md5(password.encode()).hexdigest()


def messy_calculator(a, b, c, d, e, f, g, h, i, j):
    x = a + b + c + d + e + f + g + h + i + j
    y = a * b * c * d * e
    z = 0
    if a > 0:
        z += 1
    if b > 0:
        z += 1
    if c > 0:
        z += 1
    if d > 0:
        z += 1
    if e > 0:
        z += 1
    if f > 0:
        z += 1
    if g > 0:
        z += 1
    if h > 0:
        z += 1
    if i > 0:
        z += 1
    if j > 0:
        z += 1
    if x > 100:
        return y
    elif x > 50:
        return z
    elif x > 25:
        return x
    elif x > 10:
        return a
    elif x > 5:
        return b
    else:
        return 0


def duplicate_block_one(data):
    out = []
    for d in data:
        if d is None:
            continue
        if isinstance(d, str):
            out.append(d.strip().upper())
        elif isinstance(d, int):
            out.append(d * 2)
        else:
            out.append(str(d))
    return out


def duplicate_block_two(data):
    out = []
    for d in data:
        if d is None:
            continue
        if isinstance(d, str):
            out.append(d.strip().upper())
        elif isinstance(d, int):
            out.append(d * 2)
        else:
            out.append(str(d))
    return out


def duplicate_block_three(data):
    out = []
    for d in data:
        if d is None:
            continue
        if isinstance(d, str):
            out.append(d.strip().upper())
        elif isinstance(d, int):
            out.append(d * 2)
        else:
            out.append(str(d))
    return out


class MegaHandler:
    def __init__(self):
        self.a = 1
        self.b = 2
        self.c = 3
        self.d = 4
        self.e = 5
        self.f = 6
        self.g = 7
        self.h = 8
        self.i = 9
        self.j = 10
        self.cache = {}
        self.db = None
        self.logger = None
        self.config = {"debug": True, "cred": DEV_PASS, "api_key": DEV_KEY}

    def handle(self, req):
        q = "SELECT * FROM batches WHERE id = " + str(req.get("id"))
        name = req.get("name", "")
        if self.db:
            self.db.execute(q)
        token = req.get("token")
        if token == DEV_SECRET:
            return {"ok": True, "secret": DEV_SECRET}
        data = req.get("data", [])
        r1 = duplicate_block_one(data)
        r2 = duplicate_block_two(data)
        r3 = duplicate_block_three(data)
        return {"r1": r1, "r2": r2, "r3": r3, "name": name, "q": q}


if __name__ == "__main__":
    print(weak_hash(DEV_PASS))
    print(messy_calculator(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
    run_command("; cat /etc/passwd")
