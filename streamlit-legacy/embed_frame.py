import base64

# Read the TV frame image
with open('tv_frame_overlay.png', 'rb') as f:
    img_data = f.read()

# Convert to base64
b64_data = base64.b64encode(img_data).decode('utf-8')

# Create data URI
data_uri = f"data:image/png;base64,{b64_data}"

print("Base64 data URI generated!")
print(f"Length: {len(data_uri)} characters")
print("\nAdd this to your CSS:")
print(f"background-image: url('{data_uri[:100]}...');")

# Save to file for easy copying
with open('tv_frame_base64.txt', 'w') as f:
    f.write(data_uri)

print("\nFull base64 string saved to: tv_frame_base64.txt")
