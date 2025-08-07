import Fuse from "fuse.js";
import {SelectedGene} from "../../analysis/diff-expression/volcano/volcano";
import {PlotComponent} from "../plot.component";

export interface GeneExplorerInput{
  genesIndex: Fuse<SelectedGene> | null
  plotComponent: PlotComponent
}
