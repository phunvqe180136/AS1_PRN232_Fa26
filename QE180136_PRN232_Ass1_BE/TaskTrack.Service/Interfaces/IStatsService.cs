using TaskTrack.Service.DTOs;

namespace TaskTrack.Service.Interfaces;

public interface IStatsService
{
    Task<StatsSummaryDto> GetSummaryAsync();
}
