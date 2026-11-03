// Cuts pictures out of the source PDF for the Lessons tab (personal study copy).
//   swift scripts/lessons-images.swift render <pdf> <page> <out.png> [width]        whole page, for looking at
//   swift scripts/lessons-images.swift boxes  <pdf> <page> [x y w h]                 picture boxes found on a page (fractions 0–1)
//   swift scripts/lessons-images.swift crop   <pdf> <page> <x> <y> <w> <h> <out.jpg> [width] [quality] [gray]
//   (gray = 1 saves line drawings in greyscale: scan colour noise goes and the file gets much smaller)
// Pages are the PDF's own page numbers (1 = cover). Boxes are fractions of the page, origin top-left.
import Foundation
import PDFKit
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
func fail(_ s: String) -> Never { FileHandle.standardError.write((s + "\n").data(using: .utf8)!); exit(1) }
guard args.count >= 4, let doc = PDFDocument(url: URL(fileURLWithPath: args[2])), let page = doc.page(at: Int(args[3])! - 1) else { fail("usage: see header") }

// Renders the page to an RGB bitmap `px` pixels wide on white.
func bitmap(_ px: Int) -> CGImage {
  let box = page.bounds(for: .mediaBox)
  let scale = CGFloat(px) / box.width
  let w = px, h = Int(box.height * scale)
  let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
  ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1)); ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
  ctx.interpolationQuality = .high
  ctx.scaleBy(x: scale, y: scale); ctx.translateBy(x: -box.minX, y: -box.minY)
  page.draw(with: .mediaBox, to: ctx)
  return ctx.makeImage()!
}

func write(_ img: CGImage, _ path: String, _ type: UTType, _ quality: Double = 0.8) {
  let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: path) as CFURL, type.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(dest, img, [kCGImageDestinationLossyCompressionQuality: quality] as CFDictionary)
  if !CGImageDestinationFinalize(dest) { fail("could not write \(path)") }
}

func gray(_ img: CGImage) -> CGImage {
  let ctx = CGContext(data: nil, width: img.width, height: img.height, bitsPerComponent: 8, bytesPerRow: img.width, space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.none.rawValue)!
  ctx.draw(img, in: CGRect(x: 0, y: 0, width: img.width, height: img.height))
  return ctx.makeImage()!
}

func scaled(_ img: CGImage, width: Int) -> CGImage {
  if img.width <= width { return img }
  let h = Int(Double(img.height) * Double(width) / Double(img.width))
  let ctx = CGContext(data: nil, width: width, height: h, bitsPerComponent: 8, bytesPerRow: width * 4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
  ctx.interpolationQuality = .high
  ctx.draw(img, in: CGRect(x: 0, y: 0, width: width, height: h))
  return ctx.makeImage()!
}

switch args[1] {
case "render":
  let px = args.count > 5 ? Int(args[5])! : 1000
  write(bitmap(px), args[4], .png)

case "crop":
  let (x, y, w, h) = (Double(args[4])!, Double(args[5])!, Double(args[6])!, Double(args[7])!)
  let width = args.count > 9 ? Int(args[9])! : 480
  let quality = args.count > 10 ? Double(args[10])! : 0.72
  let src = bitmap(max(1600, Int(Double(width) / w * 1.2)))
  let rect = CGRect(x: x * Double(src.width), y: y * Double(src.height), width: w * Double(src.width), height: h * Double(src.height)).integral
  let out = scaled(src.cropping(to: rect)!, width: width)
  write(args.count > 11 && args[11] == "1" ? gray(out) : out, args[8], .jpeg, quality)

case "boxes":
  // Finds coloured or dark rectangles (photos, boxed pictures) by scanning for "busy" pixels:
  // a cell is busy when it isn't near-white. Connected busy cells form a box; small or thin ones are dropped.
  let img = bitmap(900)
  let W = img.width, H = img.height
  let data = CFDataGetBytePtr(img.dataProvider!.data!)!
  let bpr = img.bytesPerRow
  var region = (0.0, 0.0, 1.0, 1.0)
  if args.count >= 8 { region = (Double(args[4])!, Double(args[5])!, Double(args[6])!, Double(args[7])!) }
  let x0 = Int(region.0 * Double(W)), y0 = Int(region.1 * Double(H)), x1 = Int((region.0 + region.2) * Double(W)), y1 = Int((region.1 + region.3) * Double(H))
  let cell = 3
  let cw = (x1 - x0) / cell, ch = (y1 - y0) / cell
  var busy = [Bool](repeating: false, count: cw * ch)
  for cy in 0..<ch { for cx in 0..<cw {
    var n = 0
    for dy in 0..<cell { for dx in 0..<cell {
      let px = x0 + cx * cell + dx, py = y0 + cy * cell + dy
      let o = py * bpr + px * 4
      let r = Int(data[o]), g = Int(data[o + 1]), b = Int(data[o + 2])
      let mx = max(r, g, b), mn = min(r, g, b)
      if mx < 200 || mx - mn > 40 { n += 1 }   // dark, or clearly coloured
    } }
    busy[cy * cw + cx] = n >= 5
  } }
  var seen = [Bool](repeating: false, count: busy.count)
  var found: [(Int, Int, Int, Int, Int)] = []
  for start in 0..<busy.count where busy[start] && !seen[start] {
    var stack = [start]; seen[start] = true
    var minx = cw, miny = ch, maxx = 0, maxy = 0, count = 0
    while let i = stack.popLast() {
      let cx = i % cw, cy = i / cw; count += 1
      minx = min(minx, cx); maxx = max(maxx, cx); miny = min(miny, cy); maxy = max(maxy, cy)
      for (dx, dy) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
        let nx = cx + dx, ny = cy + dy
        if nx >= 0, ny >= 0, nx < cw, ny < ch, busy[ny * cw + nx], !seen[ny * cw + nx] { seen[ny * cw + nx] = true; stack.append(ny * cw + nx) }
      }
    }
    found.append((minx, miny, maxx, maxy, count))
  }
  let minSide = Int(args.count > 8 ? Double(args[8])! : 40) / cell
  for (minx, miny, maxx, maxy, count) in found.sorted(by: { ($0.1 / 20, $0.0) < ($1.1 / 20, $1.0) }) {
    let bw = maxx - minx + 1, bh = maxy - miny + 1
    guard bw >= minSide, bh >= minSide, Double(count) / Double(bw * bh) > 0.5 else { continue }
    let f = { (v: Int, total: Int, off: Int) in String(format: "%.4f", Double(off + v * cell) / Double(total)) }
    print(f(minx, W, x0), f(miny, H, y0), String(format: "%.4f", Double(bw * cell) / Double(W)), String(format: "%.4f", Double(bh * cell) / Double(H)))
  }

default: fail("unknown command")
}
