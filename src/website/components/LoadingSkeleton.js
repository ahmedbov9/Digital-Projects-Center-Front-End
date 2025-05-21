import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * @param {Object} props
 * @param {number} [props.line=3]
 * @param {number} [props.height=20]
 * @param {string|number} [props.width='100%']
 * @param {boolean} [props.circle=false]
 * @param {boolean} [props.avatar=false]
 * @param {number} [props.avatarSize=50]
 * @param {'row'|'column'} [props.direction='column']
 * @param {number|string} [props.gap='0.5rem']
 * @param {number} [props.borderRadius=8]
 */
export default function LoadingSkeleton({
  line = 3,
  height = 20,
  width = '100%',
  circle = false,
  avatar = false,
  avatarSize = 50,
  direction = 'column',
  gap = '0.5rem',
  borderRadius = 8,
}) {
  const isRow = direction === 'row';

  return (
    <div
      className="d-flex"
      style={{
        flexDirection: direction,
        gap,
        alignItems: 'center',
        width: '100%',
      }}
    >
      {avatar && (
        <Skeleton
          circle
          width={avatarSize}
          height={avatarSize}
          style={{ flexShrink: 0 }}
        />
      )}

      <div
        className="d-flex"
        style={{
          flexDirection: isRow ? 'row' : 'column',
          gap,
          width: '100%',
        }}
      >
        {Array.from({ length: line }).map((_, index) => (
          <Skeleton
            key={index}
            height={height}
            width={width}
            borderRadius={borderRadius}
            circle={circle}
            baseColor="#777"
            highlightColor="#f5f5f5"
            style={{
              flex: isRow ? 1 : 'none',
              width: isRow ? '100%' : width,
            }}
          />
        ))}
      </div>
    </div>
  );
}
