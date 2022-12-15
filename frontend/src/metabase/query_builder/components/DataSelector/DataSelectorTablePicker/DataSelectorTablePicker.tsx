import React from "react";
import { t } from "ttag";

import MetabaseSettings from "metabase/lib/settings";
import { isSyncCompleted } from "metabase/lib/syncing";

import Icon from "metabase/components/Icon";
import AccordionList from "metabase/core/components/AccordionList";
import ExternalLink from "metabase/core/components/ExternalLink";
import type { Database } from "metabase-types/api/database";
import { isNotNull } from "metabase/core/utils/types";
import type Schema from "metabase-lib/metadata/Schema";
import type Table from "metabase-lib/metadata/Table";
import DataSelectorSectionHeader from "../DataSelectorSectionHeader";

import { DataSelectorSection as Section } from "../DataSelector.styled";
import {
  DataSelectorTablePickerContainer as Container,
  DataSelectorTablePickerHeaderContainer as HeaderContainer,
  DataSelectorTablePickerHeaderClickable as HeaderClickable,
  DataSelectorTablePickerHeaderDatabaseName as HeaderDatabaseName,
  DataSelectorTablePickerHeaderSchemaName as HeaderSchemaName,
  LinkToDocsContainer,
  NoTablesFound,
} from "./DataSelectorTablePicker.styled";

type DataSelectorTablePickerProps = {
  hasFiltering?: boolean;
  hasInitialFocus?: boolean;
  hasNextStep?: boolean;
  isLoading?: boolean;
  minTablesToShowSearch?: number;
  schemas: Schema[];
  selectedDatabase: Database;
  selectedSchema?: Schema;
  selectedTable?: Table;
  tables: Table[];
  onBack?: () => void;
  onChangeTable: (table: Table) => void;
  user: any;
};

type HeaderProps = Pick<
  DataSelectorTablePickerProps,
  "schemas" | "selectedSchema" | "selectedDatabase" | "onBack"
>;

const DataSelectorTablePicker = ({
  schemas,
  tables,
  selectedDatabase,
  selectedSchema,
  selectedTable,
  onChangeTable,
  hasNextStep,
  onBack,
  isLoading,
  // hasFiltering,
  // minTablesToShowSearch = 10,
  hasInitialFocus,
  user,
}: DataSelectorTablePickerProps) => {
  // In case DataSelector props get reset
  if (!selectedDatabase) {
    if (onBack) {
      onBack();
    }
    return null;
  }

  const isSavedQuestionList = selectedDatabase.is_saved_questions;
  const allowShowHeader = user && user.is_superuser;
  const header = (
    allowShowHeader ? (<Header
      onBack={onBack}
      schemas={schemas}
      selectedDatabase={selectedDatabase}
      selectedSchema={selectedSchema}
    />) : <div />
  );

  const sections = [
    {
      name: header,
      // items: tables.filter(isNotNull).map(table => ({
      //   name: table.displayName(),
      //   table: table,
      //   database: selectedDatabase,
      // })),
      type: "tree",
      loading: isLoading,
    },
  ];

  const checkIfItemIsClickable = ({ table }: { table: Table }) =>
    table && isSyncCompleted(table);

  const checkIfItemIsSelected = ({ table }: { table: Table }) =>
    table && selectedTable ? table.id === selectedTable.id : false;

  const renderItemIcon = ({ table }: { table: Table }) =>
    table ? <Icon name="table2" size={18} /> : null;

  const handleChange = ({ table }: { table: Table }) => onChangeTable(table);

  return (
    <Container>
      <AccordionList
        id="TablePicker"
        key="tablePicker"
        className="text-brand"
        hasInitialFocus={hasInitialFocus}
        sections={sections}
        selectedDatabaseId={selectedDatabase.id}
        maxHeight={Infinity}
        width="100%"
        searchable={false}
        onChange={handleChange}
        itemIsSelected={checkIfItemIsSelected}
        itemIsClickable={checkIfItemIsClickable}
        renderItemIcon={renderItemIcon}
        showItemArrows={hasNextStep}
      />

      {/*{isSavedQuestionList && (
        <LinkToDocsOnReferencingSavedQuestionsInQueries />
      )}*/}
    </Container>
  );
}

const LinkToDocsOnReferencingSavedQuestionsInQueries = () => (
  <LinkToDocsContainer>
    {t`Is a question missing?`}
    <ExternalLink
      href={MetabaseSettings.docsUrl(
        "questions/native-editor/referencing-saved-questions-in-queries",
      )}
      target="_blank"
      className="block link"
    >
      {t`Learn more about nested queries`}
    </ExternalLink>
  </LinkToDocsContainer>
);

const Header = ({
  onBack,
  schemas,
  selectedDatabase,
  selectedSchema,
}: HeaderProps) => (
  <HeaderContainer>
    <HeaderClickable onClick={onBack}>
      {onBack && <Icon name="chevronleft" size={18} />}
      <HeaderDatabaseName>{selectedDatabase.name}</HeaderDatabaseName>
    </HeaderClickable>

    {selectedSchema?.name && schemas.length > 1 && (
      <HeaderSchemaName>- {selectedSchema.displayName()}</HeaderSchemaName>
    )}
  </HeaderContainer>
);

export default DataSelectorTablePicker;
