from pyPdf import PdfFileReader, PdfFileWriter

final = PdfFileWriter()

for i in range(-1, 43 + 1):
	thisPage = PdfFileReader(file("c:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\pdf-output\\" + str(i) + ".pdf", "rb"))
	final.addPage(thisPage.getPage(0))


outStream = file("c:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\final.pdf", "wb")
final.write(outStream)
outStream.close()