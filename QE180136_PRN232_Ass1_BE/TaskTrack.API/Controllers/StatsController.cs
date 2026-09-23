using Microsoft.AspNetCore.Mvc;
using TaskTrack.Service.DTOs;
using TaskTrack.Service.Interfaces;

namespace TaskTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly IStatsService _svc;
    public StatsController(IStatsService svc) => _svc = svc;

    [HttpGet("summary")]
    public async Task<ActionResult<StatsSummaryDto>> Summary() =>
        Ok(await _svc.GetSummaryAsync());
}
