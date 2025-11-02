// Custom (local) TypeScript declarations for react-dropzone to provide
// `useDropzone` hook typings and modern API surface. Place this in
// `types/` so TypeScript picks it up alongside your other local types.

declare module "react-dropzone" {
  import * as React from "react";

  export type FileWithPath = File & { path?: string; preview?: string };

  export type Accept = string | { [mime: string]: string[] };

  export interface FileError {
    code: string;
    message: string;
  }

  export interface FileRejection {
    file: FileWithPath;
    errors: FileError[];
  }

  export interface DropzoneOptions {
    accept?: Accept;
    multiple?: boolean;
    maxSize?: number;
    minSize?: number;
    noClick?: boolean;
    noKeyboard?: boolean;
    noDrag?: boolean;
    disabled?: boolean;
    preventDropOnDocument?: boolean;
    onDrop?: (acceptedFiles: FileWithPath[], fileRejections: FileRejection[], event: DragEvent) => void;
    onDropAccepted?: (acceptedFiles: FileWithPath[], event: DragEvent) => void;
    onDropRejected?: (fileRejections: FileRejection[], event: DragEvent) => void;
    onFileDialogCancel?: () => void;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    useFsAccessApi?: boolean;
    // allow passing through arbitrary html attributes
    [key: string]: any;
  }

  export interface UseDropzoneState {
    acceptedFiles: FileWithPath[];
    fileRejections: FileRejection[];
    isDragActive: boolean;
    isDragAccept: boolean;
    isDragReject: boolean;
  }

  export interface UseDropzoneProps extends DropzoneOptions {}

  export interface DropzoneRootProps extends React.HTMLAttributes<HTMLElement> {
    ref?: React.Ref<any>;
  }

  export interface UseDropzoneReturn extends UseDropzoneState {
    getRootProps: (props?: Partial<DropzoneRootProps>) => DropzoneRootProps;
    getInputProps: (props?: React.InputHTMLAttributes<HTMLInputElement>) => React.InputHTMLAttributes<HTMLInputElement>;
    open: () => void;
  }

  export function useDropzone(props?: UseDropzoneProps): UseDropzoneReturn;

  export interface DropzoneProps extends UseDropzoneProps, React.HTMLAttributes<HTMLDivElement> {}

  export default class Dropzone extends React.Component<DropzoneProps> {
    open(): void;
  }
}
