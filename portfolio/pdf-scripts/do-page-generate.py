import subprocess
from music21 import *
from pyPdf import PdfFileReader, PdfFileWriter
from reportlab.pdfgen import canvas
from reportlab.lib import pagesizes
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# some important constants
MUSIC_XML_DIR	= "C:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\music-xml\\"
MUSIC_LY_DIR	= "C:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\music-ly\\"
MUSIC_PDF_DIR	= "C:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\music-pdf\\"
PAGENUM_PDF_DIR	= "C:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\pagenum-pdf\\"
PAGE_PDF_DIR	= "C:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\page-pdf\\"
OUTPUT_DIR		= "C:\\wamp\\www\\syntaxblitz.github.io\\portfolio\\pdf-output\\"

PATH_TO_CAMBRIA	= "C:\\Windows\\Fonts\\CAMBRIA.TTC"

LILYPOND_EXE_LOCATION = r"c:\Program Files (x86)\lilypond\usr\bin\lilypond.exe"

pageNum = 0
pageNumber = str(pageNum)

numOfParts = 1

# generate .ly file in music21
music = converter.parse(MUSIC_XML_DIR + pageNumber + ".xml")
numOfParts = len(music.getElementsByClass(stream.Part))
music.write("lily", MUSIC_LY_DIR + pageNumber + ".ly")

# add styling information to .ly file
outFile = open(MUSIC_LY_DIR + pageNumber + ".ly", "a")	# 'a' opens for appending
if numOfParts == 1:
	outFile.write(file("ly-one-line.txt","r").read())	# 'r' opens for just reading
else:
	outFile.write(file("ly-two-lines.txt","r").read())	# 'r' opens for just reading
outFile.close()
		
# turn .ly into .pdf
subprocess.call([	#will wait for finish exec
	LILYPOND_EXE_LOCATION,
	"-o", MUSIC_PDF_DIR,
	MUSIC_LY_DIR + pageNumber + ".ly"
])

# merge pages and add page number:
musicLine = PdfFileReader(file(MUSIC_PDF_DIR + pageNumber + ".pdf", "rb"))
page = PdfFileReader(file(PAGE_PDF_DIR + pageNumber + ".pdf", "rb"))
page.getPage(0).mergePage(musicLine.getPage(0))

hexPageNumber = str(hex(pageNum))[2:]
pageNumberPdfCanvas = canvas.Canvas(PAGENUM_PDF_DIR + pageNumber + ".pdf", pagesize=pagesizes.letter)

pdfmetrics.registerFont(TTFont("Cambria", PATH_TO_CAMBRIA))
pageNumberPdfCanvas.setFont("Cambria", 12)

if pageNum != -1:	# title page is -1, and we don't want a page number there.
	if pageNum % 2 == 0:	# even pages are on left, so put text on right
		widthOfText = pageNumberPdfCanvas.stringWidth(hexPageNumber, "Cambria", 12)
		pageNumberPdfCanvas.drawString(inch * 8.5 - inch * .5 - widthOfText, inch * 11 - inch * .5, hexPageNumber)
	else:	# put number on left
		pageNumberPdfCanvas.drawString(inch * .5, inch * 11 - inch * .5, hexPageNumber)

pageNumberPdfCanvas.showPage()
pageNumberPdfCanvas.save()

pageNumberPdf = PdfFileReader(file(PAGENUM_PDF_DIR + pageNumber + ".pdf", "rb"))
page.getPage(0).mergePage(pageNumberPdf.getPage(0))

output = PdfFileWriter()
output.addPage(page.getPage(0))

outStream = file(OUTPUT_DIR + pageNumber + ".pdf", "wb")
output.write(outStream)
outStream.close()