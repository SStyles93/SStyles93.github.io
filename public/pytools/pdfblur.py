import sys
import fitz  # PyMuPDF
from PIL import Image, ImageFilter
import io  # Required for in-memory buffer


def blur_pdf_region(base_path, output_path, page_num, x, y, width, height, radius=10):
    """
    Blurs a specified rectangular region on a specific page of a PDF.
    This version uses an in-memory buffer for safer image handling.

    Args:
        base_path (str): The path to the input PDF file.
        output_path (str): The path to save the output PDF file.
        page_num (int): The page number to modify (1-based index).
        x (int): The x-coordinate of the top-left corner of the blur area.
        y (int): The y-coordinate of the top-left corner of the blur area.
        width (int): The width of the blur area.
        height (int): The height of the blur area.
        radius (int, optional): The radius of the blur. Defaults to 10.
    """
    try:
        # Open the base PDF
        doc = fitz.open(base_path)
    except Exception as e:
        print(f"Error: Could not open PDF file '{base_path}'. Reason: {e}")
        return

    if not (0 < page_num <= len(doc)):
        print(f"Error: Invalid page number {page_num}. The PDF has {len(doc)} pages.")
        doc.close()
        return

    # --- Convert the specified page to an image ---
    page = doc.load_page(page_num - 1)

    # Use a higher DPI for better quality when converting page to image
    zoom = 300 / 72
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)

    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    # --- Apply the blur to the image region ---
    img_x = int(x * zoom)
    img_y = int(y * zoom)
    img_width = int(width * zoom)
    img_height = int(height * zoom)

    box = (img_x, img_y, img_x + img_width, img_y + img_height)

    region_to_blur = img.crop(box)
    blurred_region = region_to_blur.filter(ImageFilter.GaussianBlur(radius=radius))
    img.paste(blurred_region, box)

    # --- Save the modified image to an in-memory buffer ---
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")  # Save as PNG to the buffer
    buffer.seek(0)  # Rewind the buffer to the beginning

    # --- Replace the original page with the new blurred image ---
    # Define the rectangle where the image will be placed (the whole page)
    rect = page.rect

    # First, delete the old page
    doc.delete_page(page_num - 1)

    # Then, insert a new blank page at the same position
    new_page = doc.new_page(pno=page_num - 1, width=rect.width, height=rect.height)

    # Insert the blurred image from the buffer onto the new page
    new_page.insert_image(rect, stream=buffer)

    # --- Save the final PDF ---
    try:
        # Use garbage collection to remove unused objects for a smaller file size
        doc.save(output_path, garbage=4, deflate=True, clean=True)
        print(f"Successfully saved the blurred PDF to '{output_path}'")
    except Exception as e:
        print(f"An error occurred while saving the PDF: {e}")
    finally:
        doc.close()
        buffer.close()


if __name__ == "__main__":
    args = sys.argv[1:]

    if len(args) < 7 or len(args) > 8:
        print(
            "Usage: python blur_pdf_region.py <base_pdf> <output_pdf> <page_number> <x> <y> <width> <height> [radius]")
        print("\nExample: python blur_pdf_region.py input.pdf output.pdf 1 50 100 200 50 15")
        sys.exit(1)

    base_pdf = args[0]
    output_pdf = args[1]

    try:
        page_number = int(args[2])
        blur_x = int(args[3])
        blur_y = int(args[4])
        blur_width = int(args[5])
        blur_height = int(args[6])
    except ValueError:
        print("Error: page_number, x, y, width, and height must be integers.")
        sys.exit(1)

    blur_radius = 10
    if len(args) == 8:
        try:
            blur_radius = int(args[7])
        except ValueError:
            print("Error: Radius must be an integer.")
            sys.exit(1)

    blur_pdf_region(base_pdf, output_pdf, page_number, blur_x, blur_y, blur_width, blur_height, blur_radius)

