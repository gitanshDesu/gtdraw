import React, { ReactNode } from "react";

export default function Table() {
  return (
    <div>
      <TableHeader className="pl-32">
        <Column />
      </TableHeader>
      <Row className="flex sm:gap-96 sm:pl-48 sm:px-16 sm:py-4 border-y-[1px] border-slate-400">
        <div className="sm:mr-4">
          <RowChild>Rough Work</RowChild>
        </div>
        <div className="flex justify-between sm:gap-32 sm:ml-32">
          <RowChild className="sm:min-w-32 sm:-pr-8 flex justify-center sm:-mr-20">
            3 months ago
          </RowChild>
          <RowChild className="sm:min-w-32 sm:-pr-8 flex justify-center sm:-mr-20">
            2 days ago
          </RowChild>
          <RowChild className="flex justify-center items-center sm:min-w-16">
            G
          </RowChild>
        </div>
      </Row>
    </div>
  );
}

function TableHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function Column() {
  return (
    <div className=" flex justify-between sm:gap-96 sm:px-16 sm:py-2 sm:mr-96 sm:min-w-1/2">
      <ColumnHeading>Name</ColumnHeading>
      <div className="flex justify-between gap-32 ml-52">
        <ColumnHeading>Created</ColumnHeading>
        <ColumnHeading>Edited</ColumnHeading>
        <ColumnHeading>Author</ColumnHeading>
      </div>
    </div>
  );
}

function ColumnHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function Row({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function RowChild({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
