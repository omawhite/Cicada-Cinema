/**
 * Stand-in for the Postgres and MySQL drivers.
 *
 * `@withstudiocms/kysely` ships a driver module per dialect and StudioCMS
 * dynamic-imports whichever one `db.dialect` names. This project is on libSQL,
 * so the other two are never executed — but the bundler still has to resolve
 * their `pg` / `mysql2` imports, which are optional peers we do not install.
 * Aliasing both to this module satisfies the bundler and keeps the driver we
 * do not use out of the Worker.
 */
const unavailable = (driver: string) => (): never => {
  throw new Error(
    `The ${driver} driver is not installed. This project uses libSQL; ` +
      "set `db.dialect` in studiocms.config.mjs and install the driver to change that.",
  );
};

export const Pool = unavailable("pg");
export const createPool = unavailable("mysql2");
export default { Pool, createPool };
