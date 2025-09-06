namespace Booking.Application.Abstractions;

public interface ILogicDispatcher
{
    Task<TResult> SendAsync<TResult>(IQuery<TResult> query, CancellationToken cancellationToken = default);
    Task<TResult> SendAsync<TResult>(ICommand<TResult> command, CancellationToken cancellationToken = default);
    Task SendAsync(ICommand command, CancellationToken cancellationToken = default);
}

public class LogicDispatcher : ILogicDispatcher
{
    private readonly IServiceProvider _serviceProvider;

    public LogicDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<TResult> SendAsync<TResult>(IQuery<TResult> query, CancellationToken cancellationToken = default)
    {
        var queryType = query.GetType();
        var handlerType = typeof(IQueryHandler<,>).MakeGenericType(queryType, typeof(TResult));
        
        var handler = _serviceProvider.GetService(handlerType);
        if (handler == null)
            throw new InvalidOperationException($"No handler registered for query type {queryType.Name}");

        var method = handlerType.GetMethod("HandleAsync");
        if (method == null)
            throw new InvalidOperationException($"HandleAsync method not found on handler for {queryType.Name}");

        var result = method.Invoke(handler, new object[] { query, cancellationToken });
        if (result is Task<TResult> task)
            return await task;

        throw new InvalidOperationException($"Handler for {queryType.Name} did not return expected type");
    }

    public async Task<TResult> SendAsync<TResult>(ICommand<TResult> command, CancellationToken cancellationToken = default)
    {
        var commandType = command.GetType();
        var handlerType = typeof(ICommandHandler<,>).MakeGenericType(commandType, typeof(TResult));
        
        var handler = _serviceProvider.GetService(handlerType);
        if (handler == null)
            throw new InvalidOperationException($"No handler registered for command type {commandType.Name}");

        var method = handlerType.GetMethod("HandleAsync");
        if (method == null)
            throw new InvalidOperationException($"HandleAsync method not found on handler for {commandType.Name}");

        var result = method.Invoke(handler, new object[] { command, cancellationToken });
        if (result is Task<TResult> task)
            return await task;

        throw new InvalidOperationException($"Handler for {commandType.Name} did not return expected type");
    }

    public async Task SendAsync(ICommand command, CancellationToken cancellationToken = default)
    {
        var commandType = command.GetType();
        var handlerType = typeof(ICommandHandler<>).MakeGenericType(commandType);
        
        var handler = _serviceProvider.GetService(handlerType);
        if (handler == null)
            throw new InvalidOperationException($"No handler registered for command type {commandType.Name}");

        var method = handlerType.GetMethod("HandleAsync");
        if (method == null)
            throw new InvalidOperationException($"HandleAsync method not found on handler for {commandType.Name}");

        var result = method.Invoke(handler, new object[] { command, cancellationToken });
        if (result is Task task)
            await task;
        else
            throw new InvalidOperationException($"Handler for {commandType.Name} did not return a Task");
    }
}