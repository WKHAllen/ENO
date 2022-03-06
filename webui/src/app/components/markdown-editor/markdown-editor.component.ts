import { Component, Input } from '@angular/core';
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
export class MarkdownEditorComponent {
  @Input() content: string | undefined;
  @Input() initialState: MarkdownEditorState = 'BOTH';
  public editorState = this.initialState;
  public formAppearance = formAppearance;

  /**
   * Set the editor state.
   *
   * @param state The new editor state.
   */
  public setEditorState(state: MarkdownEditorState) {
    this.editorState = state;
  }

  /**
   * Update the height of the textarea when the content inside changes.
   */
  public updateTextareaHeight(): void {
    const textarea = document.getElementById('content') as HTMLElement;
    textarea.style.height = '';
    textarea.style.height = textarea.scrollHeight + 10 + 'px';
  }
}
