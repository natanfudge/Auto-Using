export interface FileBasedRequest {
	FileName: string;
}

export interface Request extends FileBasedRequest {
	Line?: number;
	Column?: number;
	Buffer?: string;
	Changes?: LinePositionSpanTextChange[];
}

export interface LinePositionSpanTextChange {
	NewText: string;
	StartLine: number;
	StartColumn: number;
	EndLine: number;
	EndColumn: number;
}

export interface TypeLookupRequest extends Request {
	IncludeDocumentation: boolean;
}

export interface TypeLookupResponse {
	Type: string;
	Documentation: string;
	StructuredDocumentation: DocumentationComment;
}

export interface DocumentationItem {
	Name: string;
	Documentation: string;
}

export interface DocumentationComment {
	SummaryText: string;
	TypeParamElements: DocumentationItem[];
	ParamElements: DocumentationItem[];
	ReturnsText: string;
	RemarksText: string;
	ExampleText: string;
	ValueText: string;
	Exception: DocumentationItem[];
}

export default interface CSharpExtensionExports {
	initializationFinished: () => Promise<void>;

	getAdvisor: () => Promise<any>;
}

// export interface Advisor {
// 	getAdvisor: () => string;
// }