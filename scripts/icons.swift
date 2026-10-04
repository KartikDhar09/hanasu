// Renders icon PNGs (macOS): swift scripts/icons.swift && for n in 512 192 180; do sips -z $n $n icon-$n.png; done
import AppKit
func draw(_ size: Int, _ path: String) {
  let s = CGFloat(size), k = s / 512
  let img = NSImage(size: NSSize(width: s, height: s))
  img.lockFocus()
  let ctx = NSGraphicsContext.current!.cgContext
  ctx.translateBy(x: 0, y: s); ctx.scaleBy(x: 1, y: -1) // SVG-style coordinates
  NSColor(red: 0.784, green: 0.251, blue: 0.184, alpha: 1).setFill()
  NSBezierPath(rect: NSRect(x: 0, y: 0, width: s, height: s)).fill() // full-bleed so it works as maskable
  let cream = NSColor(red: 0.984, green: 0.969, blue: 0.941, alpha: 1)
  cream.setFill()
  let b = NSBezierPath(roundedRect: NSRect(x: 80*k, y: 150*k, width: 352*k, height: 210*k), xRadius: 40*k, yRadius: 40*k)
  b.fill()
  let tail = NSBezierPath(); tail.move(to: NSPoint(x: 170*k, y: 355*k)); tail.line(to: NSPoint(x: 250*k, y: 355*k)); tail.line(to: NSPoint(x: 170*k, y: 422*k)); tail.close(); tail.fill()
  ctx.saveGState(); ctx.translateBy(x: 0, y: s); ctx.scaleBy(x: 1, y: -1)
  let font = NSFont(name: "HiraginoSans-W7", size: 150*k) ?? NSFont.boldSystemFont(ofSize: 150*k)
  let str = NSAttributedString(string: "話", attributes: [.font: font, .foregroundColor: NSColor(red: 0.784, green: 0.251, blue: 0.184, alpha: 1)])
  let sz = str.size()
  str.draw(at: NSPoint(x: (s - sz.width)/2, y: s - 255*k - sz.height/2))
  ctx.restoreGState()
  img.unlockFocus()
  let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
}
draw(512, "icon-512.png"); draw(192, "icon-192.png"); draw(180, "icon-180.png")
