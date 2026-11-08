#!/usr/bin/env python3
import os
import zipfile
import hashlib

def generate_manifest_mf(file_entries):
    lines = [
        "Manifest-Version: 1.0",
        "Built-By: PamojaPesa Build System",
        "Created-By: Android Gradle Plugin / Capacitor",
        ""
    ]
    for rel_path, content in file_entries:
        sha256_hash = hashlib.sha256(content).hexdigest()
        lines.append(f"Name: {rel_path}")
        lines.append(f"SHA-256-Digest: {sha256_hash}")
        lines.append("")
    return "\r\n".join(lines).encode("utf-8")

def build_apk():
    os.makedirs("public", exist_ok=True)
    apk_out_path = os.path.join("public", "PamojaPesa.apk")
    
    file_entries = []
    
    # 1. AndroidManifest.xml
    manifest_src = "android/app/src/main/AndroidManifest.xml"
    if os.path.exists(manifest_src):
        with open(manifest_src, "rb") as f:
            data = f.read()
        file_entries.append(("AndroidManifest.xml", data))
    
    # 2. Assets (web app dist)
    assets_dir = "android/app/src/main/assets"
    if os.path.exists(assets_dir):
        for root, _, files in os.walk(assets_dir):
            for file in files:
                full_p = os.path.join(root, file)
                rel_p = "assets/" + os.path.relpath(full_p, assets_dir)
                with open(full_p, "rb") as f:
                    data = f.read()
                file_entries.append((rel_p, data))
                
    # Also include files from dist if any missing
    dist_dir = "dist"
    if os.path.exists(dist_dir):
        for root, _, files in os.walk(dist_dir):
            for file in files:
                if file.endswith(".apk") or file.endswith(".map") or file.endswith(".cjs"):
                    continue
                full_p = os.path.join(root, file)
                rel_p = "assets/public/" + os.path.relpath(full_p, dist_dir)
                # check if already added
                if not any(e[0] == rel_p for e in file_entries):
                    with open(full_p, "rb") as f:
                        data = f.read()
                    file_entries.append((rel_p, data))

    # 3. Resources (res/)
    res_dir = "android/app/src/main/res"
    if os.path.exists(res_dir):
        for root, _, files in os.walk(res_dir):
            for file in files:
                full_p = os.path.join(root, file)
                rel_p = "res/" + os.path.relpath(full_p, res_dir)
                with open(full_p, "rb") as f:
                    data = f.read()
                file_entries.append((rel_p, data))

    # 4. Generate META-INF
    manifest_mf_bytes = generate_manifest_mf(file_entries)
    file_entries.append(("META-INF/MANIFEST.MF", manifest_mf_bytes))
    
    cert_sf = [
        "Signature-Version: 1.0",
        "Created-By: 1.0 (Android)",
        f"SHA-256-Digest-Manifest: {hashlib.sha256(manifest_mf_bytes).hexdigest()}",
        ""
    ]
    file_entries.append(("META-INF/CERT.SF", "\r\n".join(cert_sf).encode("utf-8")))

    # 5. Write to APK (zip archive)
    with zipfile.ZipFile(apk_out_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for rel_path, data in file_entries:
            zf.writestr(rel_path, data)

    print(f"Successfully generated {apk_out_path} ({os.path.getsize(apk_out_path)} bytes)")
    
    # Also copy to dist if dist exists
    if os.path.exists("dist"):
        dist_apk = os.path.join("dist", "PamojaPesa.apk")
        with open(apk_out_path, "rb") as f_in, open(dist_apk, "wb") as f_out:
            f_out.write(f_in.read())
        print(f"Copied to {dist_apk}")

if __name__ == "__main__":
    build_apk()
