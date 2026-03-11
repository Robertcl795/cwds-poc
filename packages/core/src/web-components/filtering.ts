export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type FilterMode = 'contains' | 'startsWith';

export interface FilterStrategyOptions {
  mode?: FilterMode;
  normalize?: (value: string) => string;
}

export interface FilterStrategy {
  filter: <T extends FilterOption>(options: T[], query: string) => T[];
}

const defaultNormalize = (value: string): string => value.toLocaleLowerCase();

export const createFilterStrategy = (options: FilterStrategyOptions = {}): FilterStrategy => {
  const mode = options.mode ?? 'contains';
  const normalize = options.normalize ?? defaultNormalize;

  return {
    filter<T extends FilterOption>(inputOptions: T[], query: string): T[] {
      const normalizedQuery = normalize(query.trim());

      if (normalizedQuery.length === 0) {
        return inputOptions;
      }

      return inputOptions.filter((option) => {
        const normalizedLabel = normalize(option.label);
        return mode === 'startsWith'
          ? normalizedLabel.startsWith(normalizedQuery)
          : normalizedLabel.includes(normalizedQuery);
      });
    }
  };
};
