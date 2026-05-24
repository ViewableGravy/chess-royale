import { createFileRoute } from '@tanstack/react-router';
import { GameFiberNode } from './-game';

/***** ROUTE START *****/
export const Route = createFileRoute('/match/$matchId/')({
  component: RouteComponent,
})

/***** COMPONENT START *****/
function RouteComponent() {
  /***** RENDER *****/
  return (
    <div>
      <GameFiberNode />
    </div>
  );
}
