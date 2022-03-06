import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { formAppearance } from '../../util';

/**
 * The state of the editor.
 */
export type MarkdownEditorState = 'EDITOR' | 'VIEWER' | 'BOTH';

/**
 * A markdown viewer and editor.
 */
@Component({
  selector: 'eno-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
})
export class MarkdownEditorComponent implements OnInit {
  @Input() content: string | undefined;
  @Input() initialState: MarkdownEditorState = 'BOTH';
  @Output() onChange = new EventEmitter<string>();
  public editorState = this.initialState;
  public formAppearance = formAppearance;

  public ngOnInit(): void {
    setTimeout(() => {
      this.updateTextareaHeight();
    }, 100);
  }

  /**
   * Set the editor state.
   *
   * @param state The new editor state.
   */
  public setEditorState(state: MarkdownEditorState) {
    this.editorState = state;
  }

  /**
   * Called when the content changes.
   */
  public onContentChange(): void {
    this.onChange.emit(this.content);
    this.updateTextareaHeight();
  }

  /**
   * Update the height of the textarea when the content inside changes.
   */
  public updateTextareaHeight(): void {
    const textarea = document.getElementById(
      'markdown-editor-content'
    ) as HTMLElement;
    textarea.style.height = '';
    textarea.style.height = textarea.scrollHeight + 10 + 'px';
  }
}
