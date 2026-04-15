export enum ExternalSmartProcessFieldType {
  Text = 'text',
  Number = 'number',
  Boolean = 'boolean',
  Link = 'link',
}

interface ExternalSmartProcessFieldBase {
  name: string;
}

export type ExternalSmartProcessField =
  | (ExternalSmartProcessFieldBase & {
      type: ExternalSmartProcessFieldType.Text;
    })
  | (ExternalSmartProcessFieldBase & {
      type: ExternalSmartProcessFieldType.Number;
    })
  | (ExternalSmartProcessFieldBase & {
      type: ExternalSmartProcessFieldType.Boolean;
    })
  | (ExternalSmartProcessFieldBase & {
      type: ExternalSmartProcessFieldType.Link;
      externalLinkedId: string;
    });
