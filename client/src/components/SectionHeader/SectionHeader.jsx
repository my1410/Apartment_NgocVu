import { Badge, Title, Wrap } from './styles.js';

export function SectionHeader({ eyebrow, title, description }) {
  return (
    <Wrap>
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <Title>{title}</Title>
      {description && <p>{description}</p>}
    </Wrap>
  );
}
