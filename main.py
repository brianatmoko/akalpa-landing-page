import os
import signal
import subprocess
import time
import urllib.request

PORT = 5173
URL = f"http://localhost:{PORT}"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROME = "/usr/bin/google-chrome"


def is_server_ready():
    try:
        urllib.request.urlopen(URL, timeout=1)
        return True
    except Exception:
        return False


def open_chrome():
    subprocess.Popen([CHROME, URL], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Chrome dibuka di {URL}")


def main():
    os.chdir(BASE_DIR)
    dev = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        preexec_fn=os.setsid,
    )
    print("Menjalankan dev server...")
    try:
        for _ in range(60):
            if is_server_ready():
                break
            if dev.poll() is not None:
                print("Dev server gagal berjalan. Jalankan `npm install` dulu.")
                return
            time.sleep(1)
        if not is_server_ready():
            print("Server tidak merespons, periksa port 5173.")
            return
        print(f"Server aktif di {URL}")
        open_chrome()
        while dev.poll() is None:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        os.killpg(os.getpgid(dev.pid), signal.SIGTERM)
        print("\nDev server dihentikan.")


if __name__ == "__main__":
    main()
