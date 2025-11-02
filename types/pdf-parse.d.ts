declare module "pdf-parse" {
	type PdfParseResult = {
		text?: string;
		info?: any;
		metadata?: any;
	};

	function pdfParse(data: Buffer | Uint8Array | string | ArrayBuffer): Promise<PdfParseResult>;
	export default pdfParse;
}
