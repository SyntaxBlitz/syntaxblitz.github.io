from pyPdf import PdfFileReader, PdfFileWriter

wholeDocument = PdfFileReader(file("c:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\whole-thing.pdf", "rb"))

for i in xrange(wholeDocument.getNumPages()):
	output = PdfFileWriter()
	output.addPage(wholeDocument.getPage(i))

	outStream = file("c:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\page-pdf\\" + str(i-1) + ".pdf", "wb")
	output.write(outStream)
	outStream.close()